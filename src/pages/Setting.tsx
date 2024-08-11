import Navbar from "components/Navbar";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Cookies } from "react-cookie";
import bell from "assets/bell.png";
import info from "assets/info.png";
import speaker from "assets/speaker.png";
import questionMark from "assets/questionMark.png";
import unlock from "assets/unlock.png";
import check from "assets/check.png";
import user from "assets/user-regular.svg";
import left_arrow from "assets/angle-left-solid.svg";

const Wrapper = styled.div`
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;

  @media (max-width: 440px) {
    width: 100%; /* 혹은 width: unset; */
    min-width: 0;
  }
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
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
`;

const cookies = new Cookies();

export default function Setting() {
  const navigate = useNavigate();
  const handleLogout = () => {
    cookies.remove("auth", { path: "/" });
    navigate("/");
  };

  return (
    <Wrapper>
      <Header>
        <IconButton to="/home">
          <img src={left_arrow} alt="Back" />
        </IconButton>
        <Title>설정</Title>
      </Header>
      <SettingWrapper>
        <SettingLink to="/my">
          <img src={user} alt="Account" />
          <span>계정</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={bell} alt="Notifications" />
          <span>알림</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={info} alt="Notices" />
          <span>공지사항</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={speaker} alt="Information" />
          <span>정보</span>
        </SettingLink>
        <SettingLink to="/home">
          <img src={questionMark} alt="Inquiries" />
          <span>문의하기</span>
        </SettingLink>
        <SettingLink to="/tgoal">
          <img src={check} alt="Goals" />
          <span>목표관리</span>
        </SettingLink>
        <SettingLink to="/" onClick={handleLogout}>
          <img src={unlock} alt="Logout" />
          <span>로그아웃</span>
        </SettingLink>

      </SettingWrapper>
      <NavbarWrapper>
        <Navbar/>
      </NavbarWrapper>
    </Wrapper>
  );
}
