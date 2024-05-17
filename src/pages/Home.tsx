import Center from "components/Center";
import Goals from "components/Goals";
import Navbar from "components/Navbar";
import SideBar from "components/SideBar";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
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
    z-index: 20;
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

const Dimmed = styled.div<{ isVisible: boolean }>`
  width: 100dvw;
  height: 100dvh;
  background-color: #222222;
  position: fixed;
  z-index: 10;
  cursor: pointer;
  opacity: ${(props) => (props.isVisible ? 0.7 : 0)};
  animation: ${(props) => (props.isVisible ? "fadeIn" : "fadeOut")} 300ms
    ease-out;

  @media (min-width: 1240px) {
    width: 0;
    height: 0;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 0.7;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 0.7;
    }
    to {
      opacity: 0;
    }
  }
`;

export default function Home() {
  const [xPosition, setX] = useRecoilState(SideBarAtom);
  const [isDimmedRenderd, setIsDimmedRendered] = useState(false);

  useEffect(() => {
    if (xPosition > 0) {
      setIsDimmedRendered(true);
    } else {
      setTimeout(() => setIsDimmedRendered(false), 300);
    }
  }, [xPosition]);

  return (
    <>
      <Wrapper>
        <SidebarWrapper xPosition={xPosition}>
          <SideBar />
        </SidebarWrapper>
        <TodoWrapper>
          <Center />
          <Goals />
        </TodoWrapper>
        {isDimmedRenderd && (
          <Dimmed isVisible={xPosition > 0} onClick={() => setX(-xPosition)} />
        )}
      </Wrapper>
      <Navbar />
    </>
  );
}
