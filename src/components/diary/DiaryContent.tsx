import deleteDiary, { Diary, getDiaries } from "api/diary";
import styled from "styled-components";
import parse from "html-react-parser";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import getDateFormat from "utils/getDateFormat";
import { getUserInfo, UserInfo } from "api/users";
import { useNavigate } from "react-router-dom";

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

const Button = styled.button`
  background-color: black;
  color: white;
  border: none;
  padding: 4px 8px;
  width: fit-content;
  height: 28px;
  cursor: pointer;
  border-radius: 4px;
`;

export default function DiaryContent() {
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  const { data: diary } = useQuery<Diary[]>({
    queryKey: [
      "diary",
      userInfo?.id,
      getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date),
    ],
    queryFn: async () =>
      await getDiaries(
        userInfo?.id || 0,
        getDateFormat(calendarDate.year, calendarDate.month, calendarDate.date)
      ),
  });

  function confirmAndDeleteDiary(diary: Diary[]) {
    return async () => {
      if (confirm("일기를 삭제할까요??")) {
        const response = await deleteDiary(diary[0].id);
        if (response) {
          alert("일기를 삭제했습니다.");
          queryClient.invalidateQueries({ queryKey: ["diary"] });
        } else {
          alert("에러가 발생했습니다. 다시 시도해주세요.");
        }
      }
    };
  }

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
          <div className="btn">
            <Button onClick={() => navigate(`edit/${diary[0].id}`)}>
              수정하기
            </Button>
            <Button onClick={confirmAndDeleteDiary(diary)}>삭제하기</Button>
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
            <Button onClick={() => navigate("write")}>일기 작성하기</Button>
          </Content>
        </Wrapper>
      )}
    </>
  );
}
