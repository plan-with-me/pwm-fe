import styled from "styled-components";
import Calendar from "./Calendar";

import Profile from "./Profile";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  margin: 20px;
`;

export default function Center() {
  return (
    <>
      <Wrapper>
        <Profile />
        <Calendar />
      </Wrapper>
    </>
  );
}
