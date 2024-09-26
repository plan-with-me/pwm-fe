import { Reaction } from "api/goals";
import styled from "styled-components";

const Emoji = styled.div`
  background-color: #d5d5d5;
  width: fit-content;
  margin-left: 28px;
  padding: 8px;
  border-radius: 4px;
  font-size: 20px;
  display: flex;
  align-items: center;

  .count {
    font-size: 16px;
  }
`;

export default function EmojiContainer({
  reactions,
}: {
  reactions: Reaction[];
}) {
  return (
    <>
      {reactions.length > 0 && (
        <Emoji>
          <span>{reactions.map((item) => item.content).slice(0, 5)}</span>
          <span className="count">
            {reactions.map((i) => i.count).reduce((a, b) => a + b, 0)}
          </span>
        </Emoji>
      )}
    </>
  );
}
