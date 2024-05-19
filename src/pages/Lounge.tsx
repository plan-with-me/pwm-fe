import styled from "styled-components";
import loungeImg from "assets/lounge.png";
import settingImg from "assets/setting.png";
import calendarImg from "assets/calendar.png";
import api from "../api/config";
import { useRef, useState} from "react";
import { UserInfo } from "api/users";

//import { getUserInfo, UserInfo } from "api/users";
//import { useRef, useState, useEffect } from "react";
//import { useNavigate } from 'react-router-dom';


/* 
// 더미 데이터로 테스트 시 이거까지 풀고 테스트 
interface UserInfo {
  id: string;
  name: string;
  introduction: string;
  image?: string;
  created_at?: string;
  updated_at?: string;
}
*/

const LoungePage = styled.div`
  
  width: 700px;
  margin: 0 auto;
  margin-top: 50px;
  justify-content: space-between;
  align-items: center;

  #menuImg{
    margin-right: 140px;
  }
  
  #calendarImg{
    margin-right: 20px;
  }

  #loungeImg{
    margin-right: 20px;
  }

  #settingImg{
    margin-right: 20px;
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


`;



export default function Lounge() {
  
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [searchResults, setSearchResults] = useState<UserInfo | null>(null);

  //const introductionRef = useRef<HTMLInputElement | null>(null); 
  //const [userId, setUserId] = useState<number | null>(0);
  //const navigate = useNavigate();
  


  /*
  useEffect(() => {
    getUserInfo().then(data => {
      setUserId(data.id || 0);
      if (nameRef.current) nameRef.current.value = data.name;
      if (introductionRef.current) introductionRef.current.value = data.introduction || ''; 
    });
    
  }, []);
  */


  const handleSearch = async (searchText: string) => {
    if (searchText) {
      try {
        const response = await api.get(`/users/search`, { params: { email: searchText } });
        const results = response.data;

        /*
        // 테스트 용 더미 데이터
        const results = [
          {
            id: "1",
            name: "John Doe",
            introduction: "Hello, I am John Doe.",
          },
        ];
        */

        setSearchResults(results.length > 0 ? results[0] : null);
      } catch (error) {
        console.error('사용자 검색 중 오류 발생:', error);
        setSearchResults(null);
      }
    } else {
      setSearchResults(null);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && nameRef.current) {
      handleSearch(nameRef.current.value);
    }
  };


  return (
      <LoungePage>

        <img src={loungeImg} width={80} id="menuImg" />
        <img src={calendarImg} width={80} id="calendarImg" />
        <img src={loungeImg} width={80} id="loungeImg" />
        <img src={settingImg} width={80} id="settingImg" />
        

        <div id="input_div">
          <div id = "input_name_div">
            
            <input ref={nameRef}
                   onKeyPress={handleKeyPress}
                   style={{border:'none', width: '700px', height: '30px', background: 'lightgray', borderRadius: '10px'}}
                   placeholder=" 🔍  계정 또는 키워드 검색"/> 
            
          </div>
        </div>
        {searchResults && (
          <div id="searched_user_div">
            <img src={loungeImg} width={80} id="searched_user_img"/>
            <div id="searched_user_info">
              <span id="searched_user_name_span">{searchResults.name}</span>
              <span id="searched_user_introduction_span">{searchResults.introduction}</span>
            </div>
            
          </div>
        )}
      </LoungePage>
      
  );
}