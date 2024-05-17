import Center from "components/Center";
import Goals from "components/Goals";
import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import styled from "styled-components";

const Wrapper = styled.div`
  /* width: 100%; */
  width: fit-content;
  margin: 0 auto;
  display: flex;
  /* border: 1px solid black; */
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
  return (
    <>
      <Wrapper>
        <SideBar />
        <TodoWrapper>
          <Center />
          <Goals />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
