import {
  CalendarInfo,
  Permission,
  getCalendar,
  getCalendarPermission,
} from "api/calendar";
import Center from "components/Center";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CalendarGoals from "components/sharedCalendar/CalendarGoals";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { SubGoals } from "api/goals";
import { getSubGoals } from "api/calendarGoals";

const Wrapper = styled.div`
  /* width: 100%; */
  width: fit-content;
  margin: 0 auto;
  display: flex;
  /* border: 1px solid black; */
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

export default function CalendarPage() {
  const [calendarId, setCalendarId] = useState<number | null>(null);
  const params = useParams<{ calendar_id: string }>();
  const calendarDate = useRecoilValue(CalendarDateAtom);

  const { data: subGoals } = useQuery<SubGoals[]>({
    queryKey: [
      "shared_calendar_subGoals",
      calendarId,
      calendarDate.year,
      calendarDate.month,
    ],
    queryFn: async () =>
      await getSubGoals({
        calendar_id: calendarId!,
        plan_date: `${calendarDate.year}-${calendarDate.month
          .toString()
          .padStart(2, "0")}`,
      }),
  });

  useEffect(() => {
    if (params.calendar_id) {
      setCalendarId(Number(params.calendar_id));
    }
  }, [params.calendar_id]);

  const { data: calendarInfo } = useQuery<CalendarInfo>({
    queryKey: ["calendarInfo", calendarId],
    queryFn: async () => await getCalendar(calendarId!),
    enabled: !!calendarId,
  });

  const { data: permission } = useQuery<Permission>({
    queryKey: ["permission", params.calendar_id],
    queryFn: async () =>
      await getCalendarPermission(Number(params.calendar_id)),
  });

  console.log(permission);
  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center
            calendarInfo={calendarInfo!}
            subGoals={subGoals}
            isAdmin={permission?.is_admin}
          />
          <CalendarGoals />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
