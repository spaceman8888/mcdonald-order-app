import React, { useState } from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";

const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();

  const { cartItems, completeOrder } = useOrderStore();

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
      navigate("/complete");
    }
  };

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        {/* 왼쪽: 주문 내역 */}

        <Box sx={{ width: "65%" }}>
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
                        <Box
                          component="span"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {item.options.map((option, i) => (
                            <Typography
                              key={i}
                              variant="body2"
                              color="text.secondary"
                            >
                              + {option.name}
                            </Typography>
                          ))}
                        </Box>
                      ) : null
                    }
                  />
                  <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                    {(item.price * item.quantity).toLocaleString()}원
                  </Typography>
                </ListItem>
              ))}
            </List>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">총 금액</Typography>
              <Typography
                variant="h6"
                color="primary"
                sx={{ fontWeight: "bold" }}
              >
                {totalPrice.toLocaleString()}원
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* 오른쪽: 결제 양식 */}
        <Box sx={{ width: "25%" }}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Button
                variant="text"
                // color="ye"
                sx={{ border: "1px solid red", color: "red" }}
                fullWidth
                size="large"
                onClick={() => navigate("/")}
              >
                주문으로 돌아가기
              </Button>
            </Box>
            <Box component="form" onSubmit={handleSubmit}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isProcessing || cartItems.length === 0}
              >
                {isProcessing ? "처리 중..." : "결제하기"}
              </Button>
            </Box>
          </Paper>
        </Box>
      </Grid>
    </Container>
  );
};

export default CheckoutPage;
