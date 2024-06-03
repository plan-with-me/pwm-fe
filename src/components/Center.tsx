import styled from "styled-components";
import Calendar from "./Calendar";
import Profile from "./Profile";
import bars from "assets/bars-solid.svg";
import logo from "assets/logo.png";
import { useRecoilState } from "recoil";
import { SideBarAtom } from "store/SideBarAtom";
import { UserInfo } from "api/users";
import { CalendarInfo } from "api/calendar";
import { SubGoals } from "api/goals";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: fit-content;
  /* border: solid 1px black; */
  margin: 20px;

  @media (max-width: 440px) {
    width: calc(100% - 40px);
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    width: 30px;
  }
  img {
    display: none;
    @media (max-width: 1240px) {
      display: block;
    }
  }

  .bar {
    cursor: pointer;
  }
`;

export default function Center({
  userInfo,
  calendarInfo,
  subGoals,
}: {
  userInfo?: UserInfo;
  calendarInfo?: CalendarInfo;
  subGoals?: SubGoals[];
}) {
  const [xPosition, setX] = useRecoilState(SideBarAtom);

  return (
    <>
      <Wrapper>
        <Logo>
          <img
            src={bars}
            width={30}
            alt=""
            className="bar"
            onClick={() => setX(-xPosition)}
          />
          <span></span>
          <img src={logo} width={80} />
          <span></span>
          <span></span>
        </Logo>
        <Profile userInfo={userInfo} calendarInfo={calendarInfo} />
        <Calendar subGoals={subGoals} />
      </Wrapper>
    </>
  );
}
