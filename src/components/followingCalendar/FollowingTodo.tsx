import { useState } from "react";
import styled from "styled-components";
import check from "assets/check.svg";
import { SubGoals, TopGoals } from "api/goals";
import CommentModal from "./CommentModal";

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

const Checkbox = styled.div<{ $color: string }>`
  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      position: relative;
      right: 15px;
      margin-right: -10px;
    }
  }

  label::before {
    width: 20px;
    height: 20px;
    background-color: #d5d5d5;
    content: "";
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
  }

  input:checked + label:before {
    content: "";
    background-color: ${(props) => props.$color};
  }
`;

export default function FollowingTodo({
  subGoal,
  category,
  calendarId,
}: {
  subGoal: SubGoals;
  category: TopGoals;
  calendarId: number;
}) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  return (
    <>
      <Todo key={subGoal.id} $color={category.color}>
        <Checkbox $color={category.color}>
          <form>
            <input
              type="checkbox"
              checked={subGoal.status === "incomplete" ? false : true}
              readOnly
            />
            <label>
              {subGoal.status === "incomplete"
                ? false
                : true && <img src={check} width={10} />}
            </label>
          </form>
        </Checkbox>
        <div className="text" onClick={() => setIsCalendarModalOpen(true)}>
          <span>{subGoal.name}</span>
        </div>
      </Todo>
      <CommentModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        subGoalId={subGoal.id}
        calendarId={calendarId}
      ></CommentModal>
    </>
  );
}
