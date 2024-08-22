import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createTopGoals, TopGoals } from "../../api/goals";
import styled from 'styled-components';
import left_arrow from '../../assets/angle-left-solid.svg'; // 이미지 경로
import Navbar from "components/Navbar";
const MAX_TAGS = 5;

const Wrapper = styled.div`
  @media (min-width: 700px) {
    width: 90%;  
  }
  @media (max-width: 1000px) {
    width: 90%;
  }
  
  width: fit-content;
  height: 100vh;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0px 15px;
  z-index: 1;
  position: relative;
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%; 
  justify-content: space-between;
  height: 70px;
  padding: 0px 15px;
`;

const Heading = styled.div`
  margin: 0 10px;
  font-size: 24px;
  font-weight: bold;
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px, 10px;
  font-size: 24px;
`;

const Form = styled.form`
  width: 100%;
  padding: 30px 0px;
`;

const WriteInput = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 60px;
  margin-bottom: 40px;
  
  input {
    width: 100%;
    height: 100%;
    font-size: 24px; 
    background-color: none;
    border: none;
    border-bottom: 3px solid #000000;
    padding: 4px;
    outline: none;
  }
`;

const ScopeInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  margin-bottom: 30px;

  label{
    flex:1;
    font-size: 24px; 
  }
  
  select {
    font-size: 24px; 
    width: 15%;
  }
`;

const ColorInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;

  label {
    flex:1;
    font-size: 24px; 
  }

  input { 
    width: 15%;
  }
`;

const TagsInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 90px;

  label {
    flex:1;
    font-size: 24px; 
  }

  input { 
    width: 15%;
  }
`;

const TagList = styled.div`
  display: flex; 
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: lightgray;
`;


export default function CreateTGoals() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("#000000");
  const [showScope, setShowScope] = useState("me");
  const [tags, setTags] = useState<string[]>([]); 
  const [inputTag, setInputTag] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userId = parseInt(window.location.pathname.split("/")[2]);
      const newTopGoalData: TopGoals = {
        id: 0,
        name,
        color,
        status: "incomplete",
        show_scope: showScope,
        tags
      };
      console.log(userId)

      await createTopGoals(name, color, newTopGoalData.status, showScope, tags);

      navigate("/tgoal");
    } catch (error) {
      console.error("Error creating top goal:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputTag.trim()) {
      e.preventDefault();
  
      if (tags.length >= MAX_TAGS) {
        alert(`최대 ${MAX_TAGS}개의 태그만 추가할 수 있습니다.`);
        return;
      }
  
      const formattedTag = inputTag.trim().startsWith("#")
        ? inputTag.trim()
        : `#${inputTag.trim()}`;
  
      if (!tags.includes(formattedTag)) {
        setTags([...tags, formattedTag]);
        setInputTag("");
      }
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Wrapper>
      <TopWrapper>
        <Link to="/tgoal">
          <Button>
            <img src={left_arrow} width={24}/>
          </Button>
        </Link>
        <Heading>목표 등록</Heading>
        <form onSubmit={handleSubmit}>
         <Button type="submit" disabled={!name}>완료</Button>
        </form>
      </TopWrapper>
      <Form>
        <WriteInput>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="목표 입력"
          />
        </WriteInput>
        <ScopeInput>
          <label>공개설정</label>
          <select
          id="showScope"
          value={showScope}
          onChange={(e) => setShowScope(e.target.value)}
          >
            <option value="me">나만 보기</option>
            <option value="followers">팔로워 공개</option>
            <option value="all">전체 공개</option>
          </select>
        </ScopeInput>
        <Line/>
        <ColorInput>
          <label>색상</label>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </ColorInput> 
        <Line/>
        {showScope === "all" && (
          <>
            <TagsInput>
              <label>태그</label>
              <TagList>
                {tags.map((tag) => (
                  <div key={tag}>
                    {tag}
                    <Button onClick={() => handleRemoveTag(tag)}>x</Button>
                  </div>
                ))}
              </TagList>
              <input
                type="text"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="태그 입력 후 엔터"
              />
            </TagsInput>
            <Line/>
          </>
        )}         
      </Form>
      <Navbar/>
    </Wrapper>
  );
}
