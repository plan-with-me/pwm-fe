import Navbar from "components/Navbar";
import styled from "styled-components";
import { Link } from "react-router-dom";
import calendar from "assets/calendar.png";
import check from "assets/check.png";
import user from "assets/user-regular.svg";
import left_arrow from "assets/angle-left-solid.svg";
import deleteBtn from "assets/delete.png";

const Wrapper = styled.div`
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  flex-grow: 1;
  text-align: center;
  font-size: 1.5em;
  color: #333;
`;

const IconButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  img {
    width: 24px;
    height: 24px;
  }
`;

const SettingWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
`;

const SettingLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-decoration: none;
  color: #333;
   

  img {
    width: 28px;
    height: 28px;
    margin-right: 10px;
  }

  span {
    font-size: 1.1em;
    flex-grow: 1;
  }
`;

const NavbarWrapper = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
`;

export default function Setting() {
  return (
    <Wrapper>
      <Header>
        <IconButton to="/calendar">
          <img src={left_arrow} alt="Back" />
        </IconButton>
        <Title>달력 설정</Title>
      </Header>
      <SettingWrapper>
        <SettingLink to="/home">
          <img src={calendar} alt="Account" />
          <span>프로필 편집</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={check} alt="Notifications" />
          <span>목표 설정</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={user} alt="Notices" />
          <span>인원 관리</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={deleteBtn} alt="Information" />
          <span>공유 달력 삭제</span>
        </SettingLink>
      </SettingWrapper>
      <NavbarWrapper>
        <Navbar/>
      </NavbarWrapper>
    </Wrapper>
  );
}
