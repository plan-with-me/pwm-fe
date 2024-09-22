import {
  createSubGoals,
  getSubGoals,
  getTopGoals,
  updateSubGoals,
} from "api/calendarGoals";
import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import CategoryTitle from "../CategoryTitle";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRecoilState, useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import getDateFormat from "utils/getDateFormat";
import { SubGoals, TopGoals } from "api/goals";
import { useParams } from "react-router-dom";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import MoreModal from "./MoreModal";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import Checkbox from "components/userCalendar/Checkbox";

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

export default function CalendarGoals() {
  const [todoText, setTodoText] = useState("");
  const [updateTodo, setUpdateTodo] = useState("");
  const [openCategoryId, setOpenCategoryId] = useState<number | null>(null);
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const [selectedTodo, setSelectedTodo] = useRecoilState(selectedTodoAtom);
  const [sortedSubGoals, setSortedSubGoals] = useState<
    Record<number, SubGoals[]>
  >({});
  const [calendarId, setCalendarId] = useState<number | null>(null);
  const params = useParams<{ calendar_id: string }>();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (params.calendar_id) {
      setCalendarId(Number(params.calendar_id));
    }
  }, [params.calendar_id]);

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["shared_calendar_category", calendarId],
    queryFn: async () => await getTopGoals(calendarId!),
    refetchInterval: 1000,
  });

  const { data: subGoals } = useQuery<SubGoals[]>({
    queryKey: [
      "shared_calendar_subGoals",
      calendarId,
      calendarDate.year,
      calendarDate.month,
    ],
    queryFn: async () =>
      await getSubGoals({
        calendar_id: calendarId!,
        plan_date: `${calendarDate.year}-${calendarDate.month
          .toString()
          .padStart(2, "0")}`,
      }),
    refetchInterval: 1000,
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
        calendarId!,
        openCategoryId
      );
      setTodoText("");

      response &&
        queryClient.invalidateQueries({
          queryKey: [
            "shared_calendar_subGoals",
            calendarId,
            calendarDate.year,
            calendarDate.month,
          ],
        });
    }
  };

  useEffect(() => {
    if (selectedTodo.id) {
      setUpdateTodo(selectedTodo.text);
    }
  }, [selectedTodo]);

  // 하위 목표 수정
  const todoUpdateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = updateTodo.trim();

    if (text && selectedTodo.id && calendarId) {
      const response = await updateSubGoals({
        sub_goal_id: selectedTodo.id,
        name: text,
        plan_datetime: new Date(
          getDateFormat(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date
          )
        ),
        calendar_id: calendarId,
        status: selectedTodo.status,
      });

      setSelectedTodo({ id: null, text: "", status: "" });

      response &&
        queryClient.invalidateQueries({
          queryKey: [
            "shared_calendar_subGoals",
            calendarId,
            calendarDate.year,
            calendarDate.month,
          ],
        });
    }
  };

  const formRef = useRef<HTMLFormElement>(null);
  useClickOutside(formRef, () => setOpenCategoryId(null));

  const todoCheck = async (
    calendarId: number,
    id: number,
    status: string,
    text: string
  ) => {
    const newStatus = status === "incomplete" ? "complete" : "incomplete";

    const response = await updateSubGoals({
      calendar_id: calendarId,
      sub_goal_id: id,
      name: text,
      plan_datetime: new Date(
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
      status: newStatus,
    });

    response &&
      queryClient.invalidateQueries({
        queryKey: [
          "shared_calendar_subGoals",
          calendarId,
          calendarDate.year,
          calendarDate.month,
        ],
      });
  };

  return (
    <Wrapper>
      {categories &&
        categories.map((category: TopGoals) => (
          <Category key={category.id}>
            {/* 종료한 목표 중 하위 목표가 있는 상위 목표만 표시 + 종료하지 않은 목표 표시 */}
            {((sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].length > 0) ||
              category.status === "incomplete") && (
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
            )}
            {sortedSubGoals[category.id] &&
              sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                <Todo key={subGoal.id} $color={category.color}>
                  <Checkbox
                    color={category.color}
                    status={subGoal.status}
                    todoCheck={() =>
                      todoCheck(
                        calendarId!,
                        subGoal.id,
                        subGoal.status,
                        subGoal.name
                      )
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
                    calendarId={calendarId!}
                    subGoalId={subGoal.id}
                    text={subGoal.name}
                    status={subGoal.status}
                    date={subGoal.plan_datetime}
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
                  <div />
                  <input
                    id="todo"
                    name="todo"
                    type="text"
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
