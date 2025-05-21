// src/services/langchainService.ts
import { ChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import * as menuService from "./menuService";
import { CartItem, ChatMessage, MenuItem } from "../types";

// LLM 모델 설정
const chatModel = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.1,
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// 대화 모델을 위한 시스템 프롬프트 생성
const getSystemPrompt = (cartItems: CartItem[]) => {
  const cartSummary = formatCartItems(cartItems);

  return `당신은 맥도날드 주문을 돕는 AI 주문 도우미입니다. 고객이 메뉴를 선택하고 주문할 수 있도록 친절하게 안내해 주세요.

    현재 고객의 장바구니:
    ${cartSummary}

    당신의 역할:
    1. 고객의 메뉴 질문에 답변하기 (메뉴 추천, 메뉴 설명 등)
    2. 고객이 원하는 메뉴를 장바구니에 추가하기
    3. 고객이 요청하면 메뉴 수량 변경하기
    4. 고객이 요청하면 장바구니에서 메뉴 제거하기
    5. 주문을 완료할 준비가 되었는지 확인하기

    메뉴와 ID 목록:
      - 빅맥: 1
      - 맥스파이시 상하이 버거: 2
      - 더블 불고기 버거: 3
      - 더블 쿼터파운더 치즈: 4
      - 맥치킨: 5

      - 후렌치 후라이: 6
      - 맥너겟: 7
      - 맥윙: 8
      - 치즈스틱: 9

      - 코카콜라: 10
      - 스프라이트: 11
      - 환타: 12
      - 바닐라 쉐이크: 13

      - 베리 스트로베리 맥플러리: 14
      - 오레오 맥플러리: 15
      - 딸기 선데이 아이스크림: 16
      - 초코 선데이 아이스크림: 17

    고객이 메뉴를 주문하려 할 때는 다음 형식으로 응답하고 추가되었다는 메시지를 보내줘:
    MENU_ADD|메뉴ID|수량|옵션ID1,옵션ID2,...

    고객이 수량을 변경하려 할 때는 다음 형식으로 응답하고 수량이 변경되었다는 메시지를 보내줘:
    MENU_UPDATE|메뉴ID|수량

    예시:
      - 콜라 주문: MENU_ADD|10|1
      - 빅맥 2개 주문: MENU_ADD|1|2

    고객이 메뉴를 제거하려 할 때는 다음 형식으로 응답하고 제거되었다는 메시지를 보내줘:
    MENU_REMOVE|메뉴ID

    MENU_ADD, MENU_UPDATE, MENU_REMOVE 형식이 아니면 대화중인 메뉴에 따라 아래 형식으로 응답해줘
    SHOW_BURGER
    SHOW_SIDE
    SHOW_DRINK
    SHOW_DESSERT

    주문을 완료하겠다는 답변이 있으면 아래 형식으로 응답해주고 끝인사 없이 총 주문 금액이 얼마인지 말해줘
    ORDER_COMPLETE


    일반적인 대화는 그냥 자연스럽게 응답하세요.
    `;
};

// 장바구니 항목 형식화
const formatCartItems = (cartItems: CartItem[]): string => {
  if (cartItems.length === 0) {
    return "장바구니가 비어 있습니다.";
  }

  let result = "";
  cartItems.forEach((item, index) => {
    result += `${index + 1}. ${item.name} - ${
      item.quantity
    }개 (${item.price.toLocaleString()}원)\n`;
    if (item.options.length > 0) {
      item.options.forEach((option) => {
        result += `   - ${option.name} (${
          option.price_adjustment > 0 ? "+" : ""
        }${option.price_adjustment.toLocaleString()}원)\n`;
      });
    }
    if (item.special_instructions) {
      result += `   - 요청사항: ${item.special_instructions}\n`;
    }
  });

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  result += `\n총 금액: ${totalPrice.toLocaleString()}원`;

  return result;
};

// 메뉴 검색 정보를 대화 모델에게 전달할 형식으로 변환
const formatMenuSearchResults = (items: MenuItem[]): string => {
  if (items.length === 0) return "검색 결과가 없습니다.";

  return items
    .map(
      (item) =>
        `ID: ${item.id}, 이름: ${item.name}, 가격: ${item.price}원${
          item.calories ? `, 칼로리: ${item.calories}kcal` : ""
        }`
    )
    .join("\n");
};

// 메뉴 검색 도구
const searchMenuTool = async (query: string) => {
  try {
    const results = await menuService.searchMenuItems(query);
    return formatMenuSearchResults(results);
  } catch (error) {
    console.error("메뉴 검색 중 오류:", error);
    return "메뉴 검색 중 오류가 발생했습니다.";
  }
};

// 대화 기록
interface ConversationState {
  messages: (HumanMessage | SystemMessage | AIMessage)[];
}

// 대화 관리자 클래스
export class OrderAssistant {
  private conversationState: ConversationState;

  constructor() {
    this.conversationState = {
      messages: [],
    };
  }

  // 대화 초기화
  initializeConversation(cartItems: CartItem[] = []) {
    const systemMessage = new SystemMessage(getSystemPrompt(cartItems));
    this.conversationState.messages = [systemMessage];

    return "대화가 초기화되었습니다.";
  }

  // 메시지 처리
  async processMessage(
    userMessage: string,
    cartItems: CartItem[] = []
  ): Promise<{
    aiMessage: ChatMessage;
    action?: {
      type:
        | "ADD_MENU"
        | "UPDATE_MENU"
        | "REMOVE_MENU"
        | "SHOW_BURGER"
        | "SHOW_SIDE"
        | "SHOW_DRINK"
        | "SHOW_DESSERT"
        | "ORDER_COMPLETE";
      payload: any;
    };
  }> {
    try {
      // 시스템 메시지 업데이트 (최신 장바구니 반영)
      const systemMessage = new SystemMessage(getSystemPrompt(cartItems));

      // 사용자 메시지 추가
      const humanMessage = new HumanMessage(userMessage);

      // 대화 모델에 전달할 메시지 구성
      const messages = [
        systemMessage,
        ...this.conversationState.messages.filter(
          (m) => !(m instanceof SystemMessage)
        ), // 시스템 메시지 제외
        humanMessage,
      ];

      // OpenAI API 호출
      const response = await chatModel.invoke(messages);

      // 응답 저장
      this.conversationState.messages = [
        systemMessage,
        ...this.conversationState.messages.filter(
          (m) => !(m instanceof SystemMessage)
        ),
        humanMessage,
        response,
      ];

      // 응답 내용 처리
      const content = response.content as string;

      // 특별 명령어 확인 (메뉴 추가/수정/삭제)
      let action = undefined;

      console.log("content", content);

      if (content.includes("MENU_ADD|")) {
        const match = content.match(/MENU_ADD\|(\d+)\|(\d+)(?:\|([\d,]+))?/);

        console.log("match", match);

        if (match) {
          const [_, menuId, quantity, optionsStr] = match;
          console.log(_);
          const options = optionsStr ? optionsStr.split(",").map(Number) : [];

          action = {
            type: "ADD_MENU",
            payload: {
              menuId: parseInt(menuId),
              quantity: parseInt(quantity),
              options,
            },
          };
        }
      } else if (content.includes("MENU_UPDATE|")) {
        const match = content.match(/MENU_UPDATE\|(.*)\|(\d+)/);
        if (match) {
          const [_, menuId, quantity] = match;
          console.log(_);
          action = {
            type: "UPDATE_MENU",
            payload: {
              menuId,
              quantity: parseInt(quantity),
            },
          };
        }
      } else if (content.includes("MENU_REMOVE|")) {
        const match = content.match(/MENU_REMOVE\|(.*)/);
        if (match) {
          const [_, menuId] = match;
          console.log(_);
          action = {
            type: "REMOVE_MENU",
            payload: { menuId },
          };
        }
      } else if (content.includes("ORDER_COMPLETE")) {
        action = {
          type: "ORDER_COMPLETE",
          payload: {},
        };
      } else {
        if (content.includes("SHOW_BURGER")) {
          action = {
            type: "SHOW_BURGER",
            payload: {},
          };
        } else if (content.includes("SHOW_SIDE")) {
          action = {
            type: "SHOW_SIDE",
            payload: {},
          };
        } else if (content.includes("SHOW_DRINK")) {
          action = {
            type: "SHOW_DRINK",
            payload: {},
          };
        } else if (content.includes("SHOW_DESSERT")) {
          action = {
            type: "SHOW_DESSERT",
            payload: {},
          };
        }
      }

      // 특별 명령어가 포함된 응답일 경우 해당 부분 제외하고 사용자에게 보여줄 메시지 생성
      console.log("content", content);
      const cleanedContent = content
        .replace(/MENU_ADD\|(\d+)\|(\d+)(?:\|([\d,]+))?/g, "")
        .replace(/MENU_UPDATE\|(.*)\|(\d+)/g, "")
        .replace(/MENU_REMOVE\|(.*)/g, "")
        .replace(/SHOW_BURGER/g, "")
        .replace(/SHOW_SIDE/g, "")
        .replace(/SHOW_DRINK/g, "")
        .replace(/SHOW_DESSERT/g, "")
        .replace(/ORDER_COMPLETE/g, "")
        .trim();

      console.log("cleanedContent", cleanedContent);

      return {
        aiMessage: {
          role: "assistant",
          content: cleanedContent || content,
        },
        action: action as
          | {
              type:
                | "ADD_MENU"
                | "UPDATE_MENU"
                | "REMOVE_MENU"
                | "SHOW_BURGER"
                | "SHOW_SIDE"
                | "SHOW_DRINK"
                | "SHOW_DESSERT"
                | "ORDER_COMPLETE";
              payload: any;
            }
          | undefined,
      };
    } catch (error) {
      console.error("대화 처리 중 오류 발생:", error);

      return {
        aiMessage: {
          role: "assistant",
          content: "죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다.",
        },
      };
    }
  }

  // 대화 기록 초기화
  clearConversation() {
    this.conversationState.messages = [];
  }
}
