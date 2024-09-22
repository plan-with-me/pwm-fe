import Navbar from "components/Navbar";
import styled from "styled-components";
import { Link } from "react-router-dom";
import calendar from "assets/calendar.png";
import check from "assets/check.png";
import user from "assets/user-regular.svg";
import left_arrow from "assets/angle-left-solid.svg";
import deleteBtn from "assets/delete.png";
import { deleteCalendar } from "api/calendar";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

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

export default function Setting() {
  const { calendar_id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  console.log(calendar_id);

  const handleDeleteCalendar = async () => {
    try {
      if (calendar_id) {
        await deleteCalendar(parseInt(calendar_id));
        navigate("/home");
        queryClient.invalidateQueries({ queryKey: ["myCalendarList"] });
      }
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <Wrapper>
      <Header>
        <IconButton to={`/calendar/${calendar_id}`}>
          <img src={left_arrow} alt="Back" />
        </IconButton>
        <Title>달력 설정</Title>
      </Header>
      <SettingWrapper>
        <SettingLink to={`/calendar/${calendar_id}/setting/profile`}>
          <img src={calendar} alt="Account" />
          <span>프로필 편집</span>
        </SettingLink>
        <SettingLink to={`/calendar/${calendar_id}/s-tgoal`}>
          <img src={check} alt="Notifications" />
          <span>목표 설정</span>
        </SettingLink>
        <SettingLink to={`/calendar/${calendar_id}/setting/users`}>
          <img src={user} alt="Notices" />
          <span>인원 관리</span>
        </SettingLink>
        <SettingLink to="/" onClick={handleDeleteCalendar}>
          <img src={deleteBtn} alt="Information" />
          <span>공유 달력 삭제</span>
        </SettingLink>
      </SettingWrapper>
      <NavbarWrapper>
        <Navbar />
      </NavbarWrapper>
    </Wrapper>
  );
}
