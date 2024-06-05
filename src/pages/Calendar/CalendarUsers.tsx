import { CalendarInfo, getCalendar, getCalendarUsers } from "api/calendar";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";
import SettingModal from "components/sharedCalendar/SettingModal";
import Navbar from "components/Navbar";
import defaultProfile from "assets/defaultProfile.png";
import left_arrow from "assets/angle-left-solid.svg";
import logo from "assets/logo.png";

const Wrapper = styled.div`
  width: 440px;
  height: calc(100dvh - 84px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Header = styled.div`
  width: 400px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  span {
    width: 20px;
  }

  img {
    cursor: pointer;
  }
`;

const Title = styled.span`
  width: fit-content;
  margin: 20px 0 40px 0;
  font-size: 20px;
  font-weight: 600;
`;

const ProfileImg = styled.div`
  width: 50px;
  height: 50px;
  overflow: hidden;
  border-radius: 50%;
  position: relative;

  img {
    width: 100%;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`;

const Users = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
`;

const UserLayout = styled.div`
  width: 400px;
  background-color: white;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  position: relative;
  justify-content: space-between;
  align-items: center;
  border: 1px solid rgba(0, 0, 0, 0.08);

  #profile {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  #info {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

export default function CalendarUsers() {
  const { calendar_id } = useParams();
  const navigate = useNavigate();
  const defaultIntroduction = "프로필에 자기소개를 입력해보세요";

  const { data: users } = useQuery({
    queryKey: ["calendarUsers"],
    queryFn: async () => await getCalendarUsers(Number(calendar_id)),
  });

  const { data: calendarInfo } = useQuery<CalendarInfo>({
    queryKey: ["calendarInfo", calendar_id],
    queryFn: async () => await getCalendar(Number(calendar_id)),
  });

  return (
    <>
      <Wrapper>
        <Header>
          <img
            src={left_arrow}
            alt=""
            width={20}
            onClick={() => navigate(`/calendar/${calendar_id}/setting`)}
          />
          <span></span>
          <img src={logo} alt="" width={80} onClick={() => navigate("/home")} />
          <span></span>
          <span></span>
        </Header>
        <Title>[{calendarInfo?.name}] 인원 관리</Title>
        <Users>
          {users?.map((user) => (
            <UserLayout key={user.id}>
              <div id="profile">
                <ProfileImg>
                  <img
                    src={
                      user.image === undefined || user.image === null
                        ? defaultProfile
                        : `https://pwm.ssc.co.kr/${user.image}`
                    }
                    alt=""
                    width={50}
                  />
                </ProfileImg>
                <div id="info">
                  <span>{user.name}</span>
                  <span>{user.introduction || defaultIntroduction}</span>
                </div>
              </div>
              <SettingModal calendarId={Number(calendar_id)} userId={user.id} />
            </UserLayout>
          ))}
        </Users>
      </Wrapper>
      <Navbar />
    </>
  );
}
