import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import OrderPage from './pages/OrderPage';
import CheckoutPage from './pages/CheckoutPage';
import CompletePage from './pages/CompletePage';

// 맥도날드 테마 설정
const theme = createTheme({
  palette: {
    primary: {
      main: '#FF0000', // 맥도날드 빨간색
      dark: '#C00000',
      light: '#FF4D4D',
    },
    secondary: {
      main: '#FFC72C', // 맥도날드 노란색
    },
  },
  typography: {
    fontFamily: '"Noto Sans KR", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<OrderPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/complete" element={<CompletePage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;