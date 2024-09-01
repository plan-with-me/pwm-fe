import { useEffect, useRef, useState } from "react";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";
import styled from "styled-components";
import { weatherIcons } from "assets/weather";
import useClickOutside from "hooks/useClickOutside";
import { Diary, editDiary, getDiaries } from "api/diary";
import { Editor } from "@tinymce/tinymce-react";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo, UserInfo } from "api/users";
import { useQuery } from "@tanstack/react-query";
import getDateFormat from "utils/getDateFormat";

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
    /* justify-content: center; */
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

const WeatherPalette = styled.div`
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 4px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: repeat(5, 1fr);
  gap: 8px;
  position: absolute;
  top: 0px;
  /* left: 100px; */
  right: 60px;
`;

export default function Edit() {
  const calendarDate = useRecoilValue(CalendarDateAtom);
  const [weather, setWeather] = useState(weatherIcons[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState("me");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const params = useParams();

  const divRef = useRef<HTMLDivElement>(null);
  useClickOutside(divRef, () => setIsOpen(false));

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

  async function submitDiary() {
    const diaryTitle = title.trim();
    const diaryContent = value.trim();

    if (diaryTitle !== "" && diaryContent !== "") {
      const response = await editDiary({
        id: Number(params.diaryId),
        title: diaryTitle,
        icon: weather,
        content: { content: diaryContent },
        show_scope: scope,
      });
      if (response) {
        alert("일기 수정이 완료됐습니다.");
        navigate("/diary");
      } else {
        alert("에러가 발생했습니다. 다시 시도해 주세요.");
      }
    } else {
      alert("제목 또는 내용을 작성해주세요.");
    }
  }

  // const editorRef = useRef(null);
  // const log = () => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // };

  useEffect(() => {
    if (diary) {
      for (const item of diary) {
        if (item.id === Number(params.diaryId)) {
          setTitle(item.title);
          setValue(item.content.content);
          setWeather(item.icon);
          setScope(item.show_scope);
          break;
        }
      }
    }
  }, [diary, params.diaryId]);

  return (
    <>
      <Wrapper>
        <div className="date-weather">
          <span>
            {calendarDate.year}년 {calendarDate.month}월 {calendarDate.date}일
          </span>
          <div className="weather" onClick={() => setIsOpen(!isOpen)}>
            <img src={weather} alt="" width={36} />
          </div>

          {isOpen && (
            <WeatherPalette ref={divRef}>
              {weatherIcons.map((icon, index) => (
                <div
                  className="weather"
                  key={index}
                  onClick={() => {
                    setWeather(icon);
                    setIsOpen(false);
                  }}
                >
                  <img src={icon} alt={`weather${index + 1}`} width={36} />
                </div>
              ))}
            </WeatherPalette>
          )}
          <select
            id="scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="me">나만 보기</option>
            <option value="followers">팔로워 공개</option>
            <option value="all">전체 공개</option>
          </select>
          <button onClick={submitDiary}>저장하기</button>
        </div>
        {/* <form>

        <textarea id="my"/>
        </form> */}
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        ></input>
        <Editor
          apiKey="9lyqudukb4ap7ihr8rscq5akbbprml6rjtua8bzqap3wo54s"
          // onInit={(_evt, editor) => (editorRef.current = editor)}
          value={value}
          onEditorChange={(newValue) => {
            setValue(newValue);
            // setText(editor.getContent({format: 'text'}));
          }}
          // onChange={(e) => setContent(e.target.value)}
          init={{
            height: 500,
            menubar: true,
            plugins: [
              "advlist",
              "autolink",
              "lists",
              "link",
              "image",
              "charmap",
              "preview",
              "anchor",
              "searchreplace",
              "visualblocks",
              "code",
              "fullscreen",
              "insertdatetime",
              "media",
              "table",
              "code",
              "help",
              "wordcount",
            ],
            toolbar:
              "undo redo | blocks | " +
              "bold italic forecolor | alignleft aligncenter " +
              "alignright alignjustify | bullist numlist outdent indent | " +
              "removeformat | help",
            content_style:
              "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          }}
        />
      </Wrapper>
    </>
  );
}
