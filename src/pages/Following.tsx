import { UserInfo, getUserInfoById } from "api/users";
import Center from "components/Center";
import FollowingGoals from "components/FollowingGoals";
import Navbar from "components/Navbar";
import Sidebar from "components/sidebar/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import { SubGoals } from "api/goals";
import { useRecoilValue } from "recoil";
import { CalendarDateAtom } from "store/CalendarDateAtom";

const Wrapper = styled.div`
  width: fit-content;
  margin: 0 auto;
  display: flex;
  @media (max-width: 440px) {
    width: 100%;
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

export default function Following() {
  const { id } = useParams<{ id: string }>();

  const calendarDate = useRecoilValue(CalendarDateAtom);

  const { data: userInfo } = useQuery<UserInfo>({
    queryKey: ['userInfo', Number(id)],
    queryFn: async () => await getUserInfoById(Number(id)), 
  });
  

  const { data: subGoals } = useQuery<SubGoals[]>({
    queryKey: ['subGoals', calendarDate.year, calendarDate.month],
  });
  console.log(subGoals, '123')
  return (
    <>
      <Wrapper>
        <Sidebar />
        <TodoWrapper>
          {userInfo && (
            <Center userInfo={userInfo} subGoals={subGoals} />
          )}
          <FollowingGoals />
        </TodoWrapper>
      </Wrapper>
      <Navbar />
    </>
  );
}
