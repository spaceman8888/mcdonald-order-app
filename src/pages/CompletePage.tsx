import React from "react";
import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate } from "react-router-dom";
import { useOrderStore } from "../store/orderStore";
const CompletePage: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { orderNumber } = useOrderStore();

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          textAlign: "center",
          borderRadius: 2,
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
