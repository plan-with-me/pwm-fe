import { UserInfo, getUserInfo } from "api/users";
import Center from "components/diary/Center";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Write from "components/diary/Write";
import { Diary, getDiaries } from "api/diary";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import getDateFormat from "utils/getDateFormat";
import DiaryContent from "components/diary/DiaryContent";
import { useLocation } from "react-router-dom";

const Wrapper = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: flex;
  @media (max-width: 440px) {
    width: 100%;
  }
`;

const TodoWrapper = styled.div`
  display: flex;
  height: calc(100dvh - 84px);

  @media (max-width: 880px) {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 440px) {
    width: 100%;
  }
`;

export default function DiaryPage() {
  const [calendarDate, setCalendarDate] = useRecoilState(CalendarDateAtom);

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  const { data: diary } = useQuery<Diary[]>({
    queryKey: [
      "diary",
      userInfo?.id,
      getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date),
    ],
    queryFn: async () =>
      await getDiaries(
        userInfo?.id || 0,
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
  });

  // useEffect(() => {
  //   console.log(diary, diary?.length);
  // }, [diary]);

  const location = useLocation();
  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center userInfo={userInfo!} />

          {/* {diary && diary.length > 0 ? (
            <DiaryContent diary={diary[0]} />
          ) : (
            <Write />
          )} */}
          {location.pathname === "/diary/write" && <Write />}
          {location.pathname === "/diary" && <DiaryContent />}
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
