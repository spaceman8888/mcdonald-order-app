import React, { useEffect } from 'react';
import { Container, Grid, Box, Typography, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ChatContainer from '../components/ChatContainer';
import MenuCategories from '../components/MenuCategories';
import MenuList from '../components/MenuList';
import Cart from '../components/Cart';
import { useOrderStore } from '../store/orderStore';

const OrderPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const {
    // 세션 상태
    initializeSession,
    
    // 채팅 상태
    chatMessages,
    isLoading,
    sendMessage,
    
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
    changeItemQuantity
  } = useOrderStore();
  
  // 세션 및 메뉴 초기화
  useEffect(() => {
    initializeSession();
    loadMenuCategories();
  }, [initializeSession, loadMenuCategories]);
  
  // 주문 페이지로 이동
  const handleCheckout = () => {
    if (cartItems.length > 0) {
      navigate('/checkout');
    }
  };
  
  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            fontWeight: 'bold', 
            color: theme.palette.primary.main 
          }}
        >
          맥도날드 대화형 주문
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            mt: 1, 
            color: theme.palette.text.secondary 
          }}
        >
          채팅으로 편리하게 주문하세요
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* 왼쪽: 채팅 영역 */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, p: 1 }}>
          <Box sx={{ height: 'calc(100vh - 150px)' }}>
            <ChatContainer
              messages={chatMessages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
          </Box>
        </Box>
        
        {/* 중앙: 메뉴 표시 영역 */}
        <Box sx={{ width: { xs: '100%', md: '45%' }, p: 1 }}>
          <Box 
            sx={{ 
              height: 'calc(100vh - 150px)',
              display: 'flex',
              flexDirection: 'column'
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
                overflow: 'auto',
                bgcolor: 'background.paper',
                borderRadius: 1,
                boxShadow: 1
              }}
            >
              <MenuList
                items={menuItems}
                isLoading={isMenuLoading}
                onSelectItem={addToCart}
              />
            </Box>
          </Box>
        </Box>
        
        {/* 오른쪽: 장바구니 영역 */}
        <Box sx={{ width: { xs: '100%', md: '25%' }, p: 1 }}>
          <Box sx={{ height: 'calc(100vh - 150px)' }}>
            <Cart
              items={cartItems}
              onRemoveItem={removeFromCart}
              onChangeQuantity={changeItemQuantity}
              onCheckout={handleCheckout}
            />
          </Box>
        </Box>
      </Grid>
    </Container>
  );
};

export default OrderPage;