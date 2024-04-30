import styled from "styled-components";
import logo from "assets/logo.png";

const LoginPage = styled.div`
  max-width: 700px;
  min-width: 500px;
  width: 100%;
  margin: 0 auto;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  img {
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
  span {
    font-size: 20px;
    background-color: white;
    padding: 10px;
  }
`;

const ButtonArea = styled.div`
  display: flex;
`;

const KAKAO_KEY = import.meta.env.VITE_APP_KAKAO_CLIENT_KEY;
const REDIRECT_URI = "http://localhost:3000/home";
const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${KAKAO_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;

export default function Login() {
  return (
    <>
      <LoginPage>
        <img src={logo} width={500}></img>
        <LoginText>
          <span>간편로그인</span>
        </LoginText>
        <ButtonArea>
          <a href={KAKAO_AUTH_URL}>카카오</a>
          <a>구글</a>
        </ButtonArea>
      </LoginPage>
    </>
  );
}
