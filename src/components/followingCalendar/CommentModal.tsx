import { postReaction, ReactionType } from "api/reaction";
import { useEffect, useState } from "react";
import Modal from "react-modal";
import styled from "styled-components";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
  subGoalId: number;
}

const Comment = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  overflow-y: hidden;
`;

const EmojiContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  width: 100%;
  max-height: 280px;
  overflow-y: auto;
`;

const Emoji = styled.span`
  font-size: 30px;
  padding: 4px;
  text-align: center;
  cursor: pointer;
`;

const emojiRange1 = Array.from({ length: 56 }, (_, i) => 128512 + i); // 128512 ~ 128567
const emojiRange2 = Array.from({ length: 19 }, (_, i) => 128568 + i); // 128568 ~ 128586
const emojiList = [...emojiRange1, ...emojiRange2];

export default function CommentModal({
  isOpen,
  onClose,
  subGoalId,
}: CommentModalProps) {
  const getCustomModalStyle = () => ({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 10,
    },
    content: {
      width: window.innerWidth <= 360 ? "100%" : "360px",
      height: "360px",
      margin: "0 auto",
      padding: "0",
      border: "none",
      top: "calc(100dvh - 360px)",
      left: 0,
      right: 0,
      backgroundColor: "white",
      display: "flex",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
    },
  });

  const [modalStyle, setModalStyle] = useState(getCustomModalStyle());

  useEffect(() => {
    const handleResize = () => {
      setModalStyle(getCustomModalStyle());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function submitEmoji(codePoint: number) {
    const response = await postReaction(
      subGoalId,
      ReactionType.EMOTICON,
      String.fromCodePoint(codePoint)
    );
    console.log(response);

    onClose();
  }

  return (
    <>
      <Modal isOpen={isOpen} style={modalStyle} onRequestClose={onClose}>
        <Comment>
          <EmojiContainer>
            {emojiList.map((codePoint, index) => (
              <Emoji
                key={index}
                onClick={async () => await submitEmoji(codePoint)}
              >
                {String.fromCodePoint(codePoint)}
              </Emoji>
            ))}
          </EmojiContainer>
        </Comment>
      </Modal>
    </>
  );
}
