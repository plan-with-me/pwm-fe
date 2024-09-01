import { UserInfo, getUserInfo } from "api/users";
import Center from "components/diary/Center";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Write from "components/diary/Write";
import DiaryContent from "components/diary/DiaryContent";
import { useLocation } from "react-router-dom";
import Edit from "components/diary/Edit";

const Wrapper = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: flex;
  @media (max-width: 440px) {
    width: 100%;
  }
`;

const TodoWrapper = styled.div`
  display: flex;
  height: calc(100dvh - 84px);

  @media (max-width: 880px) {
    overflow-y: auto;
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 440px) {
    width: 100%;
  }
`;

export default function DiaryPage() {
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  const location = useLocation();
  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center userInfo={userInfo!} />
          {location.pathname === "/diary/write" && <Write />}
          {location.pathname.startsWith("/diary/edit") && <Edit />}
          {location.pathname === "/diary" && <DiaryContent />}
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
