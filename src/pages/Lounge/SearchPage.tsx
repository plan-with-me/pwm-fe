import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import api from "../../api/config";
import Navbar from "components/Navbar";
import defaultProfileImage from "assets/defaultProfile.png";
import { UserInfo} from "api/users";
import { CalendarInfo } from "api/calendar";

const SearchPage = styled.div`
  width: 100%;
  margin: 0 auto;
  margin-top: 20px;
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
    width: 550px;
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

  #recomended_tag {
    margin-top: 20px;
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

const SearchedUserDiv = styled.div`
  margin-top: 0px;
  width: 100%;
  max-width: 700px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 0 20px;
`;

const UserItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 10px;
`;

const CalendarList = styled.div`
  width: 97%;
  margin-bottom: 18px;
  background-color: lightgray;
  border-radius: 10px;
  padding: 15px 20px 0px 20px;

  .calendar_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  h4 {
    margin: 0;
  }

  p {
    margin: 0;
    font-size: 14px;
    color: gray;
  }

  button {
    margin-left: auto;
    width: 120px;
    background-color: lightgray;
    border-radius: 10px;
    cursor: pointer;

  }
`;

export default function Lounge() {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserInfo[]>([]);
  const [calendarList, setCalendarList] = useState<CalendarInfo[]>([]);
  const [openCalendars, setOpenCalendars] = useState<{ [userId: number]: boolean }>({});

  useEffect(() => {
    api.get('/calendars').then(response => {
      setCalendarList(response.data);
    }).catch(error => {
      console.error('공유 달력 목록을 가져오는 중 오류 발생:', error);
    });
  }, []);

  const handleSearch = async (searchText: string) => {
    if (searchText) {
      try {
        const response = await api.get(`/users`, { params: { email: searchText, limit: 20 } });
        setSearchResults(Array.isArray(response.data) ? response.data : [response.data]);
        console.log(response.data)
      } catch (error) {
        console.error('사용자 검색 중 오류 발생:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch(searchText);
    }
  };

  const toggleCalendarList = (userId: number) => {
    setOpenCalendars(prevState => ({
      ...prevState,
      [userId]: !prevState[userId]
    }));
  };

  const handleFollow = async (userId:number) => {
    if (userId) {
      try {
        await api.post(`/users/${userId}/follows`);
        alert("팔로우 요청이 성공적으로 완료되었습니다.");
      } catch (error) {
        console.error("팔로우 요청 중 오류 발생:", error);
        alert("팔로우 요청에 실패했습니다.");
      }
    }
  };

  const handleShareCalendar = async (calendarId: number, userId: number) => {
    try {
      await api.post(`/calendars/${calendarId}/users/${userId}`);
      alert("공유 달력에 유저가 성공적으로 추가되었습니다.");
    } catch (error) {
      console.error("공유 달력 추가 중 오류 발생:", error);
      alert("공유 달력 추가에 실패했습니다.");
    }
  };

  return (
    <SearchPage>
      <div id="input_div">
        <input
          id="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder=" 🔍 찾으시는 계정의 이메일을 입력하세요."
        />
      </div>

      {searchResults.length > 0 && (
        <SearchedUserDiv>
          {searchResults.map(user => (
            <React.Fragment key={user.id}>
              <UserItem>
              <img 
                  src={
                    user?.image === undefined || user.image === null
                      ? defaultProfileImage
                      : `https://pwm.ssc.co.kr/${user.image}`
                  }
                  id="searched_user_img"  
                  alt={`${user.name}'s profile`}
                  style={{ width: '80px', height: '80px' }}
                />
                <div id="searched_user_info">
                  <span id="searched_user_name_span">{user.name}</span>
                  <span>{user.uid}</span>
                  <span id="searched_user_introduction_span">{user.introduction}</span>
                </div>
                <button id="follow_button" onClick={()=>handleFollow(user.id)}> 팔로우 </button>
                <button id="share_calendar_button" onClick={() => toggleCalendarList(user.id)}>
                  공유 달력 추가
                </button>
              </UserItem>
              {openCalendars[user.id] && (
                <CalendarList>
                  {calendarList.map(calendar => (
                    <div key={calendar.id} className="calendar_item">
                      <div>
                        <h4>{calendar.name}</h4>
                        <p>{calendar.introduction}</p>
                      </div>
                      <button
                        id="share_this_calendar_button"
                        onClick={() => handleShareCalendar(calendar.id, user.id)}
                      >
                        이 달력에 추가
                      </button>
                    </div>
                  ))}
                </CalendarList>
              )}
            </React.Fragment>
          ))}
        </SearchedUserDiv>
      )}      
      <Navbar />
    </SearchPage>
  );
}