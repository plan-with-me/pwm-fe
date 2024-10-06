import Modal from "react-modal";
import right_arrow from "assets/angle-right-solid.svg";
import left_arrow from "assets/angle-left-solid.svg";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { updateSubGoals } from "api/goals";
import getDateFormat from "utils/getDateFormat";
import { useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  id: number;
  text: string;
  status: string;
}

const Wrapper = styled.div`
  width: 320px;
  height: 320px;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;
`;

const DateController = styled.div`
  #title {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }

  #controller {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      font-weight: 600;
    }
    div {
      display: flex;
      gap: 20px;
      img {
        cursor: pointer;
      }
    }
  }

  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;

const CalendarDate = styled.div`
  /* width: 400px; */
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  row-gap: 8px;
  justify-items: center;
`;

const Day = styled.div<{
  $bgColor?: string;
  $textColor?: string;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  span {
    background-color: ${(props) => props.$bgColor};
    font-size: 12px;
    color: ${(props) => props.$textColor};
    width: 20px;
    height: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }
`;

const DateForm = styled.form`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  input {
    width: 90%;
    height: 32px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
  }
`;

export default function CalendarModal({
  isOpen,
  onClose,
  date,
  id,
  text,
  status,
}: CalendarModalProps) {
  const getCustomModalStyle = () => ({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 10,
    },
    content: {
      width: window.innerWidth <= 360 ? "100%" : "360px",
      height: "360px",
      margin: "0 auto",
      padding: 0,
      border: "none",
      top: "calc(100dvh - 360px)",
      left: 0,
      right: 0,
      backgroundColor: "white",
      display: "flex",
      alignItems: "flex-end",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
    },
  });

  const [modalStyle, setModalStyle] = useState(getCustomModalStyle());

  useEffect(() => {
    const handleResize = () => {
      setModalStyle(getCustomModalStyle());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const today = new Date();
  const planDate = new Date(date);
  const originalCalendarDate = useRecoilValue(CalendarDateAtom);
  const queryClient = useQueryClient();

  const [calendarDate, setCalendarDate] = useState({
    year: planDate.getFullYear(),
    month: planDate.getMonth() + 1,
    date: planDate.getDate(),
  });

  // 해당 월의 첫 번째 날의 요일을 구합니다.
  const firstDayOfMonth = new Date(
    calendarDate.year,
    calendarDate.month - 1,
    1
  ).getDay();

  // 해당 월의 마지막 날짜를 구합니다.
  const lastDateOfMonth = new Date(
    calendarDate.year,
    calendarDate.month,
    0
  ).getDate();

  // 이전 달로 이동하는 함수
  const goToPreviousMonth = () => {
    if (calendarDate.month === 1) {
      setCalendarDate({
        ...calendarDate,
        year: calendarDate.year - 1,
        month: 12,
      });
    } else {
      setCalendarDate({ ...calendarDate, month: calendarDate.month - 1 });
    }
  };

  // 다음 달로 이동하는 함수
  const goToNextMonth = () => {
    if (calendarDate.month === 12) {
      setCalendarDate({
        ...calendarDate,
        year: calendarDate.year + 1,
        month: 1,
      });
    } else {
      setCalendarDate({ ...calendarDate, month: calendarDate.month + 1 });
    }
  };

  const changeDateHandler = async () => {
    const response = await updateSubGoals(
      id,
      text,
      new Date(
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
      status
    );

    response &&
      queryClient.invalidateQueries({
        queryKey: [
          "subGoals",
          originalCalendarDate.year,
          originalCalendarDate.month,
        ],
      });

    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        style={modalStyle}
        onRequestClose={onClose}
      >
        <Wrapper>
          <DateController>
            <div id="title">날짜 바꾸기</div>
            <div id="controller">
              <span>
                {calendarDate.year}년 {calendarDate.month}월
              </span>
              <div>
                <img src={left_arrow} onClick={goToPreviousMonth} width={12} />
                <img src={right_arrow} onClick={goToNextMonth} width={12} />
              </div>
            </div>
          </DateController>
          <CalendarDate>
            <span>일</span>
            <span>월</span>
            <span>화</span>
            <span>수</span>
            <span>목</span>
            <span>금</span>
            <span>토</span>
            {[
              ...Array(firstDayOfMonth).fill(null),
              ...Array(lastDateOfMonth)
                .fill(null)
                .map((_, index) => index + 1),
            ].map((date, index) => (
              <Day
                key={index}
                $bgColor={
                  date === calendarDate.date
                    ? "black"
                    : date === today.getDate() &&
                      calendarDate.month === today.getMonth() + 1 &&
                      calendarDate.year === today.getFullYear()
                    ? "lightgrey"
                    : ""
                }
                $textColor={date === calendarDate.date ? "white" : ""}
              >
                <span
                  onClick={() => {
                    setCalendarDate({ ...calendarDate, date });
                  }}
                >
                  {date}
                </span>
              </Day>
            ))}
          </CalendarDate>
          <DateForm>
            <input type="button" value="확인" onClick={changeDateHandler} />
          </DateForm>
        </Wrapper>
      </Modal>
    </>
  );
}
