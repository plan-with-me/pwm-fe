import { UserInfo, getUserInfoById } from "api/users";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import DiaryContent from "components/followingDiary/DiaryContent";
import Center from "components/followingDiary/Center";

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

export default function FollowingDiary() {
  const params = useParams<{ id: string }>();
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo", params.id],
    queryFn: async () => await getUserInfoById(Number(params.id)!),
  });

  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center userInfo={userInfo!} />
          <DiaryContent userId={Number(userInfo?.id)} />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
