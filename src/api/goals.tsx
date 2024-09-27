import api from "./config";

export type Reaction = {
  type: string;
  content: string;
  count: number;
};

export type TopGoals = {
  id: number;
  name: string;
  color: string;
  status: string;
  show_scope: string;
  tags: string[];
};

export type SubGoals = {
  id: number;
  top_goal_id: number;
  name: string;
  plan_datetime: string;
  status: string;
  reactions: Reaction[];
};

export type Achievement = {
  id: number;
  name: string;
  color: string;
  sub_goal_count: number;
  complete_count: number;
};

export async function getTopGoals() {
  return await api
    .get("/top-goals")
    .then((response: { data: TopGoals[] }) => response.data);
}

export async function getTopGoalsById(userId: number) {
  return await api
    .get(`/top-goals?user_id=${userId}`)
    .then((response: { data: TopGoals[] }) => response.data);
}

export async function createTopGoals(
  name: string,
  color: string,
  status: string,
  show_scope: string,
  tags: string[]
) {
  try {
    const response = await api.post("/top-goals", {
      name,
      color,
      status,
      show_scope,
      tags,
    });
    return response.data;
  } catch (error) {
    console.error("Error while creating top goal:", error);
    throw error;
  }
}

export async function updateTopGoals(
  goalId: number,
  updatedGoalData: Partial<TopGoals>
) {
  try {
    const response = await api.put(`/top-goals/${goalId}`, updatedGoalData);
    return response.data;
  } catch (error) {
    console.error("Error while updating top goal:", error);
    throw error;
  }
}

export async function deleteTopGoals(goalId: number) {
  try {
    const response = await api.delete(`/top-goals/${goalId}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting top goal:", error);
    throw error;
  }
}

export async function getSubGoals({
  user_id,
  plan_date,
}: {
  user_id?: number;
  plan_date?: string;
}) {
  return await api
    .get("/sub-goals", { params: { user_id, plan_date } })
    .then((response: { data: SubGoals[] }) => response.data);
}

export async function getSubGoalsById({
  user_id,
  plan_date,
}: {
  user_id?: number;
  plan_date?: string;
}) {
  return await api
    .get(`/sub-goals`, { params: { user_id, plan_date } })
    .then((response: { data: SubGoals[] }) => response.data);
}

export async function createSubGoals(
  name: string,
  plan_datetime: Date,
  status: string,
  top_goal_id: number
) {
  try {
    await api.post(
      "/sub-goals",
      { name, plan_datetime, status },
      { params: { top_goal_id } }
    );

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteSubGoals(sub_goal_id: number) {
  try {
    await api.delete(`/sub-goals/${sub_goal_id}`);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function updateSubGoals(
  sub_goal_id: number,
  name: string,
  plan_datetime: Date,
  status: string
) {
  try {
    await api.put(`/sub-goals/${sub_goal_id}`, { name, plan_datetime, status });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getAchievementRates(userId?: number) {
  return await api
    .get("/top-goals/achievement-rates", { params: { userId } })
    .then((response: { data: Achievement[] }) => response.data);
}
