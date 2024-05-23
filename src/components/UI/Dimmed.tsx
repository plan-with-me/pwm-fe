import styled from "styled-components";

const Div = styled.div<{ $isVisible: boolean }>`
  width: 100dvw;
  height: 100dvh;
  background-color: #222222;
  position: fixed;
  z-index: 10;
  cursor: pointer;
  opacity: ${(props) => (props.$isVisible ? 0.7 : 0)};
  animation: ${(props) => (props.$isVisible ? "fadeIn" : "fadeOut")} 300ms
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

export default function Dimmed({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) {
  return <Div $isVisible={isVisible} onClick={onClick} />;
}
