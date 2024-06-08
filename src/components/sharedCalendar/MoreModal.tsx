import { deleteSubGoals } from "api/calendarGoals";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import { useRef, useState } from "react";
import { useSetRecoilState } from "recoil";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import styled from "styled-components";
import SharedCalendarModal from "./CalendarModal";

const ModalDiv = styled.div`
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
    display: flex;
    justify-content: center;
    border-top: 1px solid hsla(220, 9%, 46%, 0.3);
    &:first-child {
      border-top: 0;
    }
  }
`;

export default function MoreModal({
  calendarId,
  subGoalId,
  text,
  status,
  date,
  refetch,
}: {
  calendarId: number;
  subGoalId: number;
  text: string;
  status: string;
  date: string;
  refetch: () => void;
}) {
  const [isMoreBtnClicked, setIsMoreBtnClicked] = useState(false);
  const setSelectedTodo = useSetRecoilState(selectedTodoAtom);

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsMoreBtnClicked(false));
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  return (
    <>
      <img
        src={more}
        width={20}
        onClick={() => setIsMoreBtnClicked(!isMoreBtnClicked)}
      />
      {isMoreBtnClicked && (
        <ModalDiv id="modal" ref={modalRef}>
          <div
            id="delete"
            onClick={async () =>
              await deleteSubGoals(calendarId, subGoalId, refetch)
            }
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
          <div
            onClick={() => {
              setIsCalendarModalOpen(true);
              setIsMoreBtnClicked(false);
            }}
          >
            날짜 바꾸기
          </div>
        </ModalDiv>
      )}
      <SharedCalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        date={date}
        calendarId={calendarId}
        id={subGoalId}
        text={text}
        status={status}
        refetch={refetch}
      />
    </>
  );
}
