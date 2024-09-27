import {
  SubGoals,
  TopGoals,
  getSubGoalsById,
  getTopGoalsById,
} from "api/goals";
import { useEffect, useState } from "react";
import styled from "styled-components";
import CategoryTitle from "../CategoryTitle";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import getDateFormat from "utils/getDateFormat";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import FollowingTodo from "./FollowingTodo";
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

export default function Goals() {
  const [sortedSubGoals, setSortedSubGoals] = useState<
    Record<number, SubGoals[]>
  >({});
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const { id } = useParams<{ id: string }>();
  const [calendarId, setCalendarId] = useState<number | null>(null);

  useEffect(() => {
    if (id) {
      setCalendarId(Number(id));
    }
  }, [id]);

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList", calendarId],
    queryFn: async () => await getTopGoalsById(calendarId!),
  });

  const { data: subGoals } = useQuery<SubGoals[]>({
    queryKey: ["subGoals", calendarId, calendarDate.year, calendarDate.month],
    queryFn: async () =>
      await getSubGoalsById({
        user_id: calendarId!,
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

  return (
    <>
      <Wrapper>
        {categories &&
          categories.map((category: TopGoals) => (
            <Category key={category.id}>
              {/* 종료한 목표 중 하위 목표가 있는 상위 목표만 표시 + 종료하지 않은 목표 표시 */}
              {((sortedSubGoals[category.id] &&
                sortedSubGoals[category.id].length > 0) ||
                category.status === "incomplete") && (
                <CategoryTitle color={category.color} name={category.name} />
              )}
              {sortedSubGoals[category.id] &&
                sortedSubGoals[category.id].map((subGoal: SubGoals) => (
                  <>
                    <FollowingTodo
                      subGoal={subGoal}
                      category={category}
                      key={subGoal.id}
                    />
                    <EmojiContainer
                      reactions={subGoal.reactions.filter(
                        (item) => item.type === ReactionType.EMOTICON
                      )}
                    />
                  </>
                ))}
            </Category>
          ))}
      </Wrapper>
    </>
  );
}
