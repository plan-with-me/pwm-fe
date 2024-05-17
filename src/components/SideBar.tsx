import styled from "styled-components";
import logo from "assets/logo.png";
import bars from "assets/bars-solid.svg";
import user from "assets/user-regular.svg";
import plus from "assets/plus-solid.svg";
import CategoryTitle from "./CategoryTitle";
import { TopGoals, getTopGoals } from "api/goals";
import { useQuery } from "@tanstack/react-query";
import { useRecoilState } from "recoil";
import { SideBarAtom } from "store/SideBarAtom";
import { Link } from "react-router-dom";
import { AddBtnAtom } from "store/AddBtnAtom";
import CalendarForm from "./CalendarForm";
import { CalendarInfo, getCalendars } from "api/calendar";
import { useEffect, useState } from "react";
import Dimmed from "components/UI/Dimmed";

const SidebarWrapper = styled.div<{ xPosition: number }>`
  @media (max-width: 1240px) {
    position: fixed;
    left: -360px;
    transform: translatex(${(props) => props.xPosition}px);
    transition-duration: 300ms;
    z-index: 20;
  }
`;

const SidebarLayout = styled.div`
  width: 320px;
  height: calc(100dvh - 124px);
  padding: 20px;
  background-color: white;
  @media (max-width: 1240px) {
    height: calc(100dvh - 40px);
  }
`;

const Logos = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  .bar {
    cursor: pointer;
    @media (min-width: 1240px) {
      display: none;
    }
  }
`;

const CalendarSelect = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-weight: 500;
  gap: 40px;

  div,
  a {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  a {
    color: black;
    text-decoration: none;
  }
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 2px solid #d5d5d5;
  border-bottom: 2px solid #d5d5d5;
`;

const Follow = styled.div`
  padding-top: 20px;
  span {
    font-size: 20px;
    font-weight: 500;
  }
`;

export default function SideBar() {
  const [xPosition, setX] = useRecoilState(SideBarAtom);
  const [isAddBtnClicked, setIsAddBtnClicked] = useRecoilState(AddBtnAtom);
  const [isDimmedRenderd, setIsDimmedRendered] = useState(false);

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  const { data: calenders } = useQuery<CalendarInfo[]>({
    queryKey: ["myCalendarList", isAddBtnClicked],
    queryFn: async () => await getCalendars(),
  });

  useEffect(() => {
    if (xPosition > 0) {
      setIsDimmedRendered(true);
    } else {
      setTimeout(() => setIsDimmedRendered(false), 300);
    }
  }, [xPosition]);

  return (
    <>
      <SidebarWrapper xPosition={xPosition}>
        <SidebarLayout>
          <Logos>
            <img src={logo} width={160} />
            <img
              src={bars}
              width={30}
              alt=""
              className="bar"
              onClick={() => setX(-xPosition)}
            />
          </Logos>
          <CalendarSelect>
            <Link to="/home">
              <img src={user} alt="" width={40} height={40} />
              <span>개인 달력</span>
            </Link>
            {calenders?.map((calendar) => (
              <div key={calendar.id}>
                <img src={user} alt="" width={40} height={40} />
                <span>{calendar.name}</span>
              </div>
            ))}

            {isAddBtnClicked ? (
              <CalendarForm />
            ) : (
              <div onClick={() => setIsAddBtnClicked(!isAddBtnClicked)}>
                <img src={plus} alt="" width={40} />
                <span>달력 추가</span>
              </div>
            )}
          </CalendarSelect>
          <Category>
            {categories &&
              categories.map((category: TopGoals) => (
                <CategoryTitle
                  key={category.id}
                  color={category.color}
                  name={category.name}
                />
              ))}
          </Category>
          <Follow>
            <span>팔로우</span>
          </Follow>
        </SidebarLayout>
      </SidebarWrapper>
      {isDimmedRenderd && (
        <Dimmed isVisible={xPosition > 0} onClick={() => setX(-xPosition)} />
      )}
    </>
  );
}
