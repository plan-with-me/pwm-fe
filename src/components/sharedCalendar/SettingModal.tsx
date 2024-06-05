import { deleteCalendarUser } from "api/calendar";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import { useRef, useState } from "react";
import styled from "styled-components";

const MoreBtn = styled.div`
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    border-radius: 50%;
    background-color: #e5e5e5;
  }
`;

const Modal = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  right: -100px;
  top: 20px;
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
export default function SettingModal({
  calendarId,
  userId,
}: // text,
// status,
// refetch,
{
  calendarId: number;
  userId: number;
  // text?: string;
  // status?: string;
  // refetch?: () => void;
}) {
  const [isMoreBtnClicked, setIsMoreBtnClicked] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsMoreBtnClicked(false));

  return (
    <>
      <MoreBtn>
        <img
          src={more}
          width={20}
          onClick={() => setIsMoreBtnClicked(!isMoreBtnClicked)}
        />
      </MoreBtn>
      {isMoreBtnClicked && (
        <Modal id="modal" ref={modalRef}>
          <div
            id="delete"
            onClick={async () => await deleteCalendarUser(calendarId, userId)}
          >
            내보내기
          </div>
          <div>관리자 권한 주기</div>
        </Modal>
      )}
    </>
  );
}
