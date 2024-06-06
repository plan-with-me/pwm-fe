import styled from "styled-components";

const Title = styled.div<{ $color: string }>`
  width: fit-content;
  background-color: #d5d5d5;
  font-size: 20px;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;

  div {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${(props) => props.$color || "black"};
  }
`;

export default function CategoryTitle({
  color,
  name,
  onClick,
}: {
  color: string;
  name: string;
  onClick?: () => void;
}) {
  return (
    <Title $color={color} onClick={onClick}>
      <div />
      <span>{name}</span>
    </Title>
  );
}
