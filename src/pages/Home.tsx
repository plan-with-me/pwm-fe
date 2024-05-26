import { UserInfo, getUserInfo } from "api/users";
import Center from "components/Center";
import Goals from "components/userCalendar/Goals";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

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

export default function Home() {
  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          <Center userInfo={userInfo!} />
          <Goals />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
