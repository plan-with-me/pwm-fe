import styled from "styled-components";
import check from "assets/check.svg";

const TodoBtn = styled.div<{ $color: string; $disabled: boolean }>`
  input {
    display: none;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: ${({ $disabled }) => ($disabled ? "default" : "pointer")};
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

interface CheckboxProps {
  color: string;
  status: string;
  todoCheck?: () => void;
  disabled?: boolean;
}

export default function Checkbox({
  color,
  status,
  todoCheck,
  disabled = false,
}: CheckboxProps) {
  const isChecked = status === "complete";

  return (
    <TodoBtn $color={color} $disabled={disabled}>
      <form>
        <input type="checkbox" checked={isChecked} readOnly />
        <label onClick={() => (todoCheck && !disabled ? todoCheck() : {})}>
          {isChecked && <img src={check} width={10} />}
        </label>
      </form>
    </TodoBtn>
  );
}
