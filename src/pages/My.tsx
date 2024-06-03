import styled from "styled-components";
import logo from "assets/logo.png";
import defaultProfile from "assets/defaultProfile.png";
//import camera from "assets/camera.png";
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

interface UserInfo {
  id: number;
  name: string;
  introduction: string;
  image?: string;
}


export default function Login() {
  
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement | null>(null); 
  const introductionRef = useRef<HTMLInputElement | null>(null); 
  const [userId, setUserId] = useState<number | null>(0);
  const [profileImage, setProfileImage] = useState<File | null>(null); // 이미지 파일 상태 추가
  const [previewImage, setPreviewImage] = useState<string | null>(null); // 이미지 미리보기 상태 추가


  useEffect(() => {
    getUserInfo().then(data => {
      setUserId(data.id || 0);
      if (nameRef.current) nameRef.current.value = data.name;
      if (introductionRef.current) introductionRef.current.value = data.introduction || ''; 
      if (data.image) setPreviewImage(data.image); // 프로필 이미지 미리보기 설정
    });
  }, []);

  const handleConfirm = async () => {
    if (!userId || !nameRef.current || !introductionRef.current) {
      console.error('User ID or refs are not initialized.');
      return;
    }

    let imageUrl = null;

    if (profileImage) { // 이미지 파일이 있을 경우 업로드 처리
      const formData = new FormData();
      formData.append('file', profileImage);
      try {
        const response = await api.post('/files', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        imageUrl = response.data.client_location; // 업로드된 이미지의 URL
      } catch (err) {
        console.error(err);
        return;
      }
    }

    const payload: Partial<UserInfo> = {
      name: nameRef.current.value,
      introduction: introductionRef.current.value,
    };

    if (imageUrl) {
      payload.image = imageUrl;
    }

    console.log("Payload:", payload); // 콘솔에 요청 데이터를 로그로 출력

    try {
      await api.put(`/users/${userId}`, payload);
      navigate('/home');
    } catch (err) {
      console.error(err);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file); // 이미지 파일 상태 업데이트
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string); // 이미지 미리보기 상태 업데이트
      };
      reader.readAsDataURL(file);
      console.log("Selected file:", file); // 파일 정보 로그로 출력
    } 
    else {
      console.log("No file selected"); // 파일 선택이 안된 경우 로그로 출력
    }
  };



  

  return (
    <div>
      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      <LoginPage>
        <img src={logo} width={500} id="logo" />
        
        <LoginText>
          <label htmlFor="fileInput">
            <img src={previewImage || defaultProfile} alt="파일 선택" style={{ width: '100px', height: 'auto' }} />
            {/*<img src={camera} alt="카메라" style={{ width: '50px', height: 'auto' }} />*/}
            <input id="fileInput" type="file" style={{ display: 'none' }} onChange={handleImageChange}/>
          </label>
        </LoginText>

        <div id="input_div">
          <div id = "input_name_div">
            <span id="span_name">이름</span>
            <input ref={nameRef} style={{borderStyle: 'none', width: '80%'}}/> 
            <hr></hr>
          </div>

          <div id = "input_introduction_div">
            <span id="span_introduction">자기소개</span>
            <input ref={introductionRef}  style={{borderStyle: 'none' , width: '80%'}}/>
            <hr></hr>
          </div>

          
        </div>
        
      </LoginPage>
      
      </div>
      
  );
}