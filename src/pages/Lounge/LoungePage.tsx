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
    width:  550px;
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

const RecommendedTags = styled.div`
  
`;

const TagButton = styled.button`
  margin-right: 10px;
  margin-bottom: 10px;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border: none;
  border-radius: 20px;
  cursor: pointer;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const LoadMoreButton = styled.button`
  background-color: #cccccc;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
`;

type UserWithGoals = {
  user:{
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    introduction: string;
    image: string;
    uid: number; 
  },
  top_goal: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    color: string;
    status: string;
    show_scope: string;
    user_id: number;
    tags: string[];
    sub_goals: {
      id: number;
      created_at: string;
      updated_at: string;
      top_goal_id: number;
      name: string;
      plan_datetime: string;
      status: string;
      user_id: number;
    }[];
  };
};

type Feed = {
  user: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    introduction: string;
    image: string;
    uid: string;
  },
  top_goal: {
    id: number;
    created_at: string;
    updated_at: string;
    name: string;
    color: string;
    status: string;
    show_scope: string;
    user_id: number;
    tags: string[];
    sub_goals: {
      id: number;
      created_at: string;
      updated_at: string;
      top_goal_id: number;
      name: string;
      plan_datetime: string;
      status: string;
      user_id: number;
    }[];
  }
}

export default function Lounge() {
  const [searchText, setSearchText] = useState<string>("");
  const [searchResults, setSearchResults] = useState<UserWithGoals[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [randomTags, setRandomTags] = useState<string[]>([]);
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [exclude_ids, setExclude] = useState<number[]>([]);
  const [exclude_search, setExcludeSearch] = useState<number[]>([]);
  
  
  useEffect(() => {
    const handleInitialFeeds = async () => {
      try {
        const response = await api.post('/lounge/feeds', {
          "exclude_ids": []
        });
        const initialFeed = response.data;
        const excludeIds = initialFeed.map((feed: Feed) => feed.top_goal.id);
        setFeeds(initialFeed);
        setExclude(excludeIds);
      } catch (error) {
        console.error('초기 피드 가져오기 실패:', error);
      }
    };
    handleInitialFeeds();
  }, []);

  const handleFeeds = async () => {
    if (exclude_ids.length > 0) {
      try {
        const response = await api.post('/lounge/feeds', {
          "exclude_ids": exclude_ids
        });
        const newFeeds = response.data;

        const mergedFeeds = [...feeds, ...newFeeds].filter(
          (feed, index, self) => self.findIndex(f => f.top_goal.id === feed.top_goal.id) === index
        );

        setFeeds(mergedFeeds);
        const newExcludeIds = newFeeds.map((feed: Feed) => feed.top_goal.id);
        setExclude(prevExcludeIds => [...prevExcludeIds, ...newExcludeIds]);
      } catch (error) {
        console.error('추가 피드 가져오기 실패:', error);
      }
    }
  };
  
  useEffect(() => {
    const excludeIds = feeds.map((feed) => feed.top_goal.id);
    setExclude(excludeIds)
  }, [feeds]);

  const fetchRandomTags = async () => {
    try {
      const response = await api.get('/lounge/random-tags');
      
      if (response.data && Array.isArray(response.data.tags)) {
        setRandomTags(response.data.tags);
      } else {
        console.error("예상치 못한 데이터 형식:", response.data);
        setRandomTags([]);
      }
    } catch (error) {
      console.error("랜덤 태그 가져오기 실패:", error);
      setRandomTags([]);
    }
  };

  useEffect(() => {
    fetchRandomTags();
  }, []);

  const handleTagClick = (tag: string) => {
    setSearchText(tag);
    handleSearch(tag);
  };

  useEffect(() => {
    const handleInisialSearch = async (searchText: string) => {
      if (searchText) {
        try {
          const response = await api.post('/lounge/feeds/search', {
            "exclude_ids":"",
            "tag":searchText 
          });
          setSearchResults(response.data);
          console.log(response.data);
          setExcludeSearch(exclude_search);
        } catch (error) {
          console.error('사용자 검색 중 오류 발생:', error);
          setSearchResults([]);
        }
      } else {
        setSearchResults([]);
      }
    };
    handleInisialSearch(searchText);
  }, [searchText]); 

    const handleSearch = async (searchText: string) => {
      if (!searchText) {
        setSearchResults([]); // 검색어가 없으면 결과를 초기화
        return;
      }
    
      try {
        const response = await api.post('/lounge/feeds/search', {
          "exclude_ids": exclude_search,
          "tag": searchText
        });
        const newSearchResults = response.data;
    
        const mergedSearchResults = [...searchResults, ...newSearchResults].filter(
          (result, index, self) =>
            self.findIndex(r => r.top_goal.id === result.top_goal.id) === index
        );
    
        setSearchResults(mergedSearchResults);
    
        const newExcludeIds = newSearchResults.map((result: Feed) => result.top_goal.id);
        setExcludeSearch(prevExcludeIds => [...prevExcludeIds, ...newExcludeIds]);
    
      } catch (error) {
        console.error('검색 결과 가져오기 실패:', error);
        setSearchResults([]);
      }
    };
  
  useEffect(() => {
    const exclude_search = searchResults.map((searchResults) => searchResults.top_goal.id);
    setExclude(exclude_search)
  }, [searchResults]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch(searchText);
    }
  };

  const loadMoreData = async () => {
    setLoading(true);
    if (searchText) {
      await handleSearch(searchText);
    } else {
      await handleFeeds();
    }
    setLoading(false);
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
      <RecommendedTags>
        <h3>추천 태그</h3>
        {randomTags.map((tag, index) => (
          <TagButton key={index} onClick={() => handleTagClick(tag)}>
            {tag}
          </TagButton>
        ))}
      </RecommendedTags>
      
      {searchResults.length > 0 ? (
        <SearchedUserDiv>
          {searchResults.map((search) => (
            <UserItem key={search.top_goal.id} onClick={() => navigate(`/search/${search.user.id}`)}>
              <FirstRow>
                <ProfileImg>
                  <img
                    src={
                      search.user.image === undefined || search.user.image === null
                        ? defaultProfileImage
                        : `https://pwm.ssc.co.kr/${search.user.image}`
                    }
                    id="searched_user_img"
                    alt={`${search.user.name}'s profile`}
                  />
                </ProfileImg>
                <UserInfoDiv>
                  <span>{search.user.name}</span>
                  <span>{search.user.introduction}</span>
                </UserInfoDiv>
              </FirstRow>  
                <GoalSection>
                  <CategoryTitle
                    color={search.top_goal.color}
                    name={search.top_goal.name}
                  />
                  <TagSpan>{search.top_goal.tags.join(", ")}</TagSpan>
                </GoalSection>
                <SubGoalList>
                  {search.top_goal.sub_goals.map((subGoal) => (
                    <SubGoalItem key={subGoal.id}>
                      <Checkbox
                        color={search.top_goal.color}
                        status={subGoal.status}
                        disabled={true}
                      />
                      <span>{subGoal.name}</span>
                    </SubGoalItem>
                  ))}
                </SubGoalList>
            </UserItem>
          ))}
          <LoadMoreButton onClick={loadMoreData} disabled={loading}>
            {loading ? "더보기" : "더보기"}
          </LoadMoreButton>
        </SearchedUserDiv>
        
      ) : (
        <SearchedUserDiv>
          {feeds.map((feed) => (
            <UserItem key={feed.top_goal.id} onClick={() => navigate(`/search/${feed.user.id}`)}>
              <FirstRow>
                <ProfileImg>
                  <img
                      src={
                        feed.user.image === undefined || feed.user.image === null
                          ? defaultProfileImage
                          : `https://pwm.ssc.co.kr/${feed.user.image}`
                      }
                      id="searched_user_img"
                      alt={`${feed.user.name}'s profile`}
                    />
                </ProfileImg>
                <UserInfoDiv>
                  <span>{feed.user.name}</span>
                  <span>{feed.user.introduction}</span>
                </UserInfoDiv>      
              </FirstRow>
              <GoalSection>
                  <CategoryTitle
                    color={feed.top_goal.color}
                    name={feed.top_goal.name}
                  />
                  <TagSpan>{feed.top_goal.tags.join(", ")}</TagSpan>
              </GoalSection>
              <SubGoalList>
                  {feed.top_goal.sub_goals.map((subGoal) => (
                    <SubGoalItem key={subGoal.id}>
                      <Checkbox
                        color={feed.top_goal.color}
                        status={subGoal.status}
                        disabled={true}
                      />
                      <span>{subGoal.name}</span>
                    </SubGoalItem>
                  ))} 
                </SubGoalList>              
            </UserItem>
          ))}
          <LoadMoreButton onClick={loadMoreData} disabled={loading}>
            {loading ? "더보기" : "더보기"}
          </LoadMoreButton>
        
        </SearchedUserDiv>
      )}
    </LoungePage>
  );
  
}
