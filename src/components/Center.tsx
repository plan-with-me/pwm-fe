import styled from "styled-components";
import Calendar from "./Calendar";
import Profile from "./Profile";
import bars from "assets/bars-solid.svg";
import logo from "assets/logo.png";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 400px;
  height: fit-content;
  /* border: solid 1px black; */
  margin: 20px;
  img {
    display: none;
    @media (max-width: 1240px) {
      display: block;
    }
  }
`;

const Logo = styled.div`
  display: flex;
  /* justify-content: center; */
  justify-content: space-between;
  span {
    width: 30px;
  }
`;

export default function Center() {
  return (
    <>
      <Wrapper>
        <Logo>
          <img src={bars} width={30} alt="" />
          <span></span>
          <img src={logo} width={80} />
          <span></span>
          <span></span>
        </Logo>
        <Profile />
        <Calendar />
      </Wrapper>
    </>
  );
}
