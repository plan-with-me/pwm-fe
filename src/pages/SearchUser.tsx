import { UserInfo, getUserInfoById } from "api/users";
import Center from "components/Center";
import FollowingGoals from "components/followingCalendar/FollowingGoals";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  getSubGoalsById,
  getTopGoalsById,
  SubGoals,
  TopGoals,
} from "api/goals";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { useEffect, useState } from "react";

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

export default function SearchUser() {
  const { id } = useParams<{ id: string }>();
  const [calendarId, setCalendarId] = useState<number | null>(null);
  const calendarDate = useRecoilValue(CalendarDateAtom);

  useEffect(() => {
    if (id) {
      setCalendarId(Number(id));
    }
  }, [id]);

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", calendarId],
    queryFn: async () => await getUserInfoById(calendarId!),
  });

  const { data: subGoals } = useQuery<SubGoals[]>({
    queryKey: ["subGoals", calendarId, calendarDate.year, calendarDate.month],
    queryFn: async () =>
      await getSubGoalsById({
        user_id: calendarId!,
        plan_date: `${calendarDate.year}-${calendarDate.month
          .toString()
          .padStart(2, "0")}`,
      }),
  });

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList", calendarId],
    queryFn: async () => await getTopGoalsById(calendarId!),
  });

  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center
            userInfo={userInfo}
            subGoals={subGoals}
            categories={categories}
          />
          <FollowingGoals />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
