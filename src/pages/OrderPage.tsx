import React, { useEffect } from "react";
import { Container, Grid, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import MenuCategories from "../components/MenuCategories";
import MenuList from "../components/MenuList";
import Cart from "../components/Cart";
import { useOrderStore } from "../store/orderStore";

const OrderPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    // 메뉴 상태
    menuCategories,
    selectedCategoryId,
    menuItems,
    isMenuLoading,
    loadMenuCategories,
    selectCategory,
    addToCart,

    // 장바구니 상태
    cartItems,
    removeFromCart,
    changeItemQuantity,

    // 네비게이션 상태
    setNavigate,

    // 주문 도우미 상태
    orderAssistant,
    chatMessages,
    setChatMessages,
  } = useOrderStore();

  // 세션 및 메뉴 초기화
  useEffect(() => {
    loadMenuCategories();
  }, [loadMenuCategories]);

  // 주문 페이지로 이동
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
    }

    if (orderAssistant) {
      // 사용자에게 추가 확인 메시지
      setChatMessages([
        ...chatMessages,
        {
          role: "assistant",
          content: `지금까지 주문하신 메뉴는 오른쪽 화면에 있습니다. 주문하신 메뉴를 확인하고 결제해주세요.\n총 금액은 ${cartItems.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          )}원 입니다.`,
        },
      ]);
    }
  };

  useEffect(() => {
    setNavigate(navigate);
  }, [navigate, setNavigate]);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* 중앙: 메뉴 표시 영역 */}

        <Box
          sx={{
            height: "calc(100vh - 150px)",
            // height: "550px",
            width: { xs: "100%", md: "65%" },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MenuCategories
            categories={menuCategories}
            selectedCategory={selectedCategoryId}
            onSelectCategory={selectCategory}
          />

          <Box
            sx={{
              flex: 1,
              mt: 2,
              overflow: "auto",
              bgcolor: "background.paper",
              borderRadius: 1,
              boxShadow: 1,
            }}
          >
            <MenuList
              items={menuItems}
              isLoading={isMenuLoading}
              onSelectItem={addToCart}
            />
          </Box>
        </Box>

        {/* 오른쪽: 장바구니 영역 */}
        <Box
          sx={{
            height: "calc(100vh - 150px)",
            width: { xs: "100%", md: "30%" },
          }}
        >
          <Cart
            items={cartItems}
            onRemoveItem={removeFromCart}
            onChangeQuantity={changeItemQuantity}
            onCheckout={handleCheckout}
          />
        </Box>
      </Grid>
    </Container>
  );
};

export default OrderPage;
