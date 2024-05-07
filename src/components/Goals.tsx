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

const Wrapper = styled.div`
  width: 500px;
  /* height: 800px; */
  /* padding: 20px; */
  border: solid 1px black;
`;

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

const CategoryTitle = styled.span`
  width: fit-content;
  background-color: #d5d5d5;
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 8px;
`;

const WriteInput = styled.input`
  width: 300px;
  background-color: none;
  border: none;
  border-bottom: 1px solid black;
  height: 24px;
  border-radius: 4px;
  padding: 4px;
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
    const date = new Date();
    const offset = date.getTimezoneOffset() * 60000;
    const dateOffset = new Date(date.getTime() - offset);

    await postSubGoals(
      value,
      dateOffset.toISOString(),
      "incomplete",
      categoryId,
      refetch
    );
  };

  const handleInputKeyPress = (
    event: React.KeyboardEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (event.key === "Enter") {
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
            <CategoryTitle onClick={() => setOpenCategoryId(category.id)}>
              {category.name}
            </CategoryTitle>
            {!subLoading &&
              sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                <div key={subGoal.id}>
                  <span>{subGoal.name}</span>
                  <button onClick={() => handleSubGoalDelete(subGoal.id)}>
                    삭제하기
                  </button>
                </div>
              ))}
            {openCategoryId === category.id && (
              <WriteInput
                placeholder="할 일 입력"
                onKeyUp={(e) => handleInputKeyPress(e, category.id)}
              ></WriteInput>
            )}
          </Category>
        ))}
    </Wrapper>
  );
}
