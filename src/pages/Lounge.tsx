import styled from "styled-components";
import loungeImg from "assets/lounge.png";
import settingImg from "assets/setting.png";
import calendarImg from "assets/calendar.png";
import api from "../api/config";
// import { useRef, useState} from "react";
// import { UserInfo } from "api/users";

import { getUserInfo, UserInfo } from "api/users";
import { useRef, useState, useEffect } from "react";
//import { useNavigate } from 'react-router-dom';



const LoungePage = styled.div`
  
  width: 700px;
  margin: 0 auto;
  margin-top: 50px;
  justify-content: space-between;
  align-items: center;

  #menuImg{
    margin-right: 180px;
  }
  
  #calendarImg{
    margin-right: 30px;
  }

  #loungeImg{
    margin-right: 30px;
  }

  #settingImg{
    margin-right: 20px;
  }

  #calendarText{
    margin-left: 250px;
    
  }

  #loungeText{
    margin-left: 60px;
  }

  #settingText{
    margin-left: 55px;
  }

  #input_div{
    width: 700px;
    height: 100px;
    min-width: 200px;
  }

  #input_name_div{
    margin-top: 50px;
  }

  #searched_user_div{
    display: flex;
    alignItems: center;
  }

  #searched_user_img{
    margin-right: 20px;
  }

  #searched_user_info {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  #searched_user_name_span{
    display: block;
    margin-bottom: 20px;
    font-weight: bold;
    
  }

  #searched_user_introduction_span{
    display: block;
  }

  #follow_button{
    display: block;
    margin-left: auto;
    margin-right: 20px;
    margin-top: 20px;
    height: 40px;
    border: none;
    background-color: white;
  }

  #share_calendar_button{
    display: block;
    margin-right: 20px;
    margin-top: 20px;
    height: 40px;
    border: none;
    background-color: white;
  }


`;



export default function Lounge() {
  
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo | null>(null);
  //const introductionRef = useRef<HTMLInputElement | null>(null); 
  const [userId, setUserId] = useState<number | null>(0);
  const [imagesrc, setimagesrc] = useState<string>();
  //const navigate = useNavigate();
  

  useEffect(() => {
    getUserInfo().then(data => {
      setUserId(data.id || 0);
    });
    
  }, []);
  
  console.log(userId);

  const handleSearch = async (searchText: string) => {
    if (searchText) {
      try {
        const response = await api.get(`/users`, { params: { email: searchText } });
        const results = response.data;

        setSearchResults(results.length > 0 ? results[0] : null);
        setimagesrc(results.image)
        
      } catch (error) {
        console.error('사용자 검색 중 오류 발생:', error);
        setSearchResults(null);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(searchText);
    }
  };

  const handleFollow = async () => {
    if (searchResults) {
      try {
        await api.post(`/users/${searchResults.id}/follows`);
        alert("팔로우 요청이 성공적으로 완료되었습니다.");
      } catch (error) {
        console.error("팔로우 요청 중 오류 발생:", error);
        alert("팔로우 요청에 실패했습니다.");
      }
    }
  };


  return (
      <LoungePage>

        <img src={loungeImg} width={60} id="menuImg" />
        <img src={calendarImg} width={60} id="calendarImg" />
        <img src={loungeImg} width={60} id="loungeImg" />
        <img src={settingImg} width={60} id="settingImg" />
        <p></p>
        <span id = "calendarText">달력</span>
        <span id = "loungeText">라운지</span>
        <span id = "settingText">설정</span>
        

        <div id="input_div">
          <div id = "input_name_div">
            
            <input id = "search" ref={nameRef}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
                   onKeyPress={handleKeyPress}
                   style={{border:'none', width: '700px', height: '30px', background: 'lightgray', borderRadius: '10px'}}
                   placeholder=" 🔍  계정 또는 키워드 검색"/> 
            
          </div>
        </div>
        {searchResults && (
          <div id="searched_user_div">
            <img src={imagesrc} width={80} id="searched_user_img" style={{width: '80px', height: '80px'}}/>
            <div id="searched_user_info">
              <span id="searched_user_name_span">{searchResults.name}</span>
              {/*<span id="searched_user_name_span">{searchResults.id}</span>*/}
              <span id="searched_user_introduction_span">{searchResults.introduction}</span>
            </div>

            <button id="follow_button" onClick={handleFollow}> 팔로우 </button>
            <button id="share_calendar_button"> 공유 달력 추가 </button>
          </div>
        )}
      </LoungePage>
      
  );
}