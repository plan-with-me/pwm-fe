import styled from "styled-components";
import logo from "assets/logo.png";
import bars from "assets/bars-solid.svg";
import user from "assets/user-regular.svg";
import users from "assets/users-solid.svg";
import plus from "assets/plus-solid.svg";
import CategoryTitle from "./CategoryTitle";
import { TopGoals, getTopGoals } from "api/goals";
import { useQuery } from "@tanstack/react-query";

const Wrapper = styled.div`
  width: 320px;
  height: 100vh;
  padding: 20px;
  /* border: solid 1px black; */
`;

const Logos = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const CalendarSelect = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
  display: flex;
  flex-direction: column;
  font-size: 20px;
  font-weight: 500;
  gap: 40px;

  div {
    display: flex;
    align-items: center;
    gap: 16px;
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
  const { data: categories, isLoading: categoriesLoading } = useQuery<
    TopGoals[]
  >({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  return (
    <Wrapper>
      <Logos>
        <img src={logo} width={160} />
        <img src={bars} width={30} alt="" />
      </Logos>
      <CalendarSelect>
        <div>
          <img src={user} alt="" width={40} height={40} />
          <span>개인 달력</span>
        </div>
        <div>
          <img src={users} alt="" width={40} />
          <span>가족 달력</span>
        </div>
        <div>
          <img src={plus} alt="" width={40} />
          <span>달력 추가</span>
        </div>
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
    </Wrapper>
  );
}
