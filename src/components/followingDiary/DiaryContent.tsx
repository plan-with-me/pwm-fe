import { Diary, getDiaries } from "api/diary";
import styled from "styled-components";
import parse from "html-react-parser";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { useQuery } from "@tanstack/react-query";
import getDateFormat from "utils/getDateFormat";

const Wrapper = styled.div`
  width: 400px;
  height: calc(100dvh - 189px);
  margin: 40px 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 1240px) {
    margin-top: 85px;
  }

  @media (max-width: 880px) {
    margin-top: 40px;
  }

  @media (max-width: 440px) {
    width: calc(100% - 40px);
  }

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

  .title {
    font-size: 20px;
  }

  .btn {
    display: flex;
    gap: 8px;
  }

  textarea {
    width: 100%;
    height: 500px;
    resize: none;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export default function DiaryContent({ userId }: { userId: number }) {
  const calendarDate = useRecoilValue(CalendarDateAtom);

  const { data: diary } = useQuery<Diary[]>({
    queryKey: [
      "following_diary",
      userId,
      getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date),
    ],
    queryFn: async () =>
      await getDiaries(
        userId,
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
    enabled: !!userId,
  });

  return (
    <>
      {diary && diary?.length > 0 ? (
        <Wrapper>
          <div className="date-weather">
            <span>
              {calendarDate.year}년 {calendarDate.month}월 {calendarDate.date}일
            </span>
            <div className="weather">
              <img src={diary[0].icon} alt="" width={36} />
            </div>
          </div>
          <div className="title">{diary[0].title}</div>
          <div className="content">
            {diary[0].content.content && parse(diary[0].content.content)}
          </div>
        </Wrapper>
      ) : (
        <Wrapper>
          <div className="date-weather">
            <span>
              {calendarDate.year}년 {calendarDate.month}월 {calendarDate.date}일
            </span>
          </div>
          <Content>
            <div>아직 일기를 작성하지 않았어요</div>
          </Content>
        </Wrapper>
      )}
    </>
  );
}
