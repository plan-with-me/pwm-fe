import { deleteSubGoals } from "api/calendarGoals";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import styled from "styled-components";
import SharedCalendarModal from "./CalendarModal";
import { useQueryClient } from "@tanstack/react-query";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import CopySubGoalModal from "./CopySubGoalModal";

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
}: {
  calendarId: number;
  subGoalId: number;
  text: string;
  status: string;
  date: string;
}) {
  const [isMoreBtnClicked, setIsMoreBtnClicked] = useState(false);
  const setSelectedTodo = useSetRecoilState(selectedTodoAtom);

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsMoreBtnClicked(false));
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const queryClient = useQueryClient();

  async function deleteSubmit() {
    const response = await deleteSubGoals(calendarId, subGoalId);
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

  return (
    <>
      <img
        src={more}
        width={20}
        onClick={() => setIsMoreBtnClicked(!isMoreBtnClicked)}
      />
      {isMoreBtnClicked && (
        <ModalDiv id="modal" ref={modalRef}>
          <div id="delete" onClick={deleteSubmit}>
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
          <div
            onClick={() => {
              setIsGoalModalOpen(true);
              setIsMoreBtnClicked(false);
            }}
          >
            내 달력에 추가
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
      />
      <CopySubGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        calendarId={calendarId}
        id={subGoalId}
      />
    </>
  );
}
