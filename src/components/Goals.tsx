import { TopGoals, getTopGoals } from "api/goals";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 500px;
  /* height: 800px; */
  /* padding: 20px; */
  border: solid 1px black;
`;

export default function Goals() {
  return (
    <Wrapper></Wrapper>
  );
}
