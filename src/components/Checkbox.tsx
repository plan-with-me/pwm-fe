import { updateSubGoal } from "api/goals";
import { useState } from "react";
import styled from "styled-components";
import check from "assets/check.svg";

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
      position: absolute;
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

    await updateSubGoal(
      id,
      text,
      new Date(),
      !isChecked === true ? "complete" : "incomplete",
      refetch
    );
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
