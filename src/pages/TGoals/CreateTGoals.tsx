import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createTopGoals, TopGoals } from "../../api/goals";

export default function CreateTGoals() {
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [showScope, setShowScope] = useState(""); // show_scope 필드를 추가합니다.

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const now = new Date().toISOString();
      const userId = parseInt(window.location.pathname.split("/")[2]);

      const newTopGoalData: TopGoals = {
        id: 0,
        name,
        color,
        status: "incomplete",
        show_scope: showScope, // show_scope 필드 값을 추가합니다.
        created_at: now,
        updated_at: now,
        user_id: userId,
      };
      console.log(userId)

      await createTopGoals(newTopGoalData);

      navigate("/tgoal");
    } catch (error) {
      console.error("Error creating top goal:", error);
    }
  };

  const handleBack = () => {
    navigate("/tgoal");
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={handleBack}>{"<"}</button>
        <h2 style={{ margin: "0 10px" }}>목표 등록</h2>
        <form onSubmit={handleSubmit}>
          <button type="submit">완료</button>
        </form>
      </div>
      <form>
      <div>
        <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="목표"
        />
        </div>
        <div>
          <label>공개설정 : </label>
          <input
            type="text"
            value={showScope}
            onChange={(e) => setShowScope(e.target.value)}
          />
        </div>
        <div>
          <label>색상 : </label>
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
          />
        </div>        
      </form>
    </div>
  );
}
