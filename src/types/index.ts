export interface MenuCategory {
  id: number;
  name: string;
  description: string | null;
  display_order: number;
}

export interface MenuItem {
  id: number;
  category_id: number;
  name: string;
  description: string | null;
  price: number;
  calories: number | null;
  is_available: boolean;
  image_url: string | null;
  created_at: string;
  menu_categories?: {
    name: string;
  };
}

export interface MenuOption {
  id: number;
  category_id: number;
  name: string;
  price_adjustment: number;
  display_order: number;
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  options: {
    id: number;
    name: string;
    price_adjustment: number;
  }[];
  special_instructions?: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface Order {
  items: CartItem[];
  total_price: number;
  customer_name: string | null;
  phone_number: string | null;
}

export interface ChatSession {
  id: number;
  session_id: string;
  order_id: number | null;
  current_state: string;
  cart_data: string;
  last_interaction: string;
}
