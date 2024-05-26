import { CalendarInfoDetail, getCalendar } from "api/calendar";
import Center from "components/Center";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import CalendarGoals from "components/sharedCalendar/CalendarGoals";

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

  useEffect(() => {
    if (params.calendar_id) {
      setCalendarId(Number(params.calendar_id));
    }
  }, [params.calendar_id]);

  const { data: calendarInfo } = useQuery<CalendarInfoDetail>({
    queryKey: ["calendarInfo", calendarId],
    queryFn: async () => await getCalendar(calendarId!),
    enabled: !!calendarId,
  });

  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center calendarInfo={calendarInfo} />
          <CalendarGoals />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
