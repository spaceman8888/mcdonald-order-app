import { supabase } from "./supabase";
import { CartItem } from "../types";

export const saveOrder = async (items: CartItem[]) => {
  // 총 금액 계산
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 주문 기본 정보 저장
  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      total_amount: totalAmount,
      order_status: "pending",
    })
    .select() // 생성된 주문 데이터 반환
    .single(); // 주문 데이터 하나만 반환

  if (orderError) {
    console.error("주문 저장 실패:", orderError);
    throw orderError;
  }

  // 주문 아이템 저장
  const orderItems = items.map((item) => ({
    order_id: orderData.id,
    menu_item_id: item.id,
    quantity: item.quantity,
    price: item.price,
    special_instructions: item.special_instructions || null,
  }));

  const { data: orderItemData, error: orderItemError } = await supabase
    .from("order_items")
    .insert(orderItems)
    .select();

  if (orderItemError) {
    console.error("주문 아이템 저장 실패:", orderItemError);
    throw orderItemError;
  }

  // 주문 아이템 옵션 저장
  const orderItemOptions: { order_item_id: number; menu_option_id: number }[] =
    [];
  items.forEach((item, index) => {
    if (item.options && item.options.length > 0) {
      item.options.forEach((option) => {
        orderItemOptions.push({
          order_item_id: orderItemData[index].id,
          menu_option_id: option.id,
        });
      });
    }
  });

  if (orderItemOptions.length > 0) {
    const { error: optionsError } = await supabase
      .from("order_item_options")
      .insert(orderItemOptions);

    if (optionsError) {
      console.error("주문 아이템 옵션 저장 실패:", optionsError);
      throw optionsError;
    }
  }

  return {
    orderId: orderData.id,
    orderNumber: orderData.order_number,
    totalAmount,
  };
};
