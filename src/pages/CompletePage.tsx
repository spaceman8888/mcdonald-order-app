import React, { useEffect } from "react";
import { Container, Paper, Typography, Button, keyframes } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";

const flyInAnimation = keyframes`
  0% {
    transform: translateY(-100px) scale(0.8);
    opacity: 0;
  }
  60% {
    transform: translateY(20px) scale(1.1);
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const CompletePage: React.FC = () => {
  const navigate = useNavigate();

  const { orderNumber, orderAssistant, chatMessages, setChatMessages } =
    useOrderStore();

  useEffect(() => {
    if (orderAssistant) {
      // 사용자에게 추가 확인 메시지
      setChatMessages([
        ...chatMessages,
        {
          role: "assistant",
          content: `주문번호는 ${orderNumber}번 입니다. \n\n"제품받는 곳" 모니터에 주문번호가 표시되면 영수증을 제시하시고 제품을 받아가세요. \n\n감사합니다!`,
        },
      ]);
    }
  }, []);

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
          animation: `${flyInAnimation} 0.8s ease-out forwards`,
          opacity: 0,
        }}
      >
        <CheckCircleOutlineIcon
          sx={{
            fontSize: 80,
            color: "success.main",
            mb: 2,
          }}
        />

        <Typography variant="body1" color="text.secondary">
          주문번호 / Order No.
        </Typography>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: "bold", fontSize: "100px" }}
        >
          {orderNumber}
        </Typography>

        <Typography variant="body1" color="text.secondary" sx={{ mb: 8 }}>
          맥도날드를 이용해 주셔서 감사합니다.
          <br />
          맛있는 음식이 곧 준비될 예정입니다.
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/")}
          sx={{ px: 4 }}
        >
          홈 화면 가기
        </Button>
      </Paper>
    </Container>
  );
};

export default CompletePage;
