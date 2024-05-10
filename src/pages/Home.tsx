import Center from "components/Center";
import Goals from "components/Goals";
import SideBar from "components/SideBar";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { SideBarAtom } from "store/SideBarAtom";
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

const SidebarWrapper = styled.div<{ xPosition: number }>`
  @media (max-width: 1240px) {
    position: fixed;
    left: -360px;
    transform: translatex(${(props) => props.xPosition}px);
    transition-duration: 300ms;
  }
`;

const TodoWrapper = styled.div`
  display: flex;
  @media (max-width: 880px) {
    display: flex;
    flex-direction: column;
  }
  @media (max-width: 440px) {
    width: 100%;
  }
`;

export default function Home() {
  const [xPosition, setX] = useState(360);
  const isClicked = useRecoilValue(SideBarAtom);

  useEffect(() => {
    if (isClicked) {
      setX(360);
    } else {
      setX(0);
    }
  }, [isClicked]);

  return (
    <Wrapper>
      <SidebarWrapper xPosition={xPosition}>
        <SideBar />
      </SidebarWrapper>
      <TodoWrapper>
        <Center />
        <Goals />
      </TodoWrapper>
    </Wrapper>
  );
}
