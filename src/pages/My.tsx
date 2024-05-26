import styled from "styled-components";
import logo from "assets/logo.png";
import profilePhoto from "assets/lounge.png";
import api from "../api/config";
import { getUserInfo } from "api/users";
import { useRef, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';


const LoginPage = styled.div`
  @media (max-width: 700px) {
    width: 90%;
    #logo {
      width: 80%;
    }

    #input_name_div, #input_introduction_div {
      padding: 0 10px;
    }

    #span_name, #span_introduction {
      margin-right: 10px;
    }

    input {
      width: 100%;
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

  #input_div{
    width: 100%;
    height: 200px;
    min-width: 200px;
    display: flex;
    flex-direction:column; 
    align-items: center;
  }

  #input_name_div, #input_introduction_div {
    width: 100%;
    max-width: 500px;
    margin-top: 50px;
    padding: 0 20px;
  }

  #span_name{
    margin-right: 50px;
  }

  #span_introduction{
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
  background-color: transparent;
  color: black;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;

  @media (max-width: 700px) {
    top: 20px;
    right: 10px;
  }
`;


export default function Login() {
  
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement | null>(null); 
  const introductionRef = useRef<HTMLInputElement | null>(null); 
  const [userId, setUserId] = useState<number | null>(0);


  useEffect(() => {
    getUserInfo().then(data => {
      setUserId(data.id || 0);
      if (nameRef.current) nameRef.current.value = data.name;
      if (introductionRef.current) introductionRef.current.value = data.introduction || ''; 
    });
  }, []);

  const handleConfirm = async () => {
    if (!userId || !nameRef.current || !introductionRef.current) {
      console.error('User ID or refs are not initialized.');
      return;
    }

    api.put(`/users/${userId}`, {
      name: nameRef.current.value,
      introduction: introductionRef.current.value,
      image: null,
    })
      .then(() => {
        navigate('/home');
      })
      .catch(err => {
        console.error(err);
      })
  };


  

  return (
    <div>
      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      <LoginPage>
        <img src={logo} width={500} id="logo" />
        
        <LoginText>
          <label htmlFor="fileInput">
            <img src={profilePhoto} alt="파일 선택" style={{ width: '100px', height: 'auto' }} />
            <input id="fileInput" type="file" style={{ display: 'none' }} />
          </label>
        </LoginText>

        <div id="input_div">
          <div id = "input_name_div">
            <span id="span_name">이름</span>
            <input ref={nameRef} style={{borderStyle: 'none', width: '100%'}}/> 
            <hr></hr>
          </div>

          <div id = "input_introduction_div">
            <span id="span_introduction">자기소개</span>
            <input ref={introductionRef}  style={{borderStyle: 'none' , width: '100%'}}/>
            <hr></hr>
          </div>

          
        </div>
        
      </LoginPage>
      
      </div>
      
  );
}