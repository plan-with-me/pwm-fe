import styled from "styled-components";
import Navbar from "components/Navbar";
import SearchPage from "pages/Lounge/SearchPage";
import LoungePage from "pages/Lounge/LoungePage"
import logo from "assets/logo.png";
import { useState } from "react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px;
  margin-bottom : 120px;
`;

const ToggleButton = styled.button`
  margin-top: 20px;
  width: 100px;
  padding: 10px 20px;
  background-color: lightgray;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: gray;
    color: white;
  }
`;

export default function Lounge() {
  const [buttonText, setButtonText] = useState<string>("계정검색");
  const [showPage, setShowPage] = useState<boolean>(false);

  const handleToggleButtonClick = () => {
    setButtonText(prevText => (prevText === "계정검색" ? "라운지" : "계정검색"));
    setShowPage(prev => !prev);
  };

  return (
    <Wrapper>
      <img src={logo} width={80} alt="logo" />
      <ToggleButton onClick={handleToggleButtonClick}>
        {buttonText}
      </ToggleButton>
      {showPage ? <SearchPage /> : <LoungePage />}
      <Navbar />
    </Wrapper>
  );
}
