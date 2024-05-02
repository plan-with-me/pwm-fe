import styled from "styled-components";
import logo from "assets/logo.png";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import api from "../api/config";
import kakaoLogin from "assets/kakao_login.svg";

const LoginPage = styled.div`
  max-width: 700px;
  min-width: 500px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  #logo {
    max-width: 400px;
    min-width: 200px;
    padding-top: 100px;
  }
`;

const LoginText = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1px;
  background-color: #d9d9d9;
  margin-top: 240px;
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

const GOOGLE_ClIENT_ID = import.meta.env.VITE_APP_GOOGLE_CLIENT_ID;

const KAKAO_KEY = import.meta.env.VITE_APP_KAKAO_CLIENT_KEY;
const REDIRECT_URI = import.meta.env.VITE_APP_KAKAO_AUTH_REDIRECT_URL;
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

export default function Login() {
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

  const handleGoogleCredential = async (
    credentialResponse: credentialResponse
  ) => {
    console.log(credentialResponse);
    const authResponse = await api.post(`/auth?social_type=google`, {
      id_token: credentialResponse.credential,
    });

    const authType = authResponse.data.token_type;
    const accessToken = authResponse.data.access_token;
    localStorage.setItem("auth", `${authType} ${accessToken}`);
    window.location.href = "/home";
  };

  const handleGoogleLoginError = async () => {
    // TODO
  };

  return (
    <>
      <LoginPage>
        <img src={logo} width={500} id="logo" />
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
      </LoginPage>
    </>
  );
}
