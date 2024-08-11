import { useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import styled from "styled-components";
import { weatherIcons } from "assets/weather";
import useClickOutside from "hooks/useClickOutside";

const Wrapper = styled.div`
  width: 400px;
  height: calc(100dvh - 189px);
  margin: 40px 20px;

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
    position: relative;
  }

  .weather {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    cursor: pointer;

    &:hover {
      background-color: #d5d5d5;
      border-radius: 50%;
    }
  }

  textarea {
    width: 100%;
    height: 500px;
    resize: none;
  }
`;

const WeatherPalette = styled.div`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 4px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
  position: absolute;
  top: 0px;
  /* left: 100px; */
  right: 60px;
`;

export default function Write() {
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const [weather, setWeather] = useState(weatherIcons[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState("me");

  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(divRef, () => setIsOpen(false));

  return (
    <>
      <Wrapper>
        <div className="date-weather">
          <span>
            {calendarDate.year}년 {calendarDate.month}월 {calendarDate.date}일
          </span>
          <div className="weather" onClick={() => setIsOpen(!isOpen)}>
            <img src={weather} alt="" width={36} />
          </div>

          {isOpen && (
            <WeatherPalette ref={divRef}>
              {weatherIcons.map((icon, index) => (
                <div
                  className="weather"
                  key={index}
                  onClick={() => {
                    setWeather(icon);
                    setIsOpen(false);
                  }}
                >
                  <img src={icon} alt={`weather${index + 1}`} width={36} />
                </div>
              ))}
            </WeatherPalette>
          )}
          <select
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="me">나만 보기</option>
            <option value="followers">팔로워 공개</option>
            <option value="all">전체 공개</option>
          </select>
        </div>
        <textarea />
      </Wrapper>
    </>
  );
}
