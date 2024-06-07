import { useEffect, useState } from "react";
import { getCalendar, CalendarInfo } from "../../api/calendar";
import { getTopGoals } from "../../api/calendarGoals";
import { TopGoals } from "../../api/goals";
import { Link, useNavigate, useParams} from "react-router-dom";
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
  min-height: 100vh; // height에서 min-height로 변경
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 15px;
  z-index: 1;
  position: relative;
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

const NavbarWrapper = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
`;

export default function STGoals() {
  const { calendar_id } = useParams();
  const [calendarId, setCalendarId] = useState<number | null>(null);
  const [topGoals, setTopGoals] = useState<TopGoals[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getCalendar(Number(calendar_id)).then((calendarInfo: CalendarInfo) => {
      setCalendarId(calendarInfo.id);
      console.log(calendarInfo.id);      
      console.log(calendarId,'1');
    });

    getTopGoals(Number(calendar_id)).then((data) => {
      setTopGoals(data);
      console.log(data);
    });
  }, []);

  const handleCreateTGoals = () => {
    if (calendar_id) {
      navigate(`/calendar/${calendar_id}/s-create-tgoal`);
    }
  };

  return (
    <Wrapper>
      <TopWrapper>
        <Link to={`/calendar/${calendar_id}/setting`}>
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
              to={`/calendar/${calendar_id}/s-update-tgoal/${goal.id}`}
              color={goal.color}
              key={index}
            >
              {goal.name}
            </Goal>
          ))}
        </div>
      </GoalsList>
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    </Wrapper>
  );
}
