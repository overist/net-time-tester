import { Box, Button } from "@mui/material";
import Link from "next/link";
import Script from "next/script";
import toast from "react-hot-toast";

declare global {
  interface Window {
    Kakao: any;
  }
}

const Login = () => {
  const handleClickKakaoOauth = () => {
    window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);

    window.Kakao.Auth.authorize({
      redirectUri: "http://localhost:3000/auth/kakao",
    });
  };

  return (
    <>
      <Box onClick={handleClickKakaoOauth} sx={{ cursor: "pointer" }}>
        <img src="/kakao-login-wide.png" alt="카카오 로그인" />
      </Box>

      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.6.0/kakao.min.js"
        integrity="sha384-6MFdIr0zOira1CHQkedUqJVql0YtcZA1P0nbPrQYJXVJZUkTk/oX4U9GhUIs3/z8"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default Login;
