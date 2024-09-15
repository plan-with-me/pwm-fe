import React, { useState } from 'react';
import styled from "styled-components";
import api from "../../api/config";
import Navbar from "components/Navbar";
import defaultProfileImage from "assets/defaultProfile.png";

const LoungePage = styled.div`
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

type UserWithGoals = {
  id: number;
  name: string;
  image: string;
  introduction: string;
  top_goals: {
    id: number;
    name: string;
    tags: string[];
    color: string;
    status: string;
    show_scope: string;
    created_at: string;
    updated_at: string;
    user_id: number;
    sub_goals: {
      id: number;
      name: string;
      status: string;
      plan_datetime: string;
      created_at: string;
      updated_at: string;
      top_goal_id: number;
      user_id: number;
    }[];
  }[];
};




export default function Lounge() {
  const [searchText, setSearchText] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserWithGoals[]>([]);

  const handleSearch = async (searchText: string) => {
    if (searchText) {
      try {
        const response = await api.get(`/lounge/users`, { params: { tag: searchText, limit: 20 } });
        const results = Array.isArray(response.data) ? response.data : [response.data];
        setSearchResults(results);
        console.log(results);
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

  return (
    <LoungePage>
      <div id="input_div">
        <input
          id="search"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder=" 🔍 찾으시는 피드의 태그를 검색하세요."
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
                  <span>{user.introduction}</span>
                </div>
                

                {user.top_goals && user.top_goals.length > 0 && (
                  <div id="top_goal_info">
                    <span>Top Goal: {user.top_goals[0].name}</span>
                    <span>Tags: {user.top_goals[0].tags.join(', ')}</span>
                  </div>
                )}

                {user.top_goals && user.top_goals.length > 0 && (
                  <div id="sub_goals_info">
                    <span>Sub Goals:</span>
                      <ul>
                        {user.top_goals[0].sub_goals.map((subGoal) => (
                          <li key={subGoal.id}>
                            <span>{subGoal.name}</span>
                            <span> - {subGoal.status === 'complete' ? '완료' : '미완료'}</span>
                          </li>
                        ))}
                      </ul>
                  </div>
                )}
              </UserItem>                  
            </React.Fragment>
          ))}
        </SearchedUserDiv>
      )}
      <Navbar />
    </LoungePage>
  );
}