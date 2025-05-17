// src/langchain/agent.ts
import { ChatOpenAI } from "@langchain/openai";
import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { HumanMessage, SystemMessage, FunctionMessage } from "@langchain/core/messages";
import { supabase } from '../services/supabase';
import { MenuCategory, MenuItem, CartItem, Order } from '../types/index';

// OpenAI 모델 설정
const model = new ChatOpenAI({
  modelName: "gpt-4o",
  temperature: 0.2,
  openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

// 시스템 프롬프트
const systemPrompt = `
당신은 맥도날드 주문을 돕는 AI 주문 도우미입니다. 고객이 메뉴를 선택하고 주문할 수 있도록 안내해 주세요.
친절하고 자연스러운, 편안한 대화를 통해 주문 과정을 진행하세요.
`;

// 데이터베이스 조회 함수 - 메뉴 카테고리 조회
async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabase
    .from("menu_categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) throw error;
  return data;
}

// 카테고리별 메뉴 조회
async function getMenuItemsByCategory(categoryId: number): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_available", true);

  if (error) throw error;
  return data;
}

// 여기에 더 많은 함수 추가 (메뉴 상세 정보, 장바구니 관리 등)...

// 도구 정의
const tools = [
  {
    name: "get_menu_categories",
    description: "메뉴 카테고리 목록을 가져옵니다.",
    func: getMenuCategories,
  },
  {
    name: "get_menu_items_by_category",
    description: "카테고리별 메뉴 목록을 가져옵니다.",
    func: getMenuItemsByCategory,
    parameters: {
      type: "object",
      properties: {
        categoryId: {
          type: "number",
          description: "카테고리 ID",
        },
      },
      required: ["categoryId"],
    },
  },
  // 여기에 더 많은 도구 추가...
];

// LangGraph 에이전트 초기 상태
const initialState = {
  messages: [],
  session_id: null,
  order: {
    items: [],
    total_price: 0,
    customer_name: null,
    phone_number: null,
  },
  current_step: "greeting",
  context: {},
};

// 에이전트 상태 그래프 정의 (여기에 더 많은 코드 추가)...

// 대화 에이전트 클래스
export class OrderAgent {
  private sessionId: string;
  private messages: any[] = [];
  private order: Order;
  
  constructor(sessionId: string) {
    this.sessionId = sessionId;
    this.order = {
      items: [],
      total_price: 0,
      customer_name: null,
      phone_number: null,
    };
  }
  
  // 메시지 전송 함수
  async sendMessage(message: string) {
    // 여기에 LangGraph를 통한 메시지 처리 로직 구현
    // ...
    
    // 더미 응답 (실제로는 LangGraph에서 처리된 결과 반환)
    return {
      role: 'assistant',
      content: '주문을 도와드리겠습니다. 어떤 메뉴를 원하시나요?'
    };
  }
  
  // 장바구니에 아이템 추가
  addToCart(item: CartItem) {
    this.order.items.push(item);
    this.order.total_price = this.order.items.reduce(
      (sum, item) => sum + item.price * item.quantity, 
      0
    );
  }
  
  // 주문 완료 함수
  async completeOrder(customerName: string, phoneNumber: string) {
    this.order.customer_name = customerName;
    this.order.phone_number = phoneNumber;
    
    // Supabase에 주문 저장 로직
    // ...
    
    return { success: true, order_id: 123 }; // 더미 응답
  }
}