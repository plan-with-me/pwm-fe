import { Diary } from "api/diary";
import styled from "styled-components";
import parse from "html-react-parser";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";

const Wrapper = styled.div`
  width: 400px;
  height: calc(100dvh - 189px);
  margin: 40px 20px;

  @media (max-width: 1240px) {
    margin-top: 85px;
  }

  @media (max-width: 880px) {
    margin-top: 40px;
  }
  /* border: 1px solid black; */
  display: flex;

  flex-direction: column;
  gap: 20px;

  .date-weather {
    display: flex;

    align-items: center;
    gap: 8px;
    position: relative;
  }

  .weather {
    width: 16px;
    height: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px;
    cursor: pointer;

    &:hover {
      background-color: #d5d5d5;
      border-radius: 50%;
    }
  }

  textarea {
    width: 100%;
    height: 500px;
    resize: none;
  }
`;

export default function DiaryContent({ diary }: { diary: Diary }) {
  const calendarDate = useRecoilValue(CalendarDateAtom);

  console.log(diary.content.content);
  return (
    <Wrapper>
      <div className="date-weather">
        <span>
          {calendarDate.year}년 {calendarDate.month}월 {calendarDate.date}일
        </span>
        <div className="weather">
          <img src={diary.icon} alt="" width={36} />
        </div>
      </div>
      <div>{diary.title}</div>
      <div>{diary.content.content && parse(diary.content.content)}</div>
      <div>
        <button>수정하기</button>
        <button>삭제하기</button>
      </div>
    </Wrapper>
  );
}
