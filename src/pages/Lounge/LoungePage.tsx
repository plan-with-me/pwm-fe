import React, { useState, useEffect } from "react";
import styled from "styled-components";
import api from "../../api/config";
import defaultProfileImage from "assets/defaultProfile.png";
import CategoryTitle from "components/CategoryTitle";
import Checkbox from "components/Checkbox";
import { useNavigate } from 'react-router-dom';

const LoungePage = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: border-box;

  margin: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  overflow-x: hidden;

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
    #input_div,
    #searched_user_div,
    #calendar_list_div {
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

    #follow_button,
    #share_calendar_button {
      height: 35px;
    }

    #share_this_calendar_button {
      width: 100px;
    }
  }

  @media (max-width: 480px) {
    #input_div,
    #searched_user_div,
    #calendar_list_div {
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

    #follow_button,
    #share_calendar_button {
      height: 30px;
    }

    #share_this_calendar_button {
      width: 90px;
    }
  }
`;

const SearchedUserDiv = styled.div`
  display: flex;
  height: 100%;
  flex-direction: column;
  gap: 1.5rem;
  overflow-y: auto;
  overflow-x: hidden;
  margin-top: 0px;
  width: 100%;
  max-width: 700px;
  align-items: center;
  box-sizing: border-box;
  padding: 0px 20px;
`;

const UserItem = styled.div`
  display: flex;
  flex-direction: column; /* 수직 정렬 */
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  width: 80%;
  background-color: #ffffff;
`;

const FirstRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const ProfileImg = styled.div`
  width: 60px;
  height: 60px;
  margin-right: 20px;
  flex-shrink: 0;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  flex-grow: 0;

  span:first-child {
    font-weight: bold;
    font-size: 1.2rem;
  }

  span:last-child {
    font-size: 0.9rem;
    color: #666;
    margin-top: 0.3rem;
  }
`;

const GoalSection = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-direction: column; /* 수직 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
`;

const TagSpan = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin: 10px 0px;
`;

const SubGoalList = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1rem; /* 여백 추가 */
  display: flex;
  flex-direction: column; /* 수직 정렬 */
  align-items: flex-start; /* 왼쪽 정렬 */
`;

const SubGoalItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  span {
    margin-left: 0.5rem;
  }
`;

type UserWithGoals = {
  id: number;
  name: string;
  image: string;
  introduction: string;
  uid: number;
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
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserWithGoals[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true); // 더 로드할 데이터가 있는지 여부
  const navigate = useNavigate();
  
  const handleSearch = async (searchText: string) => {
    if (searchText) {
      try {
        const response = await api.get(`/lounge/users`, {
          params: { tag: searchText, limit: 20 },
        });
        const results = Array.isArray(response.data)
          ? response.data
          : [response.data];
  
        const filteredResults = results
          .filter(
            (user) =>
              user.top_goals &&
              user.top_goals.some(
                (goal: { sub_goals: any[] }) => goal.sub_goals.length > 0
              )
          )
          .map((user) => {
            return {
              ...user,
              top_goals: user.top_goals.slice(0, 1),
            };
          });
  
        setSearchResults(filteredResults);
        console.log(filteredResults);
      } catch (error) {
        console.error("사용자 검색 중 오류 발생:", error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };
  
  const loadMoreData = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/lounge/users`, {
        params: { tag: searchText, limit: 20, page },
      });
  
      const results = Array.isArray(response.data) ? response.data : [response.data];
  
      const filteredResults = results
        .filter(
          (user) =>
            user.top_goals &&
            user.top_goals.some(
              (goal: { sub_goals: any[] }) => goal.sub_goals.length > 0
            )
        )
        .map((user) => {
          return {
            ...user,
            top_goals: user.top_goals.slice(0, 1),
          };
        });
  
      if (filteredResults.length === 0) {
        setHasMore(false);
      } else {
        setSearchResults((prevResults) => [...prevResults, ...filteredResults]);
        setPage((prevPage) => prevPage + 1);
      }
    } catch (error) {
      console.error("사용자 검색 중 오류 발생:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(searchText);
    }
  };


  const handleScroll = () => {
    const scrollTop = document.documentElement.scrollTop;
    const windowHeight = window.innerHeight;
    const scrollHeight = document.documentElement.scrollHeight;
  
    if (scrollHeight - scrollTop <= windowHeight + 100 && hasMore && !loading) {
      loadMoreData();
    }
  };

  useEffect(() => {
    api.get(`/lounge/users`, { params: {} }).then((data) => {
      console.log(data.data);
      setSearchResults(data.data);
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchText, hasMore, loading, page]);
  

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
          {searchResults.map((user) => (
            <UserItem key={user.id} onClick={() => navigate(`/search/${user.id}`)}>
              <FirstRow>
                <ProfileImg>
                  <img
                    src={
                      user?.image === undefined || user.image === null
                        ? defaultProfileImage
                        : `https://pwm.ssc.co.kr/${user.image}`
                    }
                    id="searched_user_img"
                    alt={`${user.name}'s profile`}
                  />
                </ProfileImg>
                <UserInfoDiv>
                  <span>{user.name}</span>
                  <span>{user.introduction}</span>
                </UserInfoDiv>
              </FirstRow>

              {user.top_goals && user.top_goals.length > 0 && (
                <GoalSection>
                  <CategoryTitle
                    color={user.top_goals[0].color}
                    name={user.top_goals[0].name}
                  />
                  <TagSpan>{user.top_goals[0].tags.join(", ")}</TagSpan>
                </GoalSection>
              )}

              {user.top_goals && user.top_goals.length > 0 && (
                <SubGoalList>
                  {user.top_goals[0].sub_goals.map((subGoal) => (
                    <SubGoalItem key={subGoal.id}>
                      <Checkbox
                        color={user.top_goals[0].color}
                        status={subGoal.status}
                        disabled={true}
                      />
                      <span>{subGoal.name}</span>
                    </SubGoalItem>
                  ))}
                </SubGoalList>
              )}
            </UserItem>
          ))}
        </SearchedUserDiv>
      )}
    </LoungePage>
  );
}
