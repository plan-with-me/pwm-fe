import { deleteCalendarUser } from "api/calendar";
import { UserInfo, getUserInfo } from "api/users";
import more from "assets/more.svg";
import useClickOutside from "hooks/useClickOutside";
import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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
  left: 410px;
  top: 20px;
  background-color: white;
  z-index: 1;
  border-radius: 8px;
  border: 1px solid hsla(220, 9%, 46%, 0.3);
  div {
    padding: 8px 16px;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
  }
  #grant {
    border-top: 1px solid hsla(220, 9%, 46%, 0.3);
  }
`;
export default function SettingModal({
  calendarId,
  userId,
  name,
}: {
  calendarId: number;
  userId: number;
  name: string;
}) {
  const [isMoreBtnClicked, setIsMoreBtnClicked] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  useClickOutside(modalRef, () => setIsMoreBtnClicked(false));
  const navigate = useNavigate();

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  const deleteHandler = async (calendarId: number, userId: number) => {
    const result = await deleteCalendarUser(calendarId, userId);

    if (result.status === 200) {
      if (userId === userInfo?.id) {
        alert("달력에서 성공적으로 탈퇴했습니다.");
        navigate("/home");
      } else {
        alert(`${name} 유저를 내보냈습니다.`);
        window.location.reload();
      }
    } else {
      alert(`에러가 발생했습니다.`);
    }
  };

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
            onClick={async () => deleteHandler(calendarId, userId)}
          >
            {userId === userInfo?.id ? "나가기" : "내보내기"}
          </div>
          {userId !== userInfo?.id && <div id="grant">관리자 권한 주기</div>}
        </Modal>
      )}
    </>
  );
}
