import { updateSubGoal } from "api/goals";
import { useState } from "react";
import getISOString from "utils/getISOString";
import styled from "styled-components";

const TodoBtn = styled.div<{ color: string }>`
  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    cursor: pointer;
  }

  label::before {
    width: 16px;
    height: 16px;
    border: 2px solid ${(props) => props.color};
    content: "";
    display: inline-block;
    border-radius: 4px;
  }

  input:checked + label::before {
    content: "";
    background-color: ${(props) => props.color};
  }
`;

export default function Checkbox({
  id,
  color,
  status,
  text,
  refetch,
}: {
  id: number;
  color: string;
  status: string;
  text: string;
  refetch: () => void;
}) {
  const initialCheckedState = status === "incomplete" ? false : true;
  const [isChecked, setIsChecked] = useState(initialCheckedState);

  const todoCheck = async () => {
    setIsChecked(!isChecked);
    const planDatetime = getISOString();

    await updateSubGoal(
      id,
      text,
      planDatetime,
      !isChecked === true ? "complete" : "incomplete",
      refetch
    );
  };

  return (
    <TodoBtn color={color}>
      <form>
        <input type="checkbox" checked={isChecked} readOnly />
        <label onClick={todoCheck}></label>
      </form>
    </TodoBtn>
  );
}
