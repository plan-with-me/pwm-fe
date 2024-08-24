import { UserInfo, getUserInfo } from "api/users";
import Center from "components/diary/Center";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import Write from "components/diary/Write";
import { getDiaries } from "api/diary";
import { useEffect } from "react";

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

export default function Diary() {
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  const { data: diaries } = useQuery({
    queryKey: ["diaries", userInfo?.id],
    queryFn: async () => await getDiaries(userInfo?.id || 0),
  });

  useEffect(() => {
    console.log(diaries);
  }, [diaries]);

  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center userInfo={userInfo!} />
          <Write />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
