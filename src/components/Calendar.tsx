import { useEffect, useState } from "react";
import styled from "styled-components";

const DateController = styled.div`
  margin-bottom: 20px;
  span {
    font-weight: 600;
  }
`;

const CalendarDate = styled.div`
  width: 500px;
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  justify-items: center;
`;

const Day = styled.div<{ emtpyColor?: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  div {
    background-color: ${(props) => props.emtpyColor || "#d5d5d5"};
    width: 20px;
    height: 20px;
    border-radius: 4px;
  }
`;

export default function Calendar() {
  // 현재 년, 월, 일을 state로 관리합니다.
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 월은 0부터 시작하므로 +1 해줍니다.

  // 해당 월의 첫 번째 날의 요일을 구합니다.
  const firstDayOfMonth = new Date(year, month - 1, 1).getDay();

  // 해당 월의 마지막 날짜를 구합니다.
  const lastDateOfMonth = new Date(year, month, 0).getDate();

  // 이전 달로 이동하는 함수
  const goToPreviousMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  // 다음 달로 이동하는 함수
  const goToNextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <>
      <div>
        <DateController>
          <span>
            {year}년 {month}월
          </span>
          <button onClick={goToPreviousMonth}>이전 달</button>

          <button onClick={goToNextMonth}>다음 달</button>
        </DateController>
        <CalendarDate>
          {[
            ...Array(firstDayOfMonth).fill(null),
            ...Array(lastDateOfMonth)
              .fill(null)
              .map((_, index) => index + 1),
          ].map((date, index) => (
            <Day key={index} emtpyColor={date ? "" : "white"}>
              <div />
              <span>{date}</span>
            </Day>
          ))}
        </CalendarDate>
      </div>
    </>
  );
}
