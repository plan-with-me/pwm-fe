import styled from "styled-components";
import logo from "assets/logo.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import api from "../api/config";
import kakaoLogin from "assets/kakao_login.svg";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";


const LoginPage = styled.div`
  width: 500px;
  height: calc(100dvh - 200px);
  margin: 100px auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  #logo {
    width: 300px;
  }

  @media (max-width: 700px) {
    width: 90%;
    #logo {
      width: 80%;
    }
  }
`;

const LoginText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1px;
  background-color: #d9d9d9;
  margin-bottom: 40px;
  span {
    font-size: 20px;
    background-color: white;
    padding: 10px;
  }
`;

const ButtonArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoginSec = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GOOGLE_ClIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

const KAKAO_KEY = import.meta.env.VITE_APP_KAKAO_CLIENT_KEY;
const REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_AUTH_REDIRECT_URL;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

type credentialResponse = {
  /** This field is the returned ID token */
  credential?: string;
  /** This field sets how the credential is selected */
  select_by?:
    | "auto"
    | "user"
    | "user_1tap"
    | "user_2tap"
    | "btn"
    | "btn_confirm"
    | "btn_add_session"
    | "btn_confirm_add_session";
  clientId?: string;
};

const cookies = new Cookies();

export default function Login() {
  const handleGoogleCredential = async (
    credentialResponse: credentialResponse
  ) => {
    console.log(credentialResponse);
    const authResponse = await api.post(`/auth?social_type=google`, {
      id_token: credentialResponse.credential,
    });

    const authType = authResponse.data.token_type;
    const accessToken = authResponse.data.access_token;
    cookies.set("auth", `${authType} ${accessToken}`, { path: "/" });


    // 회원가입이면 프로필 설정 페이지로
    window.location.href = authResponse.status === 201 ? "/my" : "/home";
  };

  const handleGoogleLoginError = async () => {
    // TODO
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.get("auth")) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <>
      <LoginPage>
        <img src={logo} width={500} id="logo" />
        <LoginSec>
          <LoginText>
            <span>간편로그인</span>
          </LoginText>

          <ButtonArea>
            <a href={KAKAO_AUTH_URL} id="kakao">
              <img src={kakaoLogin} alt="kakao" />
            </a>
            <GoogleOAuthProvider clientId={GOOGLE_ClIENT_ID}>
              <GoogleLogin
                use_fedcm_for_prompt={true}
                onSuccess={handleGoogleCredential}
                onError={handleGoogleLoginError}
                // useOneTap
                width={300}
              />
            </GoogleOAuthProvider>
          </ButtonArea>
        </LoginSec>
      </LoginPage>
    </>
  );
}
