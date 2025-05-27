import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import OrderPage from "./pages/OrderPage";
import CheckoutPage from "./pages/CheckoutPage";
import CompletePage from "./pages/CompletePage";
import { Box, Typography } from "@mui/material";
import ChatContainer from "./components/ChatContainer";
import { useOrderStore } from "./store/orderStore";
import HomePage from "./pages/HomePage";
import { useLocation } from "react-router-dom";
import { useMemo } from "react";

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

  const location = useLocation();
  console.log(location.pathname);

  const isHomePage = useMemo(
    () => location.pathname === "/mcdonald-order-app/",
    [location]
  );
  console.log(isHomePage);
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
            맥도날드
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
          {!isHomePage && (
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
          )}
          <Box
            sx={{
              width: isHomePage ? "100%" : "75%",
              height: "calc(100vh - 150px)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Routes>
              <Route path="/mcdonald-order-app" element={<HomePage />} />
              <Route path="/mcdonald-order-app/order" element={<OrderPage />} />
              <Route
                path="/mcdonald-order-app/checkout"
                element={<CheckoutPage />}
              />
              <Route
                path="/mcdonald-order-app/complete"
                element={<CompletePage />}
              />
            </Routes>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
