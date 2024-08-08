import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import styled from "styled-components";
import weather1 from "assets/weather/weather1.png";

const Wrapper = styled.div`
  width: 400px;
  height: calc(100dvh - 189px);
  margin-left: 20px;
  margin-right: 20px;

  @media (max-width: 1240px) {
    margin-top: 85px;
  }

  @media (max-width: 880px) {
    margin-top: 40px;
  }
  /* border: 1px solid black; */
  display: flex;

  flex-direction: column;
  gap: 20px;

  .date-weather {
    display: flex;
    /* justify-content: center; */
    align-items: center;
    gap: 8px;
  }

  .weather {
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  textarea {
    width: 100%;
    height: 500px;
    resize: none;
  }
`;

export default function Write() {
  const [calendarDate, setCalendarDate] = useRecoilState(CalendarDateAtom);

  return (
    <>
      <Wrapper>
        <div className="date-weather">
          <span>
            {calendarDate.year}년 {calendarDate.month}월 {calendarDate.date}일
          </span>
          <div className="weather">
            <img src={weather1} alt="" width={36} />
          </div>
        </div>
        <textarea />
      </Wrapper>
    </>
  );
}
