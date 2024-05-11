import { useState } from "react";
import styled from "styled-components";
import right_arrow from "assets/angle-right-solid.svg";
import left_arrow from "assets/angle-left-solid.svg";

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
  emtpyColor?: string;
  bgColor?: string;
  textColor?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  div {
    background-color: ${(props) => props.emtpyColor || "#d5d5d5"};
    width: 20px;
    height: 20px;
    border-radius: 4px;
    cursor: pointer;
  }

  span {
    background-color: ${(props) => props.bgColor};
    font-size: 12px;
    color: ${(props) => props.textColor};
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
`;

export default function Calendar() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1); // 월은 0부터 시작하므로 +1 해줍니다.
  const [seletedDate, setSelectedDate] = useState(today.getDate());
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
              emtpyColor={date ? "" : "white"}
              bgColor={date === seletedDate ? "black" : ""}
              textColor={date === seletedDate ? "white" : ""}
            >
              <div onClick={() => setSelectedDate(date)} />
              <span>{date}</span>
            </Day>
          ))}
        </CalendarDate>
      </div>
    </>
  );
}
