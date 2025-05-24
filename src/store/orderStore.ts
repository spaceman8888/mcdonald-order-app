import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";
import { CartItem, ChatMessage, MenuCategory, MenuItem } from "../types";
import * as menuService from "../services/menuService";
import * as orderService from "../services/orderService";
import { OrderAssistant } from "../services/langchainService";

interface OrderState {
  // 세션 상태
  sessionId: string;

  // 채팅 상태
  chatMessages: ChatMessage[];
  isLoading: boolean;
  orderAssistant: OrderAssistant | null;

  // 메뉴 상태
  menuCategories: MenuCategory[];
  selectedCategoryId: number | null;
  menuItems: MenuItem[];
  isMenuLoading: boolean;

  // 장바구니 상태
  cartItems: CartItem[];

  // 주문 상태
  orderNumber: number;
  // 네비게이션 상태
  navigate: ((path: string) => void) | null;

  // 액션
  initializeSession: () => void;
  sendMessage: (message: string) => Promise<void>;
  loadMenuCategories: () => Promise<void>;
  loadMenuItems: (categoryId: number) => Promise<void>;
  selectCategory: (categoryId: number) => void;
  addToCart: (menuItem: MenuItem) => Promise<void>;
  removeFromCart: (index: number) => void;
  changeItemQuantity: (index: number, newQuantity: number) => void;
  // setCustomerInfo: (name: string, phone: string) => void;
  completeOrder: () => Promise<boolean>;
  clearCart: () => void;
  addItemToCartById: (
    menuId: number,
    quantity?: number,
    optionIds?: number[]
  ) => Promise<void>;
  updateItemQuantityByName: (menuId: number, quantity: number) => void;
  removeItemByName: (menuId: number) => void;

  setNavigate: (navigate: (path: string) => void) => void;
  setChatMessages: (chatMessages: ChatMessage[]) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  // 초기 상태
  sessionId: "",
  chatMessages: [],
  isLoading: false,
  orderAssistant: null,
  menuCategories: [],
  selectedCategoryId: null,
  menuItems: [],
  isMenuLoading: false,
  cartItems: [],
  navigate: null,
  orderNumber: 100,

  // 세션 초기화
  initializeSession: () => {
    const sessionId = uuidv4();
    const orderAssistant = new OrderAssistant();

    orderAssistant.initializeConversation();

    set({
      sessionId,
      orderAssistant,
      chatMessages: [
        {
          role: "assistant",
          content:
            "안녕하세요! 맥도날드 주문을 도와드리겠습니다. 어떤 메뉴를 원하시나요?",
        },
      ],
    });
  },

  // 메시지 전송
  sendMessage: async (message: string) => {
    const { orderAssistant, chatMessages, cartItems } = get();

    if (!orderAssistant) {
      console.error("Order assistant not initialized");
      return;
    }

    set({ isLoading: true });

    // 사용자 메시지 추가
    const updatedMessages = [
      ...chatMessages,
      { role: "user", content: message },
    ];
    set({ chatMessages: updatedMessages as ChatMessage[] });

    try {
      // 메시지 처리
      const response = await orderAssistant.processMessage(message, cartItems);

      // AI 응답 메시지 추가
      set({
        chatMessages: [
          ...(updatedMessages as ChatMessage[]),
          response.aiMessage as ChatMessage,
        ],
      });

      // 액션 처리 (메뉴 추가/수정/삭제)
      if (response.action) {
        const { type, payload } = response.action;

        switch (type) {
          case "ADD_MENU": {
            const { menuId, quantity, options } = payload;
            console.log("menuId", menuId);
            console.log("quantity", quantity);
            console.log("options", options);
            await get().addItemToCartById(
              Number(menuId),
              quantity,
              options as number[]
            );
            break;
          }
          case "UPDATE_MENU": {
            const { menuId, quantity } = payload;
            get().updateItemQuantityByName(Number(menuId), quantity as number);
            break;
          }
          case "REMOVE_MENU": {
            const { menuId } = payload;
            get().removeItemByName(Number(menuId));
            break;
          }
          case "SHOW_BURGER": {
            console.log("SHOW_BURGER");
            get().loadMenuItems(1);
            break;
          }
          case "SHOW_SIDE": {
            console.log("SHOW_SIDE");
            get().loadMenuItems(2);
            break;
          }
          case "SHOW_DRINK": {
            console.log("SHOW_DRINK");
            get().loadMenuItems(3);
            break;
          }
          case "SHOW_DESSERT": {
            console.log("SHOW_DESSERT");
            get().loadMenuItems(4);
            break;
          }
          case "ORDER_COMPLETE": {
            console.log("ORDER_COMPLETE");
            // /checkout 페이지로 이동
            const { navigate } = get();
            if (navigate) {
              navigate("/checkout");
            }

            break;
          }
        }
      }
    } catch (error) {
      console.error("Error processing message:", error);

      // 에러 메시지 추가
      set({
        chatMessages: [
          ...(updatedMessages as ChatMessage[]),
          {
            role: "assistant" as const,
            content: "죄송합니다. 요청을 처리하는 중에 오류가 발생했습니다.",
          },
        ],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  // 네비게이션 함수 설정
  setNavigate: (navigate) => {
    set({ navigate });
  },

  // 메뉴 카테고리 로드
  loadMenuCategories: async () => {
    try {
      const categories = await menuService.getMenuCategories();
      set({
        menuCategories: categories,
        // 첫 번째 카테고리 자동 선택
        selectedCategoryId: categories.length > 0 ? categories[0].id : null,
      });

      // 첫 번째 카테고리의 메뉴 자동 로드
      if (categories.length > 0) {
        get().loadMenuItems(categories[0].id);
      }
    } catch (error) {
      console.error("Error loading menu categories:", error);
    }
  },

  // 카테고리별 메뉴 아이템 로드
  loadMenuItems: async (categoryId: number) => {
    try {
      set({ isMenuLoading: true });
      const items = await menuService.getMenuItemsByCategory(categoryId);
      set({
        menuItems: items,
        isMenuLoading: false,
        selectedCategoryId: categoryId,
      });
    } catch (error) {
      console.error("Error loading menu items:", error);
      set({ isMenuLoading: false });
    }
  },

  // 카테고리 선택
  selectCategory: (categoryId: number) => {
    set({ selectedCategoryId: categoryId });
    get().loadMenuItems(categoryId);
  },

  // 장바구니에 아이템 추가 (메뉴 객체 사용)
  addToCart: async (menuItem: MenuItem) => {
    try {
      const details = await menuService.getMenuItemDetails(menuItem.id);

      // 새 장바구니 아이템 생성
      const newItem: CartItem = {
        id: menuItem.id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: 1,
        options: [],
      };

      // 장바구니에 추가
      const { cartItems } = get();

      // 이미 있는지 확인
      const existingItemIndex = cartItems.findIndex(
        (item) => item.id === menuItem.id && item.options.length === 0
      );

      let updatedCart;

      if (existingItemIndex >= 0) {
        // 있으면 수량만 증가
        updatedCart = cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      } else {
        // 없으면 새로 추가
        updatedCart = [...cartItems, newItem];
      }

      set({ cartItems: updatedCart });

      // 채팅 메시지로 알림
      const { orderAssistant, chatMessages } = get();
      if (orderAssistant) {
        // 주문 도우미에 장바구니 업데이트 알림
        orderAssistant.initializeConversation(updatedCart);

        // 사용자에게 추가 확인 메시지
        set({
          chatMessages: [
            ...chatMessages,
            {
              role: "assistant",
              content: `${menuItem.name}을(를) 장바구니에 추가했습니다.`,
            },
          ],
        });
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  },

  // 장바구니에 아이템 추가 (ID 사용, LangChain용)
  addItemToCartById: async (
    menuId: number,
    quantity: number = 1,
    optionIds: number[] = []
  ) => {
    try {
      const details = await menuService.getMenuItemDetails(menuId);

      // 선택한 옵션 정보 수집
      let selectedOptions: {
        id: number;
        name: string;
        price_adjustment: number;
      }[] = [];
      let additionalPrice = 0;

      if (optionIds.length > 0 && details.optionCategories) {
        for (const category of details.optionCategories) {
          for (const option of category.options) {
            if (optionIds.includes(option.id)) {
              selectedOptions.push({
                id: option.id,
                name: option.name,
                price_adjustment: option.price_adjustment,
              });
              additionalPrice += option.price_adjustment;
            }
          }
        }
      }

      // 새 장바구니 아이템 생성
      const newItem: CartItem = {
        id: menuId,
        name: details.name,
        price: details.price + additionalPrice,
        quantity,
        options: selectedOptions,
      };

      // 장바구니에 추가
      const { cartItems } = get();

      // 이미 동일한 아이템(+옵션)이 있는지 확인
      const existingItemIndex = cartItems.findIndex((item) => {
        // 기본 아이템 ID가 같고
        if (item.id !== menuId) return false;

        // 옵션 길이가 같고
        if (item.options.length !== selectedOptions.length) return false;

        // 모든 옵션 ID가 동일하면 동일한 아이템
        const optionIds = selectedOptions
          .map((opt) => opt.id)
          .sort()
          .join(",");
        const itemOptionIds = item.options
          .map((opt) => opt.id)
          .sort()
          .join(",");
        return optionIds === itemOptionIds;
      });

      let updatedCart;

      if (existingItemIndex >= 0) {
        // 동일한 아이템이 있으면 수량 업데이트
        updatedCart = cartItems.map((item, index) => {
          if (index === existingItemIndex) {
            return { ...item, quantity: item.quantity + quantity };
          }
          return item;
        });
      } else {
        // 없으면 새로 추가
        updatedCart = [...cartItems, newItem];
      }

      set({ cartItems: updatedCart });
    } catch (error) {
      console.error("Error adding item to cart by ID:", error);
    }
  },

  // 장바구니에서 아이템 제거
  removeFromCart: (index: number) => {
    const { cartItems, orderAssistant, chatMessages } = get();
    console.log("removeFromCart", cartItems, index);
    const updatedCart = cartItems.filter((_, i) => i !== index);
    set({ cartItems: updatedCart });

    // 주문 도우미에 장바구니 업데이트 알림
    // if (orderAssistant) {
    //   orderAssistant.initializeConversation(updatedCart);
    // }

    // 채팅 메시지로 알림
    if (orderAssistant) {
      // 주문 도우미에 장바구니 업데이트 알림
      orderAssistant.initializeConversation(updatedCart);

      // 사용자에게 추가 확인 메시지
      set({
        chatMessages: [
          ...chatMessages,
          {
            role: "assistant",
            content: `장바구니에서 ${cartItems[index].name}을(를) 제거했습니다.`,
          },
        ],
      });
    }
  },

  setChatMessages: (chatMessages: ChatMessage[]) => {
    set({ chatMessages });
  },

  // 장바구니 아이템 수량 변경
  changeItemQuantity: (index: number, newQuantity: number) => {
    const { cartItems, orderAssistant } = get();
    const updatedCart = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    set({ cartItems: updatedCart });

    // 주문 도우미에 장바구니 업데이트 알림
    if (orderAssistant) {
      orderAssistant.initializeConversation(updatedCart);
    }
  },

  // 이름으로 장바구니 아이템 수량 업데이트 (LangChain용)
  updateItemQuantityByName: (menuId: number, quantity: number) => {
    const { cartItems, orderAssistant } = get();
    console.log("updateItemQuantityByName", cartItems, menuId, quantity);

    // 메뉴 이름으로 아이템 찾기
    const index = cartItems.findIndex((item) => item.id === menuId);

    if (index === -1) {
      console.log("cartItems", typeof cartItems[0].id);
      console.log("menuId", typeof menuId);
      console.log("cartItems[0].id==menuId", cartItems[0].id === menuId);

      console.warn(`Item with id "${menuId}" not found in cart`);
      return;
    }

    const updatedCart = cartItems.map((item, i) => {
      if (i === index) {
        return { ...item, quantity };
      }
      return item;
    });

    set({ cartItems: updatedCart });

    // 주문 도우미에 장바구니 업데이트 알림
    if (orderAssistant) {
      orderAssistant.initializeConversation(updatedCart);
    }
  },

  // 이름으로 장바구니에서 아이템 제거 (LangChain용)
  removeItemByName: (menuId: number) => {
    const { cartItems, orderAssistant } = get();

    // 메뉴 이름으로 아이템 찾기
    const index = cartItems.findIndex((item) => item.id === menuId);

    if (index === -1) {
      console.warn(`Item with id "${menuId}" not found in cart`);
      return;
    }

    const updatedCart = cartItems.filter((_, i) => i !== index);
    set({ cartItems: updatedCart });

    // 주문 도우미에 장바구니 업데이트 알림
    if (orderAssistant) {
      orderAssistant.initializeConversation(updatedCart);
    }
  },

  // 주문 완료
  completeOrder: async () => {
    const { cartItems } = get();

    if (cartItems.length === 0) {
      return false;
    }

    try {
      set({ isLoading: true });

      // 주문 저장
      const orderResult = await orderService.saveOrder(cartItems);

      // 주문 완료 후 장바구니 비우기
      set({
        cartItems: [],
        isLoading: false,
        orderNumber: orderResult.orderNumber,
      });

      return true;
    } catch (error) {
      console.error("Error completing order:", error);
      set({ isLoading: false });
      return false;
    }
  },

  // 장바구니 비우기
  clearCart: () => {
    set({ cartItems: [] });

    // 주문 도우미에 장바구니 업데이트 알림
    const { orderAssistant } = get();
    if (orderAssistant) {
      orderAssistant.initializeConversation([]);
    }
  },
}));
