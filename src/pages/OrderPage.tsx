import React, { useEffect } from "react";
import { Container, Grid, Box, Typography, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ChatContainer from "../components/ChatContainer";
import MenuCategories from "../components/MenuCategories";
import MenuList from "../components/MenuList";
import Cart from "../components/Cart";
import { useOrderStore } from "../store/orderStore";

const OrderPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    // 세션 상태
    initializeSession,

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
  } = useOrderStore();

  // 세션 및 메뉴 초기화
  useEffect(() => {
    initializeSession();
    loadMenuCategories();
  }, [initializeSession, loadMenuCategories]);

  // 주문 페이지로 이동
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate("/checkout");
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
