import styled from "styled-components";
import right_arrow from "assets/angle-right-solid.svg";
import left_arrow from "assets/angle-left-solid.svg";
import { useRecoilState } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { SubGoals } from "api/goals";
import { useEffect, useState } from "react";

const DateController = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  span {
    font-weight: 600;
  }
  div {
    display: flex;
    gap: 20px;
    img {
      cursor: pointer;
    }
  }
`;

const CalendarDate = styled.div`
  /* width: 400px; */
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  justify-items: center;
`;

const Day = styled.div<{
  $emtpyColor?: string;
  $bgColor?: string;
  $textColor?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  div {
    background-color: ${(props) => props.$emtpyColor || "#d5d5d5"};
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }

  span {
    background-color: ${(props) => props.$bgColor};
    font-size: 12px;
    color: ${(props) => props.$textColor};
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
`;

export default function Calendar({ subGoals }: { subGoals?: SubGoals[] }) {
  const today = new Date();

  const [calendarDate, setCalendarDate] = useRecoilState(CalendarDateAtom);

  // 해당 월의 첫 번째 날의 요일을 구합니다.
  const firstDayOfMonth = new Date(
    calendarDate.year,
    calendarDate.month - 1,
    1
  ).getDay();

  // 해당 월의 마지막 날짜를 구합니다.
  const lastDateOfMonth = new Date(
    calendarDate.year,
    calendarDate.month,
    0
  ).getDate();

  // 이전 달로 이동하는 함수
  const goToPreviousMonth = () => {
    if (calendarDate.month === 1) {
      setCalendarDate({
        ...calendarDate,
        year: calendarDate.year - 1,
        month: 12,
      });
    } else {
      setCalendarDate({ ...calendarDate, month: calendarDate.month - 1 });
    }
  };

  // 다음 달로 이동하는 함수
  const goToNextMonth = () => {
    if (calendarDate.month === 12) {
      setCalendarDate({
        ...calendarDate,
        year: calendarDate.year + 1,
        month: 1,
      });
    } else {
      setCalendarDate({ ...calendarDate, month: calendarDate.month + 1 });
    }
  };

  const [todos, setTodos] = useState(new Map());
  useEffect(() => {
    if (subGoals) {
      const newTodos = new Map();
      subGoals.forEach((item) => {
        const todoDate = new Date(item.plan_datetime);
        const date = todoDate.getDate();

        if (item.status === "incomplete") {
          if (newTodos.has(date)) {
            newTodos.set(date, newTodos.get(date) + 1);
          } else newTodos.set(date, 1);
        } else {
          if (newTodos.has(date)) {
            newTodos.set(date, newTodos.get(date) + 1);
          } else newTodos.set(date, 0);
        }
        setTodos(newTodos);
      });
    }
  }, [subGoals]);

  console.log(todos);
  return (
    <>
      <div>
        <DateController>
          <span>
            {calendarDate.year}년 {calendarDate.month}월
          </span>
          <div>
            <img src={left_arrow} onClick={goToPreviousMonth} width={12} />
            <img src={right_arrow} onClick={goToNextMonth} width={12} />
          </div>
        </DateController>
        <CalendarDate>
          <span>일</span>
          <span>월</span>
          <span>화</span>
          <span>수</span>
          <span>목</span>
          <span>금</span>
          <span>토</span>
          {[
            ...Array(firstDayOfMonth).fill(null),
            ...Array(lastDateOfMonth)
              .fill(null)
              .map((_, index) => index + 1),
          ].map((date, index) => (
            <Day
              key={index}
              $emtpyColor={date ? "" : "white"}
              $bgColor={
                date === calendarDate.date
                  ? "black"
                  : date === today.getDate()
                  ? "lightgrey"
                  : ""
              }
              $textColor={date === calendarDate.date ? "white" : ""}
            >
              <div
                onClick={() => {
                  setCalendarDate({ ...calendarDate, date });
                }}
              >
                {todos.get(date)}
              </div>
              <span>{date}</span>
            </Day>
          ))}
        </CalendarDate>
      </div>
    </>
  );
}
