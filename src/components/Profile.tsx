import { UserInfo } from "api/users";
import styled from "styled-components";
import { CalendarInfo } from "api/calendar";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0px;
`;

const ProfileImg = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: black;
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

  return (
    <Wrapper>
      {userInfo?.image === null && <ProfileImg />}
      <UserInfoDiv>
        <span>{userInfo?.name || calendarInfo?.name}</span>
        <span>{userInfo?.introduction || defaultIntroduction}</span>
      </UserInfoDiv>
    </Wrapper>
  );
}
