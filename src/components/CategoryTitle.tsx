import styled from "styled-components";
import PinIcon from "./PinIcon";

const Title = styled.div`
  width: fit-content;
  background-color: #d5d5d5;
  font-size: 20px;
  padding: 4px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
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
    <Title onClick={onClick}>
      <PinIcon innerColor={color} />
      <span>{name}</span>
    </Title>
  );
}
