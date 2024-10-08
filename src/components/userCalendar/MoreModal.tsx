import { deleteSubGoals } from "api/goals";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectedTodoAtom } from "store/SelectedTodoAtom";
import styled from "styled-components";
import CalendarModal from "./CalendarModal";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { useQueryClient } from "@tanstack/react-query";

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
  subGoalId,
  text,
  status,
  date,
}: {
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
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const queryClient = useQueryClient();

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
            onClick={async () => {
              const response = await deleteSubGoals(subGoalId);

              response &&
                queryClient.invalidateQueries({
                  queryKey: ["subGoals", calendarDate.year, calendarDate.month],
                });
            }}
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
      <CalendarModal
        isOpen={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
        date={date}
        id={subGoalId}
        text={text}
        status={status}
      />
    </>
  );
}
