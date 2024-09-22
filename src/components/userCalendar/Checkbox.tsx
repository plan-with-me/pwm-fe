import { useState } from "react";
import styled from "styled-components";
import check from "assets/check.svg";
import { updateSubGoals } from "api/goals";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import getDateFormat from "utils/getDateFormat";
import { useQueryClient } from "@tanstack/react-query";

const TodoBtn = styled.div<{ $color: string }>`
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
    background-color: ${(props) => props.$color};
  }
`;

interface CheckboxProps {
  id: number;
  color: string;
  status: string;
  text: string;
}

export default function Checkbox({ id, color, status, text }: CheckboxProps) {
  const initialCheckedState = status === "incomplete" ? false : true;
  const [isChecked, setIsChecked] = useState(initialCheckedState);
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const queryClient = useQueryClient();

  const todoCheck = async () => {
    const newStatus = isChecked ? "incomplete" : "complete";
    setIsChecked(!isChecked);

    const response = await updateSubGoals(
      id,
      text,
      new Date(
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
      newStatus
    );

    response &&
      queryClient.invalidateQueries({
        queryKey: ["subGoals", calendarDate.year, calendarDate.month],
      });
  };

  return (
    <TodoBtn $color={color}>
      <form>
        <input type="checkbox" checked={isChecked} readOnly />
        <label onClick={todoCheck}>
          {isChecked && <img src={check} width={10} />}
        </label>
      </form>
    </TodoBtn>
  );
}
