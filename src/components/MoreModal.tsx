import { deleteSubGoals } from "api/goals";
import more from "assets/more.svg";
import { useEffect, useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import styled from "styled-components";

const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 0px;
  top: 5px;
  background-color: white;
  z-index: 1;
  border-radius: 8px;
  border: 1px solid hsla(220, 9%, 46%, 0.3);
  div {
    padding: 8px 16px;
    font-size: 12px;
    cursor: pointer;
  }
  #delete {
    border-bottom: 1px solid hsla(220, 9%, 46%, 0.3);
  }
`;
export default function MoreModal({
  subGoalId,
  text,
  status,
  refetch,
}: {
  subGoalId: number;
  text: string;
  status: string;
  refetch: () => void;
}) {
  const [isMoreBtnClicked, setIsMoreBtnClicked] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsMoreBtnClicked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [modalRef, setIsMoreBtnClicked]);

  const setSelectedTodo = useSetRecoilState(selectedTodoAtom);

  return (
    <>
      <img
        src={more}
        width={20}
        onClick={() => setIsMoreBtnClicked(!isMoreBtnClicked)}
      />
      {isMoreBtnClicked && (
        <Modal id="modal" ref={modalRef}>
          <div
            id="delete"
            onClick={async () => await deleteSubGoals(subGoalId, refetch)}
          >
            삭제하기
          </div>
          <div
            id="change"
            onClick={() => {
              setIsMoreBtnClicked(false);
              setSelectedTodo({ id: subGoalId, text, status });
            }}
          >
            수정하기
          </div>
        </Modal>
      )}
    </>
  );
}
