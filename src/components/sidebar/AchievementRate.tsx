import { Achievement, getAchievementRates } from "api/goals";
import { useQuery } from "@tanstack/react-query";
import styled, { keyframes } from "styled-components";
import CategoryTitle from "components/CategoryTitle";
import getPercent from "utils/getPercent";

const Category = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 20px;
  padding-bottom: 20px;
  border-top: 2px solid #d5d5d5;
  border-bottom: 2px solid #d5d5d5;
`;

const Row = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;

  #percent {
    color: ${(props) => props.$color};
    font-size: 20px;
    font-weight: 600;
  }
`;

const progressBarAnimation = (props: { $rate: number }) => keyframes`
  from {
    width: 0%;
  }
  to {
    width: ${props.$rate}%;
  }
`;

const ProgressBar = styled.div<{ $rate: number; $bgColor: string }>`
  width: 100%;
  height: 16px;
  background-color: #d5d5d5;
  border-radius: 12px;

  .progress_bar {
    width: ${(props) => props.$rate}%;
    height: 100%;
    background-color: ${(props) => props.$bgColor};
    border-radius: 12px;
    animation: ${(props) => progressBarAnimation(props)} 1s ease;
  }
`;

export default function AchievementRate() {
  const { data } = useQuery<Achievement[]>({
    queryKey: ["achievementRates"],
    queryFn: async () => await getAchievementRates(),
  });

  return (
    <Category>
      {data &&
        data.map((category: Achievement) => {
          const percent = getPercent(
            category.complete_count,
            category.sub_goal_count
          );

          return (
            <Row $color={category.color} key={category.id}>
              <CategoryTitle
                key={category.id}
                color={category.color}
                name={category.name}
              />
              <ProgressBar $rate={percent} $bgColor={category.color}>
                <div className="progress_bar" />
              </ProgressBar>
              <span id="percent">{percent}%</span>
            </Row>
          );
        })}
    </Category>
  );
}
