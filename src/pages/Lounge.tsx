import styled from "styled-components";
import api from "../api/config";
import Navbar from "components/Navbar";
import logo from "assets/logo.png";
import defaultProfileImage from "assets/defaultProfile.png";
import { useEffect, useRef, useState } from "react";
import { UserInfo, getUserInfo } from "api/users";
import { CalendarInfo } from "api/calendar";
// import { useRef, useState} from "react";
// import { UserInfo } from "api/users";
//import { useNavigate } from 'react-router-dom';



const LoungePage = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;

  #menuImg {
    margin-right: 180px;
  }

  #calendarImg {
    margin-right: 30px;
  }

  #loungeImg {
    margin-right: 30px;
  }

  #settingImg {
    margin-right: 20px;
  }

  #calendarText {
    margin-left: 250px;
  }

  #loungeText {
    margin-left: 60px;
  }

  #settingText {
    margin-left: 55px;
  }

  #input_div {
    width: 700px;
    height: 100px;
    min-width: 200px;
    align-items: center;
  }

  #input_name_div {
    margin-top: 50px;
  }

  #search {
    width: 100%;
    height: 30px;
    background: lightgray;
    border-radius: 10px;
    box-sizing: border-box; /* Ensures padding is included in the element's total width and height */
  }

  #searched_user_div {
    margin-top: 50px;
    width: 700px;
    display: flex;
    align-items: center;
  }

  #searched_user_img {
    margin-right: 20px;
  }

  #searched_user_info {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }

  #searched_user_name_span {
    display: block;
    margin-bottom: 20px;
    font-weight: bold;
  }

  #searched_user_introduction_span {
    display: block;
  }

  #follow_button {
    display: block;
    margin-left: auto;
    margin-right: 20px;
    margin-top: 20px;
    height: 40px;
    border: none;
    background-color: white;
  }

  #share_calendar_button {
    display: block;
    margin-right: 20px;
    margin-top: 20px;
    height: 40px;
    border: none;
    background-color: white;
  }

  #calendar_list_div {
    width: 700px;
    margin-top: 20px;
    background-color: lightgray;
    border-radius: 10px;
    padding: 20px;
  }

  .calendar_item {
    display: flex;
    margin-bottom: 20px;
  }

  #share_this_calendar_button {
    margin-left: auto;
    width: 120px;
    background-color: lightgray;
    border-radius: 10px;
  }

  @media (max-width: 768px) {
    #input_div, #searched_user_div, #calendar_list_div {
      width: 90%;
    }

    #search {
      width: 100%;
    }

    #searched_user_info {
      margin-top: 0;
      margin-left: 10px;
    }

    #searched_user_img {
      width: 60px;
      height: 60px;
    }

    #follow_button, #share_calendar_button {
      height: 35px;
    }

    #share_this_calendar_button {
      width: 100px;
    }
  }

  @media (max-width: 480px) {
    #input_div, #searched_user_div, #calendar_list_div {
      width: 100%;
    }

    #input_name_div {
      margin-top: 20px;
    }

    #search {
      width: 100%;
    }

    #searched_user_info {
      margin-top: 0;
      margin-left: 5px;
    }

    #searched_user_img {
      width: 50px;
      height: 50px;
    }

    #follow_button, #share_calendar_button {
      height: 30px;
    }

    #share_this_calendar_button {
      width: 90px;
    }
  }


`;



export default function Lounge() {
  
  const nameRef = useRef<HTMLInputElement | null>(null);
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo | null>(null);
  const [userId, setUserId] = useState<number | null>(0);
  const [calendarId, setCalendarId] = useState<number | null>(null);
  const [imagesrc, setimagesrc] = useState<string>();
  const [calendarList, setCalendarList] = useState<CalendarInfo[]>([]);
  const [showCalendarList, setShowCalendarList] = useState<boolean>(false);
  //const introductionRef = useRef<HTMLInputElement | null>(null);
  //const navigate = useNavigate();
  

  useEffect(() => {
    getUserInfo().then(data => {
      setUserId(data.id || 0);
    });

     // 사용자 공유 달력 목록을 가져와서 첫 번째 달력의 ID를 설정
     api.get('/calendars').then(response => {
      const calendars = response.data;
      console.log("공유 달력 id", calendars[0].id);
      if (calendars.length > 0) {
        setCalendarList(calendars);
        setCalendarId(calendars[0].id);
      }
    }).catch(error => {
      console.error('공유 달력 목록을 가져오는 중 오류 발생:', error);
    });
    
  }, []);
  
  console.log(userId);
  console.log(imagesrc);

  const handleSearch = async (searchText: string) => {
    if (searchText) {
      try {
        const response = await api.get(`/users`, { params: { email: searchText } });
        const results = response.data;

        setSearchResults(results.length > 0 ? results[0] : null);
        setimagesrc(results.image);
        
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

  const handleShareCalendar = async () => {
    if (searchResults && calendarId) {
      try {
        await api.post(`/calendars/${calendarId}/users/${searchResults.id}`);
        alert("공유 달력에 유저가 성공적으로 추가되었습니다.");
      } catch (error) {
        console.error("공유 달력 추가 중 오류 발생:", error);
        alert("공유 달력 추가에 실패했습니다.");
      }
    }
  };

  const toggleCalendarList = () => {
    setShowCalendarList(!showCalendarList);
  };


  return (
    
      <LoungePage>
        <img src={logo} width={80} />
        <div id="input_div">
          <div id = "input_name_div">
            
            <input id = "search" ref={nameRef}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
                   onKeyPress={handleKeyPress}
                   style={{height: '30px', background: 'lightgray', borderRadius: '10px'}}
                   placeholder=" 🔍  계정 또는 키워드 검색"/> 
            
          </div>
        </div>
        {searchResults && (
          <div id="searched_user_div">
            <img src={defaultProfileImage} width={80} id="searched_user_img" style={{width: '80px', height: '80px'}}/>
            <div id="searched_user_info">
              <span id="searched_user_name_span">{searchResults.name}</span>
              {/*<span id="searched_user_name_span">{searchResults.id}</span>*/}
              <span id="searched_user_introduction_span">{searchResults.introduction}</span>
            </div>

            <button id="follow_button" onClick={handleFollow}> 팔로우 </button>
            <button id="share_calendar_button" onClick={toggleCalendarList}> 공유 달력 추가 </button>
          </div>
        )}
      {showCalendarList && (
        <div id="calendar_list_div">
          {calendarList.map(calendar => (
            <div key={calendar.id} className="calendar_item">
              <h4>{calendar.name}</h4>
              <p>{calendar.introduction}</p>
              <button id="share_this_calendar_button" onClick={handleShareCalendar}> 이 달력에 추가 </button>
            </div>
          ))}
        </div>
      )}
        <Navbar />
      </LoungePage>
      
  );
}