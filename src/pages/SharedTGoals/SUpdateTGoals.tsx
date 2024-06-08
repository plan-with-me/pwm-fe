import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TopGoals } from "../../api/goals";
import { getTopGoals, updateTopGoals, deleteTopGoals } from "../../api/calendarGoals";
import styled from 'styled-components';
import left_arrow from '../../assets/angle-left-solid.svg'; // 이미지 경로
import Navbar from "components/Navbar";

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
  padding: 10px 10px;
  font-size: 24px;
`;

const DeleteButton = styled.button`
  border-radius: 10px;
  border: none;
  cursor: pointer;
  padding: 15px 30px;
  font-size: 24px;
  color: white;
  background-color: #fb5151;
;

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
  margin: 30px 0px;

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

const StatusInput = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  margin-bottom: 10px;

  label{
    flex:1;
    font-size: 24px; 
  }
  
  select {
    font-size: 24px; 
    width: 15%;
  }
`;

const Line = styled.div`
  width: 100%;
  height: 1px;
  background-color: lightgray;
`;

export default function UpdateTGoals() {
  const { calendar_id, id } = useParams();
  const navigate = useNavigate();
  
  const [topGoal, setTopGoal] = useState<TopGoals | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [showScope, setShowScope] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchTopGoal() {
      try {
        const topGoalData = await getTopGoals(Number(calendar_id));
        const goal = topGoalData.find((goal: { id: number; }) => goal.id === parseInt(id!));
        if (goal) {
          setTopGoal(goal);
          setName(goal.name);
          setColor(goal.color);
          setShowScope(goal.show_scope);
          setStatus(goal.status);
        } else {
          console.error("Top Goal not found");
        }
      } catch (error) {
        console.error("Error fetching top goal:", error);
      }
    }

    if (id) {
      fetchTopGoal();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedGoalData: Partial<TopGoals> = {
        name,
        color,
        show_scope: showScope,
        status
      };
      if (calendar_id !== undefined && id !== undefined) {
        await updateTopGoals(parseInt(calendar_id), parseInt(id), updatedGoalData); // 문자열을 숫자로 변환
        navigate(`/calendar/${calendar_id}/s-tgoal`);
      } else {
        console.error("Calendar ID or Goal ID is undefined.");
      }
    } catch (error) {
      console.error("Error updating top goal:", error);
    }
  };
  
  const handleDelete = async () => {
    try {
        if (id !== undefined && calendar_id !== undefined) {
            await deleteTopGoals(parseInt(calendar_id), parseInt(id));
            navigate(`/calendar/${calendar_id}/s-tgoal`);
        } else {
            console.error("Calendar ID or Goal ID is undefined.");
        }
    } catch (error) {
        console.error("Error deleting top goal:", error);
    }
};


  if (!topGoal) {
    return <div>Loading...</div>;
  }

  return (
    <Wrapper>
      <TopWrapper>
      <Link to={`/calendar/${calendar_id}/s-tgoal`}>
          <Button>
            <img src={left_arrow} width={24}/>
          </Button>
        </Link>
        <Heading>목표</Heading>
        <Button onClick={handleUpdate} disabled={!name}>확인</Button>        
      </TopWrapper>
      <Form>
      <WriteInput>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </WriteInput>
      <ScopeInput>
        <label>공개설정</label>
        <select
          id="showScope"
          value={showScope}
          onChange={(e) => setShowScope(e.target.value)}
          >
          <option value="group">그룹 공개</option>
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
      <StatusInput>
        <label>상태</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          >
            <option value="incomplete">진행중</option>
            <option value="complete">완료</option>
          </select>
      </StatusInput>
      <Line/>
      </Form>
      <DeleteButton onClick={handleDelete}>삭제</DeleteButton>
      <Navbar/>
    </Wrapper>

  );  
}
