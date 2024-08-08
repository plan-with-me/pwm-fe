import styled from "styled-components";
import right_arrow from "assets/angle-right-solid.svg";
import left_arrow from "assets/angle-left-solid.svg";
import { useRecoilState } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { SubGoals, TopGoals } from "api/goals";
import { useEffect, useState } from "react";
import check from "assets/check.svg";
import weather from "assets/weather/weather1.png";
import { useLocation, useNavigate } from "react-router-dom";

const DateController = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .date {
    display: flex;
    align-items: center;
    gap: 8px;

    div {
      width: 16px;
      height: 16px;
      display: flex;
      justify-content: center;
      align-items: center;

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

const Palette = styled.div<{
  $firstColor?: string;
  $secondColor?: string;
  $thirdColor?: string;
  $fourthColor?: string;
}>`
  width: 18px;
  height: 18px;
  cursor: pointer;

  .first {
    background-color: ${(props) => props.$firstColor};
  }
  .second {
    background-color: ${(props) => props.$secondColor};
    left: -50%;
  }
  .third {
    background-color: ${(props) => props.$thirdColor};
    top: -50%;
  }
  .fourth {
    background-color: ${(props) => props.$fourthColor};
    top: -50%;
    left: -50%;
  }
  .palette {
    width: 18px;
    height: 18px;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    .circle {
      opacity: 0.8;
      width: 12px;
      height: 12px;
      position: relative;
      border-radius: 50%;
    }
  }
  .todos {
    width: 18px;
    height: 18px;
    font-size: 12px;
    color: white;
    position: relative;
    top: -18px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

export default function Calendar({
  subGoals,
  categories,
}: {
  subGoals?: SubGoals[];
  categories?: TopGoals[];
}) {
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
  const [colors, setColors] = useState(new Map());

  useEffect(() => {
    if (subGoals && categories) {
      const newTodos = new Map();
      const newColors = new Map();

      subGoals.forEach((item) => {
        const todoDate = new Date(item.plan_datetime);
        const date = todoDate.getDate();

        // 날짜별로 초기화
        if (!newTodos.has(date)) {
          newTodos.set(date, 0);
          newColors.set(date, []);
        }

        // 미완료된 할 일 개수 세기
        if (item.status === "incomplete") {
          newTodos.set(date, newTodos.get(date) + 1);
        } else if (item.status === "complete") {
          // 한 개라도 완료된 항목이 있으면 색상 추가
          const topGoal = categories.find(
            (goal) => goal.id === item.top_goal_id
          );
          if (topGoal) {
            const currentColors = newColors.get(date);
            if (!currentColors.includes(topGoal.color)) {
              newColors.set(date, [...currentColors, topGoal.color]);
            }
          }
        }
      });

      setTodos(newTodos);
      setColors(newColors);
    }
  }, [categories, subGoals]);

  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <div>
        <DateController>
          <div className="date">
            <span>
              {calendarDate.year}년 {calendarDate.month}월
            </span>
            <div>
              {location.pathname === "/home" && (
                <img
                  src={weather}
                  width={36}
                  onClick={() => navigate("/diary")}
                />
              )}
            </div>
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
              {colors.get(date) && colors.get(date).length > 0 ? (
                <Palette
                  $firstColor={colors.get(date)[0]}
                  $secondColor={colors.get(date)[1] || colors.get(date)[0]}
                  $thirdColor={
                    colors.get(date)[2] ||
                    colors.get(date)[1] ||
                    colors.get(date)[0]
                  }
                  $fourthColor={colors.get(date)[3] || colors.get(date)[0]}
                  onClick={() => {
                    setCalendarDate({ ...calendarDate, date });
                  }}
                >
                  <div className="palette">
                    <div className="first circle"></div>
                    <div className="second circle"></div>
                    <div className="third circle"></div>
                    <div className="fourth circle"></div>
                  </div>
                  <div className="todos">
                    {todos.get(date) || <img src={check} width={10} />}
                  </div>
                </Palette>
              ) : (
                <div
                  className="empty"
                  onClick={() => {
                    setCalendarDate({ ...calendarDate, date });
                  }}
                >
                  {todos.get(date)}
                </div>
              )}
              <span className="date">{date}</span>
            </Day>
          ))}
        </CalendarDate>
      </div>
    </>
  );
}
