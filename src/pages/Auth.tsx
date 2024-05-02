import axios from "axios";
import { useEffect } from "react";

type kakaoToken = {
  token_type: string;
  access_token: string;
  id_token: string;
  expires_in: number;
  refresh_token: string;
  refresh_token_expires_in: number;
  scope: string;
};

export default function Auth() {
  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");
    const getCode = async () => {
      const tokenResponse: { data: kakaoToken } = await axios.post(
        "https://kauth.kakao.com/oauth/token",
        {
          grant_type: "authorization_code",
          client_id: import.meta.env.VITE_APP_KAKAO_CLIENT_KEY,
          redirect_uri: "http://localhost:3000/auth",
          code: code,
        },
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );

      const id_token = tokenResponse.data.id_token;

      const authResponse = await axios.post(
        "https://pwm.ssc.co.kr/api/auth",
        { id_token },
        {
          headers: {
            "Content-Type": "application/json",
          },
          params: { social_type: "kakao" },
        }
      );

      console.log(authResponse.data);
      localStorage.setItem(
        "auth",
        `${authResponse.data.token_type} ${authResponse.data.access_token}`
      );
      window.location.href = "/home";
    };

    getCode();
  }, []);

  return <></>;
}
