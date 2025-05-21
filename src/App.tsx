import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import CompletePage from "./pages/CompletePage";
import { Box, Typography } from "@mui/material";
import ChatContainer from "./components/ChatContainer";
import { useOrderStore } from "./store/orderStore";

// 맥도날드 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: "#FF0000", // 맥도날드 빨간색
      dark: "#C00000",
      light: "#FF4D4D",
    },
    secondary: {
      main: "#FFC72C", // 맥도날드 노란색
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  const {
    // setCustomerInfo,
    chatMessages,
    isLoading,
    sendMessage,
  } = useOrderStore();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          maxWidth: "90%",
          margin: "0 auto",
          px: 2,
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box sx={{ mt: 3, textAlign: "center" }}>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
            }}
          >
            맥도날드 대화형 주문
          </Typography>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            mt: 2,
          }}
        >
          <Box
            sx={{
              width: "25%",
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 150px)",
            }}
          >
            <ChatContainer
              messages={chatMessages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
            />
          </Box>
          <Box
            sx={{
              width: "75%",
              height: "calc(100vh - 150px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Router>
              <Routes>
                <Route path="/" element={<OrderPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/complete" element={<CompletePage />} />
              </Routes>
            </Router>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
