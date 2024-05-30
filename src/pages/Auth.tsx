import axios from "axios";
import api from "api/config";
import { useEffect } from "react";
import { Cookies } from "react-cookie";

type kakaoToken = {
  token_type: string;
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
};

const cookies = new Cookies();

export default function Auth() {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const getCode = async () => {
      const tokenResponse: { data: kakaoToken } = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        {
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_APP_KAKAO_CLIENT_KEY,
          redirect_uri: import.meta.env.VITE_APP_KAKAO_AUTH_REDIRECT_URL,
          code: code,
        },
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      const id_token = tokenResponse.data.id_token;

      const authResponse = await api.post(
        "/auth",
        { id_token },
        {
          params: { social_type: "kakao" },
        }
      );

      cookies.set(
        "auth",
        `${authResponse.data.token_type} ${authResponse.data.access_token}`,
        { path: "/" }
      );
      // 회원가입이면 프로필 설정 페이지로
      window.location.href = authResponse.status === 201 ? "/my" : "/home";
    };

    getCode();
  }, []);

  return <></>;
}
