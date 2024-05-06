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
export default function Home() {
  return (
    <Wrapper>
      <SideBar />
      <Center />
      <Goals />
    </Wrapper>
  );
}
