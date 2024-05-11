import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTopGoals, updateTopGoals, deleteTopGoals, TopGoals } from "../../api/goals";

export default function UpdateTGoals() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [topGoal, setTopGoal] = useState<TopGoals | null>(null);
  const [name, setName] = useState("");
  const [color, setColor] = useState("");
  const [showScope, setShowScope] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchTopGoal() {
      try {
        const topGoalData = await getTopGoals();
        const goal = topGoalData.find(goal => goal.id === parseInt(id!));
        if (goal) {
          setTopGoal(goal);
          setName(goal.name);
          setColor(goal.color);
          setShowScope(goal.show_scope);
          setStatus(goal.status);
        } else {
          console.error("Top Goal not found");
        }
      } catch (error) {
        console.error("Error fetching top goal:", error);
      }
    }

    if (id) {
      fetchTopGoal();
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      const updatedGoalData: Partial<TopGoals> = {
        name,
        color,
        show_scope: showScope,
        status
      };
      if (id) {
        await updateTopGoals(parseInt(id), updatedGoalData);
        navigate("/tgoal");
      }
    } catch (error) {
      console.error("Error updating top goal:", error);
    }
  };

  const handleDelete = async () => {
    try {
      if (id) {
        await deleteTopGoals(parseInt(id));
        navigate("/tgoal");
      }
    } catch (error) {
      console.error("Error deleting top goal:", error);
    }
  };

  if (!topGoal) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <button onClick={() => navigate("/tgoal")}>{"<"}</button>
        <h2 style={{ margin: "0 10px" }}>목표</h2>
        <button onClick={handleUpdate}>확인</button>
      </div>
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
      <div>
        <label>상태 : </label>
        <input
          type="text"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>
      <button>종료하기</button>
      <button onClick={handleDelete}>삭제</button>
    </div>
  );  
}
