import { UserInfo } from "api/users";
import styled from "styled-components";
import { CalendarInfo } from "api/calendar";
import defaultProfile from "assets/defaultProfile.png";
import setting from "assets/setting.png";
import { Link, useLocation } from "react-router-dom";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0px;
  #row {
    display: flex;
    align-items: center;
    gap: 12px;
  }
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

const UserInfoDiv = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function Profile({
  userInfo,
  calendarInfo,
}: {
  userInfo?: UserInfo;
  calendarInfo?: CalendarInfo;
}) {
  const defaultIntroduction = "프로필에 자기소개를 입력해보세요";
  const location = useLocation();

  return (
    <Wrapper>
      <div id="row">
        <ProfileImg>
          <img
            src={
              userInfo?.image === undefined || userInfo.image === null
                ? defaultProfile
                : `https://pwm.ssc.co.kr/${userInfo.image}`
            }
          />
        </ProfileImg>
        <UserInfoDiv>
          <span>{userInfo?.name || calendarInfo?.name}</span>
          <span>{userInfo?.introduction || defaultIntroduction}</span>
        </UserInfoDiv>
      </div>
      {location.pathname !== "/home" && !location.pathname.startsWith("/following/") &&(
        <Link to={`${location.pathname}/setting`}>
          <img src={setting} width={28} />
        </Link>
      )}
    </Wrapper>
  );
}
