import styled from "styled-components";
import Calendar from "./Calendar";
import Profile from "./Profile";
import bars from "assets/bars-solid.svg";
import logo from "assets/logo.png";
import { useRecoilState } from "recoil";
import { SideBarAtom } from "store/SideBarAtom";

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

  @media (max-width: 440px) {
    width: calc(100% - 40px);
  }
`;

const Logo = styled.div`
  display: flex;
  justify-content: space-between;
  span {
    width: 30px;
  }

  .bar {
    cursor: pointer;
  }
`;

export default function Center() {
  const [xPosition, setX] = useRecoilState(SideBarAtom);

  return (
    <>
      <Wrapper>
        <Logo>
          <img
            src={bars}
            width={30}
            alt=""
            className="bar"
            onClick={() => setX(-xPosition)}
          />
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
