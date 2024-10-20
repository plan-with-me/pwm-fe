import styled from "styled-components";
import logo from "assets/logo.png";
import defaultProfile from "assets/defaultProfile.png";
import api from "../api/config";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import left_arrow from "../assets/angle-left-solid.svg"; // 이미지 경로
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCalendar, updateCalendar } from "api/calendar";

const CalendarProfile = styled.div`
  @media (max-width: 700px) {
    width: 90%;
    #logo {
      width: 70%;
    }

    #input_name_div,
    #input_introduction_div {
      padding: 0 10px;
    }

    #span_name,
    #span_introduction {
      margin-right: 10px;
    }

    input {
      width: 100%;
    }
  }

  width: 700px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  #logo {
    max-width: 500px;
    min-width: 200px;
  }

  #input_div {
    width: 100%;
    height: 200px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 200px;
  }

  #input_name_div,
  #input_introduction_div {
    width: 100%;
    max-width: 500px;
    margin-top: 50px;
    padding: 0 20px;
    align-items: center;
  }

  #span_name {
    margin-right: 20px;
  }

  #span_introduction {
    margin-right: 25px;
  }
`;

const ConfirmButton = styled.button`
  padding: 10px 20px;
  background-color: transparent;
  color: black;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 20px;

  @media (max-width: 700px) {
    top: 20px;
    right: 10px;
  }
`;

const Button = styled(Link)`
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 10px, 10px;
  margin-top: 20px;
  margin-left: 20px;
`;

export default function Login() {
  const navigate = useNavigate();
  const { calendar_id } = useParams<{ calendar_id: string }>();
  const [name, setName] = useState("");
  const [introduction, setIntroduction] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const { data: calendarData } = useQuery({
    queryKey: ["calendar_profile", calendar_id],
    queryFn: () => getCalendar(Number(calendar_id)),
  });

  useEffect(() => {
    if (calendarData) {
      setName(calendarData.name);
      setIntroduction(calendarData.introduction);
      if (calendarData.image) {
        setPreviewImage(calendarData.image);
      } else {
        setPreviewImage(defaultProfile); // 기본 이미지 설정
      }
    }
  }, [calendarData]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setPreviewImage(reader.result as string); // 미리보기 이미지 업데이트
        }
      };
      reader.readAsDataURL(file); // 파일을 읽고 Base64 URL로 변환
    }
  };

  const handleConfirm = async () => {
    if (!name) {
      console.error("Missing calendar ID, name, or introduction.");
      return;
    }

    let imageUrl = null;
    if (profileImage) {
      const formData = new FormData();
      formData.append("file", profileImage);
      try {
        const response = await api.post("/files", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = response.data.client_location;
      } catch (err) {
        console.error(err);
        return;
      }
    }

    try {
      await updateCalendar({
        calendar_id: Number(calendar_id),
        name: name,
        introduction: introduction,
        image: imageUrl,
      });
      navigate("/home");
      alert("달력 정보가 성공적으로 업데이트되었습니다.");
    } catch (error) {
      console.error("Failed to update calendar:", error);
      alert("달력 정보를 업데이트하는 데 실패했습니다.");
    }
  };

  return (
    <div>
      <ConfirmButton onClick={handleConfirm}>확인</ConfirmButton>
      <Button to={`/calendar/${calendar_id}/setting`}>
        <img src={left_arrow} width={24} />
      </Button>
      <CalendarProfile>
        <img src={logo} width={400} id="logo" />

        <div id="input_div">
          <div id="input_photo_introduction_div">
            <label htmlFor="fileInput">
              <img
                src={previewImage || defaultProfile}
                alt="Select file"
                style={{ width: "100px", height: "auto" }}
              />
              <input
                id="fileInput"
                type="file"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </label>
          </div>

          <div id="input_name_div">
            <span id="span_name">달력 이름</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ borderStyle: "none", width: "80%" }}
            />
            <hr />
          </div>

          <div id="input_introduction_div">
            <span id="span_introduction">달력 소개</span>
            <input
              value={introduction || ""}
              onChange={(e) => setIntroduction(e.target.value)}
              style={{ borderStyle: "none", width: "80%" }}
            />
            <hr />
          </div>
        </div>
      </CalendarProfile>
    </div>
  );
}
