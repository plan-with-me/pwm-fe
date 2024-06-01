import { Link } from "react-router-dom";
import styled from "styled-components";
import lounge from "assets/lounge.png";
import setting from "assets/setting.png";
import calendar from "assets/calendar.png";

const Wrapper = styled.div`
  position: absolute;
  bottom: 0;
  background-color: white;
  width: 100%;
  height: fit-content;
  padding-top: 16px;
  padding-bottom: 16px;
  display: flex;
  justify-content: center;
  align-items: center;

  a {
    width: 120px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-decoration: none;
    color: black;
    gap: 8px;
  }
`;

export default function Navbar() {
  return (
    <>
      <Wrapper>
        <Link to="/home">
          <img src={calendar} alt="" width={28} />
          <span>달력</span>
        </Link>
        <Link to="/home">
          <img src={lounge} alt="" width={28} />
          <span>라운지</span>
        </Link>
        <Link to="/tgoal">
          <img src={setting} alt="" width={28} />
          <span>설정</span>
        </Link>
      </Wrapper>
    </>
  );
}
