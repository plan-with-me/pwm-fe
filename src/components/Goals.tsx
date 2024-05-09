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
import axios from "axios";

const Wrapper = styled.div`
  width: 500px;
  border: solid 1px black;
  margin: 20px;
  padding-top: 20px;
  padding-bottom: 20px;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.div<{ color: string }>`
  width: fit-content;
  background-color: #d5d5d5;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;

  div {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${(props) => props.color || "black"};
  }
`;

const WriteInput = styled.div<{ color: string }>`
  display: flex;
  align-items: flex-end;
  gap: 4px;

  div {
    width: 16px;
    height: 16px;
    border: 2px solid ${(props) => props.color};
    border-radius: 4px;
    cursor: pointer;
  }

  input {
    width: 300px;
    background-color: none;
    border: none;
    border-bottom: 2px solid ${(props) => props.color};
    padding: 4px;
  }
`;

const Todo = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
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
            >
              <div />
              <span>{category.name}</span>
            </CategoryTitle>
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
