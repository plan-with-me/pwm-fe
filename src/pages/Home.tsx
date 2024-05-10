import Center from "components/Center";
import Goals from "components/Goals";
import SideBar from "components/SideBar";
import styled from "styled-components";

const Wrapper = styled.div`
  /* width: 100%; */
  width: fit-content;
  margin: 0 auto;
  display: flex;
`;

const SidebarWrapper = styled.div`
  @media (max-width: 1240px) {
    display: none;
  }
`;

const TodoWrapper = styled.div`
  display: flex;
  @media (max-width: 880px) {
    display: flex;
    flex-direction: column;
  }
`;

export default function Home() {
  return (
    <Wrapper>
      <SidebarWrapper>
        <SideBar />
      </SidebarWrapper>
      <TodoWrapper>
        <Center />
        <Goals />
      </TodoWrapper>
    </Wrapper>
  );
}
