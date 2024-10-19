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
import Checkbox from "components/Checkbox";
import CategoryTitle from "../CategoryTitle";
import { useRecoilState, useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import getDateFormat from "utils/getDateFormat";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import MoreModal from "./MoreModal";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import EmojiContainer from "components/EmojiContainer";
import { ReactionType } from "api/reaction";

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
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  const { data: subGoals } = useQuery<SubGoals[]>({
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
      const response = await createSubGoals(
        text,
        new Date(
          getDateFormat(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date
          )
        ),
        "incomplete",
        openCategoryId
      );
      setTodoText("");

      response &&
        queryClient.invalidateQueries({
          queryKey: ["subGoals", calendarDate.year, calendarDate.month],
        });
    }
  };

  // 하위 목표 업데이트
  const todoUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = updateTodo.trim();

    if (text && selectedTodo.id) {
      const response = await updateSubGoals(
        selectedTodo.id,
        text,
        new Date(
          getDateFormat(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date
          )
        ),
        selectedTodo.status
      );

      setSelectedTodo({ id: null, text: "", status: "" });

      response &&
        queryClient.invalidateQueries({
          queryKey: ["subGoals", calendarDate.year, calendarDate.month],
        });
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  useClickOutside(formRef, () => setOpenCategoryId(null));

  const todoCheck = async (id: number, text: string, status: string) => {
    const newStatus = status === "incomplete" ? "complete" : "incomplete";
    const response = await updateSubGoals(
      id,
      text,
      new Date(
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
      newStatus
    );

    if (response) {
      queryClient.invalidateQueries({
        queryKey: ["subGoals", calendarDate.year, calendarDate.month],
      });
    }
  };

  return (
    <Wrapper>
      {categories &&
        categories.map(
          (category: TopGoals) =>
            ((sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].length > 0) ||
              category.status === "incomplete") && (
              <Category key={category.id}>
                {/* 종료한 목표 중 하위 목표가 있는 상위 목표만 표시 + 종료하지 않은 목표 표시 */}
                <CategoryTitle
                  onClick={() => setOpenCategoryId(category.id)}
                  color={category.color}
                  name={category.name}
                />

                {sortedSubGoals[category.id] &&
                  sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                    <>
                      <Todo key={subGoal.id} $color={category.color}>
                        <Checkbox
                          color={category.color}
                          status={subGoal.status}
                          todoCheck={() =>
                            todoCheck(subGoal.id, subGoal.name, subGoal.status)
                          }
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
                          date={subGoal.plan_datetime}
                        />
                      </Todo>
                      <EmojiContainer
                        reactions={subGoal.reactions.filter(
                          (item) => item.type === ReactionType.EMOTICON
                        )}
                      />
                    </>
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
            )
        )}
    </Wrapper>
  );
}
