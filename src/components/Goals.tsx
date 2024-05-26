import {
  SubGoals,
  TopGoals,
  createSubGoals,
  getSubGoals,
  getTopGoals,
  updateSubGoals,
} from "api/goals";
import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Checkbox from "./Checkbox";
import CategoryTitle from "./CategoryTitle";
import { useRecoilState, useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import getDateFormat from "utils/getDateFormat";
import { useQuery } from "@tanstack/react-query";
import MoreModal from "./MoreModal";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";

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

const WriteForm = styled.form<{ $color: string }>`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  width: 344px;
  input {
    width: 100%;
    border: none;
    border-bottom: 2px solid ${(props) => props.$color};
    padding: 4px;
  }
`;

const Box = styled.div`
  width: 20px;
  height: 20px;
  background-color: #d5d5d5;
  border-radius: 4px;
  cursor: pointer;
  content: "";
`;

const Todo = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;

  .text {
    width: 100%;
    display: flex;
    justify-content: space-between;
  }

  #update {
    width: 100%;
    input {
      width: calc(100% - 8px);
      border: none;
      border-bottom: 2px solid ${(props) => props.$color};
      padding: 4px;
    }
  }
`;

export default function Goals() {
  const [todoText, setTodoText] = useState("");
  const [updateTodo, setUpdateTodo] = useState("");
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const [sortedSubGoals, setSortedSubGoals] = useState<
    Record<number, SubGoals[]>
  >({});
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const [selectedTodo, setSelectedTodo] = useRecoilState(selectedTodoAtom);

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  const { data: subGoals, refetch } = useQuery<SubGoals[]>({
    queryKey: ["subGoals", calendarDate.year, calendarDate.month],
    queryFn: async () =>
      await getSubGoals({
        plan_date: `${calendarDate.year}-${calendarDate.month
          .toString()
          .padStart(2, "0")}`,
      }),
  });

  useEffect(() => {
    const sortedSubGoalsMap: Record<number, SubGoals[]> = {};

    if (categories && subGoals) {
      categories.forEach((category) => {
        const subGoalsForCategory = subGoals.filter((subGoal) => {
          const planDate = new Date(subGoal.plan_datetime)
            .toISOString()
            .split("T")[0];
          const targetDate = getDateFormat(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date
          );

          return subGoal.top_goal_id === category.id && planDate === targetDate;
        });
        sortedSubGoalsMap[category.id] = subGoalsForCategory;
      });
    }
    setSortedSubGoals(sortedSubGoalsMap);
  }, [categories, subGoals, calendarDate]);

  useEffect(() => {
    if (selectedTodo.id) {
      setUpdateTodo(selectedTodo.text);
    }
  }, [selectedTodo]);

  // 하위 목표 등록
  const todoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = todoText.trim();

    if (text && openCategoryId) {
      await createSubGoals(
        text,
        new Date(
          getDateFormat(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date
          )
        ),
        "incomplete",
        openCategoryId,
        refetch
      );
      setTodoText("");
    }
  };

  // 하위 목표 업데이트
  const todoUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = updateTodo.trim();

    if (text && selectedTodo.id) {
      await updateSubGoals(
        selectedTodo.id,
        text,
        new Date(
          getDateFormat(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date
          )
        ),
        selectedTodo.status,
        refetch
      );

      setSelectedTodo({ id: null, text: "", status: "" });
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  useClickOutside(formRef, () => setOpenCategoryId(null));

  return (
    <Wrapper>
      {categories &&
        categories.map((category: TopGoals) => (
          <Category key={category.id}>
            <CategoryTitle
              onClick={() => setOpenCategoryId(category.id)}
              color={category.color}
              name={category.name}
            />
            {sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                <Todo key={subGoal.id} $color={category.color}>
                  <Checkbox
                    id={subGoal.id}
                    color={category.color}
                    status={subGoal.status}
                    text={subGoal.name}
                    refetch={refetch}
                  />

                  <div className="text">
                    {subGoal.id === selectedTodo.id ? (
                      <form id="update" onSubmit={todoUpdateSubmit}>
                        <input
                          placeholder="할 일 입력"
                          value={updateTodo}
                          onChange={(event) => {
                            setUpdateTodo(event.target.value);
                          }}
                          autoFocus={true}
                        />
                      </form>
                    ) : (
                      <span>{subGoal.name}</span>
                    )}
                  </div>
                  <MoreModal
                    subGoalId={subGoal.id}
                    text={subGoal.name}
                    status={subGoal.status}
                    refetch={refetch}
                  />
                </Todo>
              ))}
            {openCategoryId === category.id && (
              <Todo $color={category.color}>
                <Box />
                <WriteForm
                  onSubmit={todoSubmit}
                  $color={category.color}
                  ref={formRef}
                >
                  <input
                    placeholder="할 일 입력"
                    value={todoText}
                    onChange={(event) => setTodoText(event.target.value)}
                    autoFocus={true}
                  />
                </WriteForm>
                <img src={more} width={20} />
              </Todo>
            )}
          </Category>
        ))}
    </Wrapper>
  );
}
