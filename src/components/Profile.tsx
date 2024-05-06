import axios from "axios";
import { useEffect, useState } from "react";
import { getUserInfo } from "api/users";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 20px 0px;
`;

const ProfileImg = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: black;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export default function Profile() {
  const defaultIntroduction = "프로필에 자기소개를 입력해보세요";
  const { data } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => await getUserInfo(),
  });

  return (
    <Wrapper>
      {data?.image === null && <ProfileImg />}
      <UserInfo>
        <span>{data?.name}</span>
        <span>{data?.introduction || defaultIntroduction}</span>
      </UserInfo>
    </Wrapper>
  );
}
