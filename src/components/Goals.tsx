import {
  SubGoals,
  TopGoals,
  deleteSubGoal,
  getSubGoals,
  getTopGoals,
  postSubGoals,
} from "api/goals";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Checkbox from "./Checkbox";
import CategoryTitle from "./CategoryTitle";

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

const WriteInput = styled.div<{ color: string }>`
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

export default function Goals() {
  const { data: categories, isLoading: categoriesLoading } = useQuery<
    TopGoals[]
  >({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  const {
    data: subGoals,
    isLoading: subLoading,
    refetch,
  } = useQuery<SubGoals[]>({
    queryKey: ["subGoals"],
    queryFn: async () => await getSubGoals(),
  });

  const [sortedSubGoals, setSortedSubGoals] = useState<
    Record<number, SubGoals[]>
  >({});

  useEffect(() => {
    if (!subLoading && !categoriesLoading) {
      categories && subGoals && sortSubGoals(categories, subGoals);
    }
  }, [categories, subGoals, subLoading, categoriesLoading]);

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

  const todoSubmit = async (categoryId: number, value: string) => {
    await postSubGoals(value, new Date(), "incomplete", categoryId, refetch);
  };

  // 하위 목표 등록
  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    const text = event.currentTarget.value.trim();

    if (event.key === "Enter" && text) {
      event.preventDefault();
      todoSubmit(categoryId, event.currentTarget.value);
      event.currentTarget.value = "";
    }
  };

  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);

  const handleSubGoalDelete = async (subGoalId: number) => {
    await deleteSubGoal(subGoalId, refetch);
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
            {!subLoading &&
              sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                <Todo key={subGoal.id}>
                  <Checkbox
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
              <WriteInput color={category.color}>
                <div></div>
                <input
                  placeholder="할 일 입력"
                  onKeyUp={(e) => handleInputKeyPress(e, category.id)}
                />
              </WriteInput>
            )}
          </Category>
        ))}
    </Wrapper>
  );
}
