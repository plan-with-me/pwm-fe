import styled from "styled-components";
import right_arrow from "assets/angle-right-solid.svg";
import left_arrow from "assets/angle-left-solid.svg";
import { useRecoilState } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import pin from "assets/pin.svg";
import { useNavigate } from "react-router-dom";

const DateController = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .date {
    display: flex;
    align-items: center;
    gap: 8px;

    img {
      padding: 4px;
      &:hover {
        border-radius: 50%;
        background-color: #d5d5d5;
      }
    }
  }

  span {
    font-weight: 600;
  }

  .arrow {
    display: flex;
    gap: 20px;
    img {
      cursor: pointer;
    }
  }
`;

const CalendarDate = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  justify-items: center;
`;

const Day = styled.div<{
  $emptyColor?: string;
  $bgColor?: string;
  $textColor?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  .empty {
    background-color: ${(props) => props.$emptyColor || "#d5d5d5"};
    width: 18px;
    height: 18px;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 12px;
  }

  #complete {
    background-color: white;
    position: relative;
    img {
      position: relative;
      left: 2px;
    }
  }

  .date {
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

export default function Calendar() {
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

  const navigate = useNavigate();
  return (
    <>
      <div>
        <DateController>
          <div className="date">
            <span>
              {calendarDate.year}년 {calendarDate.month}월
            </span>
            <img src={pin} width={16} onClick={() => navigate("/home")} />
          </div>
          <div className="arrow">
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
              $emptyColor={date ? "" : "white"}
              $bgColor={
                date === calendarDate.date
                  ? "black"
                  : date === today.getDate() &&
                    calendarDate.month === today.getMonth() + 1 &&
                    calendarDate.year === today.getFullYear()
                  ? "lightgrey"
                  : ""
              }
              $textColor={date === calendarDate.date ? "white" : ""}
            >
              <div
                className="empty"
                onClick={() => {
                  setCalendarDate({ ...calendarDate, date });
                }}
              ></div>

              <span className="date">{date}</span>
            </Day>
          ))}
        </CalendarDate>
      </div>
    </>
  );
}
