import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import users from "assets/users-solid.svg";
import { createCalendar } from "api/calendar";
import { useSetRecoilState } from "recoil";
import { AddBtnAtom } from "store/AddBtnAtom";
import { useNavigate } from "react-router-dom";
import { SideBarAtom } from "store/SideBarAtom";
import { useQueryClient } from "@tanstack/react-query";

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 16px;
  input {
    width: 100%;
    height: 20px;
    border: none;
    border-bottom: 2px solid black;
  }
`;

export default function CalendarForm() {
  const [calendarName, setCalendarName] = useState("");
  const setIsAddBtnClicked = useSetRecoilState(AddBtnAtom);
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const setX = useSetRecoilState(SideBarAtom);
  const queryClient = useQueryClient();

  const calendarSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const text = calendarName.trim();

    if (text) {
      const data = await createCalendar({ name: text });
      navigate(`/calendar/${data.id}`);
      setX(-360);
    }

    setIsAddBtnClicked(false);
    queryClient.invalidateQueries({ queryKey: ["myCalendarList"] });
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        setIsAddBtnClicked(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [formRef, setIsAddBtnClicked]);

  return (
    <Form ref={formRef} onSubmit={calendarSubmit}>
      <img src={users} alt="" width={40} />
      <input
        value={calendarName}
        onChange={(event) => {
          setCalendarName(event.target.value);
        }}
        placeholder="공유 달력 제목 입력"
        autoFocus={true}
      ></input>
    </Form>
  );
}
