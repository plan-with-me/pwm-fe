import styled from "styled-components";
import logo from "assets/logo.png";
import api from "../api/config";
import { getUserInfo } from "api/users";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

const LoginPage = styled.div`
  @media (max-width: 700px) {
    width: 90%;
    #logo {
      width: 80%;
    }
  }

  width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  #logo {
    max-width: 500px;
    min-width: 200px;
    
  }

  #inputdiv{
    width: 700px;
    height: 1200px;
    min-width: 200px;
  }

  #inputnamediv{
    margin-top: 50px;
  }

  #inputintroductiondiv{
    margin-top: 50px;
  }

  #spanname{
    margin-right: 50px;
  }

  #spanintroduction{
    margin-right: 25px;
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


const ConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;


export default function Login() {
  
  const handleConfirm = async () => {
    api.put(`/users/${userId}`, {
      name: nameRef.current.value,
      introduction: introductionRef.current.value,
      image: null,
    })
      .then(data => {
        navigate('/home');
      })
      .catch(err => {
        console.error(err);
      })
  };
  const navigate = useNavigate();

  const nameRef = useRef()
  const introductionRef = useRef()
  const [userId, setUserId] = useState(null);

  getUserInfo().then(data => {
    setUserId(data.id);
    nameRef.current.value = data.name
    introductionRef.current.value = data.introduction
  })

  return (
      <LoginPage>
        <img src={logo} width={500} id="logo" />
        <LoginText>
          <span><input type="file"/></span>
        </LoginText>

        <div id="inputdiv">
          <div id = "inputnamediv">
            <span id="spanname">이름</span>
            <input ref={nameRef} style={{borderStyle: 'none', width: '600px'}}/> 
            <hr width={"100%"}></hr>
          </div>

          <div id = "inputintroductiondiv">
            <span id="spanintroduction">자기소개</span>
            <input ref={introductionRef}  style={{borderStyle: 'none' , width: '600px'}}/>
            <hr width={"100%"}></hr>
          </div>

          <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
        </div>
        
      </LoginPage>
      
  );
}