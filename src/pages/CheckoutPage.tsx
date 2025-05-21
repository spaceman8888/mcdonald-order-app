import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  // IconButton,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';

const CheckoutPage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  
  const {
    cartItems,
    // setCustomerInfo,
    completeOrder
  } = useOrderStore();
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  

  
  // 주문 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsProcessing(true);
    
    // 주문 처리
    const success = await completeOrder();
    
    setIsProcessing(false);
    
    if (success) {
      navigate('/complete');
    }
  };
  
  return (
    <Container maxWidth="md" sx={{ py: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
        >
          주문으로 돌아가기
        </Button>
      </Box>
      
      <Typography 
        variant="h4" 
        component="h1" 
        align="center" 
        sx={{ 
          mb: 4, 
          fontWeight: 'bold',
          color: theme.palette.primary.main
        }}
      >
        주문 확인 및 결제
      </Typography>
      
      <Grid container spacing={3}>
        {/* 왼쪽: 주문 내역 */}
        <Box sx={{ width: { xs: '100%', md: '66.67%' }, p: 1 }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              주문 내역
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <List disablePadding>
              {cartItems.map((item, index) => (
                <ListItem key={index} disablePadding sx={{ py: 1 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body1">
                        {item.name} × {item.quantity}
                      </Typography>
                    }
                    secondary={
                      item.options.length > 0 ? (
                        <Box component="span" sx={{ display: 'block', mt: 0.5 }}>
                          {item.options.map((option, i) => (
                            <Typography key={i} variant="body2" color="text.secondary">
                              + {option.name}
                            </Typography>
                          ))}
                        </Box>
                      ) : null
                    }
                  />
                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {(item.price * item.quantity).toLocaleString()}원
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">총 금액</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                {totalPrice.toLocaleString()}원
              </Typography>
            </Box>
          </Paper>
        </Box>
        
        {/* 오른쪽: 결제 양식 */}
        <Box sx={{ width: { xs: '100%', md: '33.33%' }, p: 1 }}>
          <Paper elevation={2} sx={{ p: 3 }}>

            
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isProcessing || cartItems.length === 0}
                sx={{ mt: 2 }}
              >
                {isProcessing ? '처리 중...' : '결제하기'}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;