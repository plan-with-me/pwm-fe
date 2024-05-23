import {
  createSubGoals,
  deleteSubGoals,
  getSubGoals,
  getTopGoals,
} from "api/calendarGoals";
import { FormEvent, useEffect, useState } from "react";
import styled from "styled-components";
import CategoryTitle from "./CategoryTitle";
import { useQuery } from "@tanstack/react-query";
import { SubGoals, TopGoals } from "api/goals";
import CalendarCheckbox from "./CalendarCheckbox";

const Wrapper = styled.div`
  width: 400px;
  height: fit-content;
  margin: 40px 20px;

  @media (max-width: 1240px) {
    margin-top: 85px;
  }
  @media (max-width: 880px) {
    margin-top: 40px;
  }
  @media (max-width: 440px) {
    width: calc(100% - 40px);
    overflow-y: none;
  }

  @media (min-width: 880px) {
    height: calc(100dvh - 189px);
    overflow-y: auto;
  }
  @media (min-width: 1240px) {
    height: calc(100dvh - 144px);
    overflow-y: auto;
  }
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const WriteForm = styled.form<{ color: string }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;

  div {
    width: 20px;
    height: 20px;
    background-color: #d5d5d5;
    border-radius: 4px;
    cursor: pointer;
  }

  input {
    width: calc(100% - 40px);
    background-color: none;
    border: none;
    border-bottom: 2px solid ${(props) => props.color};
    padding: 4px;
  }
`;

const Todo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export default function CalendarGoals({ calendarId }: { calendarId: number }) {
  const [todoText, setTodoText] = useState("");
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

  const { data: categories, isLoading: categoriesLoading } = useQuery<
    TopGoals[]
  >({
    queryKey: ["sharedCalendarCategory", calendarId],
    queryFn: async () => await getTopGoals(calendarId),
  });

  const {
    data: subGoals,
    isLoading: subLoading,
    refetch,
  } = useQuery<SubGoals[]>({
    queryKey: ["sharedCalendarSubGoals", calendarId],
    queryFn: async () => await getSubGoals(calendarId),
  });

  const [sortedSubGoals, setSortedSubGoals] = useState<
    Record<number, SubGoals[]>
  >({});

  function sortSubGoals(categories: TopGoals[], subGoals: SubGoals[]) {
    const sortedSubGoalsMap: Record<number, SubGoals[]> = {};

    if (categories && subGoals) {
      categories.forEach((category) => {
        const subGoalsForCategory = subGoals.filter(
          (subGoal) => subGoal.top_goal_id === category.id
        );
        sortedSubGoalsMap[category.id] = subGoalsForCategory;
      });
    }
    setSortedSubGoals(sortedSubGoalsMap);
  }

  useEffect(() => {
    if (!subLoading && !categoriesLoading) {
      categories && subGoals && sortSubGoals(categories, subGoals);
    }
  }, [categories, subGoals, subLoading, categoriesLoading]);

  // 하위 목표 등록
  const todoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = todoText.trim();

    if (text && openCategoryId) {
      await createSubGoals(
        text,
        new Date(),
        "incomplete",
        calendarId,
        openCategoryId,
        refetch
      );
      setTodoText("");
    }
  };

  const handleSubGoalDelete = async (subGoalId: number) => {
    await deleteSubGoals(calendarId, subGoalId, refetch);
  };

  return (
    <Wrapper>
      {categories &&
        categories.map((category: TopGoals) => (
          <Category key={category.id}>
            <CategoryTitle
              onClick={() => {
                if (category.id === openCategoryId) {
                  setOpenCategoryId(null);
                } else {
                  setOpenCategoryId(category.id);
                }
              }}
              color={category.color}
              name={category.name}
            />
            {sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                <Todo key={subGoal.id}>
                  <CalendarCheckbox
                    calendarId={calendarId}
                    id={subGoal.id}
                    color={category.color}
                    status={subGoal.status}
                    text={subGoal.name}
                    refetch={refetch}
                  />
                  <span>{subGoal.name}</span>
                  <button onClick={() => handleSubGoalDelete(subGoal.id)}>
                    삭제하기
                  </button>
                </Todo>
              ))}
            {openCategoryId === category.id && (
              <WriteForm onSubmit={todoSubmit} color={category.color}>
                <div />
                <input
                  placeholder="할 일 입력"
                  value={todoText}
                  onChange={(event) => setTodoText(event.target.value)}
                />
              </WriteForm>
            )}
          </Category>
        ))}
    </Wrapper>
  );
}
