import { postReaction, ReactionType } from "api/reaction";
import { FormEvent, useEffect, useState } from "react";
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

const TextForm = styled.form`
  display: flex;
  justify-content: center;
  input {
    width: 240px;
    height: 22px;
    border-radius: 24px;
    border: 1px solid #dcdcdc;
    padding: 8px;
  }
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
      height: "400px",
      margin: "0 auto",
      padding: "0",
      border: "none",
      top: "calc(100dvh - 400px)",
      left: 0,
      right: 0,
      backgroundColor: "white",
      display: "flex",
      borderTopLeftRadius: "20px",
      borderTopRightRadius: "20px",
    },
  });

  const [modalStyle, setModalStyle] = useState(getCustomModalStyle());
  const [comment, setComment] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setModalStyle(getCustomModalStyle());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const submitText = comment.trim();

    if (submitText) {
      const response = await postReaction(
        subGoalId,
        ReactionType.COMMENT,
        submitText
      );
      console.log(response);

      onClose();
    }
  }

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
          <TextForm onSubmit={submitComment}>
            <input
              type="text"
              placeholder="메시지 보내기"
              onChange={(e) => setComment(e.target.value)}
              value={comment}
            />
          </TextForm>
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
