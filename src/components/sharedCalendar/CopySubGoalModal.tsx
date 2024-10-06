import Modal from "react-modal";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { copySubGoal } from "api/calendarGoals";
import { useQuery } from "@tanstack/react-query";
import { getTopGoals, TopGoals } from "api/goals";
import CategoryTitle from "components/CategoryTitle";

interface CopySubGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendarId: number;
  id: number;
}

const Wrapper = styled.div`
  width: 320px;
  height: 320px;
  padding: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  background-color: white;

  #title {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
`;

const Category = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  overflow-y: auto;
`;

export default function CopySubGoalModal({
  isOpen,
  onClose,
  calendarId,
  id,
}: CopySubGoalModalProps) {
  const getCustomModalStyle = () => ({
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 10,
    },
    content: {
      width: window.innerWidth <= 360 ? "100%" : "360px",
      height: "360px",
      margin: "0 auto",
      padding: 0,
      border: "none",
      top: "calc(100dvh - 360px)",
      left: 0,
      right: 0,
      backgroundColor: "white",
      display: "flex",
      alignItems: "flex-end",
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

  const copyGoal = async (myCategoryId: number) => {
    await copySubGoal({
      calendar_id: calendarId,
      sub_goal_id: id,
      my_top_goal_id: myCategoryId,
    });

    onClose();
  };

  const { data: categories } = useQuery<TopGoals[]>({
    queryKey: ["myGoalList"],
    queryFn: async () => await getTopGoals(),
  });

  return (
    <>
      <Modal
        isOpen={isOpen}
        ariaHideApp={false}
        style={modalStyle}
        onRequestClose={onClose}
      >
        <Wrapper>
          <div id="title">내 달력의 목표 선택하기</div>
          {categories && (
            <Category>
              {categories.map(
                (category: TopGoals) =>
                  /* 종료한 목표 중 하위 목표가 있는 상위 목표만 표시 + 종료하지 않은 목표 표시 */
                  category.status === "incomplete" && (
                    <CategoryTitle
                      onClick={async () => await copyGoal(category.id)}
                      color={category.color}
                      name={category.name}
                      key={category.id}
                    />
                  )
              )}
            </Category>
          )}
        </Wrapper>
      </Modal>
    </>
  );
}
