import { TopGoals, getTopGoals } from "api/goals";
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
  const { data: categories, isLoading } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  return (
    <Wrapper>
      {categories &&
        categories.map((category: TopGoals) => (
          <Category key={category.id}>
            <CategoryTitle onClick={() => setOpenCategoryId(category.id)}>
              {category.name}
            </CategoryTitle>
            {openCategoryId === category.id && (
              <WriteInput placeholder="할 일 입력"></WriteInput>
            )}
          </Category>
        ))}
    </Wrapper>
  );
}
