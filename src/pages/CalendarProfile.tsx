import styled from "styled-components";
import logo from "assets/logo.png";
//import defaultProfile from "assets/defaultProfile.png";
//import camera from "assets/camera.png";
import api from "../api/config";
import { getUserInfo } from "api/users";
import { useRef, useState, useEffect } from "react";
import { useParams } from "react-router-dom"; 
//import { useNavigate } from 'react-router-dom';


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
    margin-right: 20px;
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
  
  //const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement | null>(null); 
  const introductionRef = useRef<HTMLInputElement | null>(null); 
  const [userId, setUserId] = useState<number | null>(0);
  const { calendar_id } = useParams<{ calendar_id : string }>(); 
  //const [profileImage, setProfileImage] = useState<File | null>(null); // 이미지 파일 상태 추가
  //const [previewImage, setPreviewImage] = useState<string | null>(null); // 이미지 미리보기 상태 추가


  useEffect(() => {
    getUserInfo().then(data => {
      setUserId(data.id || 0);
      if (nameRef.current) nameRef.current.value = data.name;
      if (introductionRef.current) introductionRef.current.value = data.introduction || ''; 
      //if (data.image) setPreviewImage(data.image); // 프로필 이미지 미리보기 설정
    });
  }, []);

  const handleConfirm = async () => {
    if (!userId || !nameRef.current || !introductionRef.current) {
      console.error('User ID or refs are not initialized.');
      return;
    }

    if (!calendar_id ) {
      console.error("Calendar ID is not available.");
      return;
    }

    const updatedCalendar = {
      name: nameRef.current.value,
      introduction: introductionRef.current.value,
    };

    try {
      await updateCalendar(parseInt(calendar_id), updatedCalendar);
      alert("달력 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Failed to update calendar:", error);
      alert("달력 정보를 업데이트하는 데 실패했습니다.");
    }
    
  };

  const updateCalendar = async (calendarId: number, data: { name: string; introduction: string }) => {
    try {
      const response = await api.put(`/calendars/${calendarId}`, data);
      return response.data;
    } catch (error) {
      throw new Error("API call to update calendar failed.");
    }
  };


  

  return (
    <div>
      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      <LoginPage>
        <img src={logo} width={400} id="logo" />
        
        <LoginText>
          
        </LoginText>

        <div id="input_div">
          <div id = "input_name_div">
            <span id="span_name">달력 이름</span>
            <input ref={nameRef} style={{borderStyle: 'none', width: '80%'}}/> 
            <hr></hr>
          </div>

          <div id = "input_introduction_div">
            <span id="span_introduction">달력 소개</span>
            <input ref={introductionRef}  style={{borderStyle: 'none' , width: '80%'}}/>
            <hr></hr>
          </div>

          
        </div>
        
      </LoginPage>
      
      </div>
      
  );
}