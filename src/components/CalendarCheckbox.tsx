import { useState } from "react";
import styled from "styled-components";
import check from "assets/check.svg";
import { updateSubGoals } from "api/calendarGoals";

const TodoBtn = styled.div<{ color: string }>`
  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    img {
      position: relative;
      right: 15px;
      margin-right: -10px;
    }
  }

  label::before {
    width: 20px;
    height: 20px;
    /* border: 2px solid ${(props) => props.color}; */
    background-color: #d5d5d5;
    content: "";
    display: inline-block;
    border-radius: 4px;
    vertical-align: middle;
  }

  input:checked + label:before {
    content: "";
    background-color: ${(props) => props.color};
  }
`;

interface CalendarCheckboxProps {
  calendarId: number;
  id: number;
  color: string;
  status: string;
  text: string;
  refetch: () => void;
}

export default function CalendarCheckbox({
  calendarId,
  id,
  color,
  status,
  text,
  refetch,
}: CalendarCheckboxProps) {
  const initialCheckedState = status === "incomplete" ? false : true;
  const [isChecked, setIsChecked] = useState(initialCheckedState);

  const todoCheck = async () => {
    const newStatus = isChecked ? "incomplete" : "complete";
    setIsChecked(!isChecked);

    await updateSubGoals({
      calendar_id: calendarId,
      sub_goal_id: id,
      name: text,
      status: newStatus,
      refetch: refetch,
    });
  };

  return (
    <TodoBtn color={color}>
      <form>
        <input type="checkbox" checked={isChecked} readOnly />
        <label onClick={todoCheck}>
          {isChecked && <img src={check} width={10} />}
        </label>
      </form>
    </TodoBtn>
  );
}
