import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  Divider
} from '@mui/material';
import CartItem from './CartItem';
import { CartItem as CartItemType } from '../types';

interface CartProps {
  items: CartItemType[];
  onRemoveItem: (index: number) => void;
  onChangeQuantity: (index: number, newQuantity: number) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  items,
  onRemoveItem,
  onChangeQuantity,
  onCheckout
}) => {
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6">주문 내역</Typography>
      </Box>
      
      <Divider />
      
      <Box
        sx={{
          flex: 1,
          overflow: 'auto'
        }}
      >
        {items.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
              p: 4
            }}
          >
            <Typography variant="body1" color="text.secondary">
              장바구니가 비어있습니다.
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                index={index}
                onRemove={onRemoveItem}
                onChangeQuantity={onChangeQuantity}
              />
            ))}
          </List>
        )}
      </Box>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Typography variant="h6">총 금액</Typography>
          <Typography variant="h6" color="primary.main">
            {totalPrice.toLocaleString()}원
          </Typography>
        </Box>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={items.length === 0}
          onClick={onCheckout}
        >
          주문하기
        </Button>
      </Box>
    </Paper>
  );
};

export default Cart;