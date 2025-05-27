import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useOrderStore } from "../store/orderStore";

const HomePage = () => {
  const navigate = useNavigate();

  const { initializeSession } = useOrderStore();

  // 세션 및 메뉴 초기화
  useEffect(() => {
    initializeSession();
  }, [initializeSession]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        // gap: "20px", // 버튼과 이미지 사이 간격 추가
      }}
    >
      <img
        src="/home.jpg"
        alt="맥도날드 홈화면"
        style={{
          // maxWidth: "80%", // 화면 너비의 80%로 제한
          maxHeight: "40%",
          height: "auto", // 비율 유지
          objectFit: "contain", // 이미지 비율 유지하면서 컨테이너에 맞춤
        }}
      />
      <img
        src="/home2.jpg"
        alt="맥도날드 홈화면"
        style={{
          // maxWidth: "80%", // 화면 너비의 80%로 제한
          maxHeight: "40%",
          height: "auto", // 비율 유지
          objectFit: "contain", // 이미지 비율 유지하면서 컨테이너에 맞춤
        }}
      />
      <Button
        sx={{
          marginTop: "20px",
          marginBottom: "50px",
          width: "400px",
          backgroundColor: "#FFC72C", // 맥도날드 노란색
          color: "#DA291C", // 맥도날드 빨간색
          fontWeight: "bold",
          fontSize: "1.2rem",
          padding: "10px 30px",
          "&:hover": {
            backgroundColor: "#FFD54F", // 호버 시 약간 밝은 노란색
          },
        }}
        onClick={() => navigate("/order")}
      >
        주문하기
      </Button>
    </div>
  );
};

export default HomePage;
