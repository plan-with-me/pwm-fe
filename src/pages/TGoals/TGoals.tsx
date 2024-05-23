import { useEffect, useState } from "react";
import { getUserInfo, UserInfo } from "../../api/users"; // api.tsx에서 가져온 함수와 타입을 가져옵니다.
import { getTopGoals, TopGoals } from "../../api/goals"; // goals.tsx에서 가져온 함수와 타입을 가져옵니다.
import { Link, useNavigate } from "react-router-dom";
import Navbar from "components/Navbar";
import styled from "styled-components";
import left_arrow from "../../assets/angle-left-solid.svg"; // 이미지 경로
import plus from "assets/plus-solid.svg";

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
`;

const TopWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
  height: 70px;
  padding: 10px 15px;
`;

const Heading = styled.div`
  margin: 0 10px;
  font-size: 24px;
  font-weight: bold;
`;

const GoalsList = styled.div`
  width: 100%;
  padding: 30px 15px;

  #goalTitle {
    padding: 30px 10px;
    color: lightgray;
  }

  #goals {
    display: flex;
    align-content: flex-start;
    flex-direction: column;
    flex-wrap: wrap;
    overflow: auto;
    gap: 20px;
  }
`;

const Button = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px, 10px;
`;

const Goal = styled(Link)`
  text-decoration: none;
  color: ${(props) => props.color || "#000"};
  padding: 10px 20px;
  background-color: lightgray;
  font-size: 24px;
  border-radius: 30px;
`;

export default function TGoals() {
  const [userId, setUserId] = useState<number | null>(null); // 사용자 ID를 상태로 관리합니다.
  const [topGoals, setTopGoals] = useState<TopGoals[]>([]); // 최상위 목표를 상태로 관리합니다.
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((userInfo: UserInfo) => {
      setUserId(userInfo.id);
      console.log(userInfo.id);
    });

    getTopGoals().then((data) => {
      setTopGoals(data);
      console.log(data);
    });
  }, []);

  const handleCreateTGoals = () => {
    if (userId) {
      navigate(`/create-tgoal`);
    }
  };

  return (
    <Wrapper>
      <TopWrapper>
        <Link to="/home">
          <Button>
            <img src={left_arrow} width={24} />
          </Button>
        </Link>
        <Heading>목표</Heading>
        <Button>
          <img src={plus} onClick={handleCreateTGoals} alt="" width={26} />
        </Button>
      </TopWrapper>
      <GoalsList>
        <h2 id="goalTitle">일반</h2>
        <div id="goals">
          {topGoals.map((goal, index) => (
            <Goal
              to={`/update-tgoal/${goal.id}`}
              color={goal.color}
              key={index}
            >
              {goal.name}
            </Goal>
          ))}
        </div>
      </GoalsList>
      <Navbar />
    </Wrapper>
  );
}
