import React, { useEffect, useState } from "react";
import { getUserInfo, UserInfo } from "../../api/users"; // api.tsx에서 가져온 함수와 타입을 가져옵니다.
import { getTopGoals, TopGoals } from "../../api/goals"; // goals.tsx에서 가져온 함수와 타입을 가져옵니다.
import { Link, useNavigate } from "react-router-dom";

export default function TGoals() {
  const [userId, setUserId] = useState<number | null>(null); // 사용자 ID를 상태로 관리합니다.
  const [topGoals, setTopGoals] = useState<TopGoals[]>([]); // 최상위 목표를 상태로 관리합니다.
  const navigate = useNavigate();

  useEffect(() => {
    getUserInfo().then((userInfo: UserInfo) => {
      setUserId(userInfo.id);
      console.log(userInfo.id) 
    });

    getTopGoals().then((data) => {
      setTopGoals(data);
      console.log(data) 
    });
  }, []);

  const handleCreateTGoals = () => {
    if (userId) {
      navigate(`/create-tgoal`);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <a href="/home"><button>{"<"}</button></a>
        <h2 style={{ margin: "0 10px" }}>목표</h2>
        <button onClick={handleCreateTGoals}>{"+"}</button>
      </div>
      <div>
        <h2>일반</h2>
        <ul>
          {topGoals.map((goal, index) => (
            <li key={index}>
              <Link to={`/update-tgoal/${goal.id}`}>{goal.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );  
}
