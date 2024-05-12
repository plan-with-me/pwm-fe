import api from "./config";


export type TopGoals = {
  id: number;
  name: string;
  color: string;
  status: string;
  show_scope: string;
  created_at: string;
  updated_at: string;
  user_id: number;
};

export type SubGoals = {
  id: number;
  created_at: string;
  updated_at: string;
  top_goal_id: number;
  name: string;
  plan_datetime: string;
  status: string;
};

export async function getTopGoals() {
  return await api
    .get("/top-goals")
    .then((response: { data: TopGoals[] }) => response.data);
}

export async function createTopGoals(newGoalData: TopGoals) {
  try {
    const response = await api.post("/top-goals", newGoalData);
    return response.data;
  } catch (error) {
    console.error("Error while creating top goal:", error);
    throw error;
  }
}

export async function updateTopGoals(goalId: number, updatedGoalData: Partial<TopGoals>) {
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

export async function getSubGoals() {
  return await api
    .get("/sub-goals")
    .then((response: { data: SubGoals[] }) => response.data);
}

export async function postSubGoals(
  name: string,
  plan_datetime: Date,
  status: string,
  top_goal_id: number,
  refetch: () => void
) {
  api
    .post(
      "/sub-goals",
      { name, plan_datetime, status },
      { params: { top_goal_id } }
    )
    .then(() => {
      refetch();
    });
}
export async function deleteSubGoal(subGoalId: number, refetch: () => void) {
  api.delete(`/sub-goals/${subGoalId}`).then(() => refetch());
}

export async function updateSubGoal(
  subGoalId: number,
  name: string,
  plan_datetime: Date,
  status: string,
  refetch: () => void
) {
  api
    .put(`/sub-goals/${subGoalId}`, { name, plan_datetime, status })
    .then(() => {
      // console.log(response.data);
      refetch();
    });
}
