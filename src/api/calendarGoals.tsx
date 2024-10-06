import api from "./config";
import { SubGoals, TopGoals } from "./goals";

export async function createSubGoals(
  name: string,
  plan_datetime: Date,
  status: string,
  calendar_id: number,
  top_goal_id: number
) {
  try {
    await api.post(
      `/calendars/${calendar_id}/sub-goals`,
      {
        name,
        plan_datetime,
        status,
      },
      { params: { calendar_id, top_goal_id } }
    );

    return true;
  } catch (error) {
    console.log(error);

    return false;
  }
}

export async function getSubGoals({
  calendar_id,
  plan_date,
}: {
  calendar_id: number;
  plan_date?: string;
}) {
  return await api
    .get(`/calendars/${calendar_id}/sub-goals`, {
      params: { calendar_id, plan_date },
    })
    .then((response: { data: SubGoals[] }) => response.data);
}

export async function copySubGoal({
  calendar_id,
  sub_goal_id,
  my_top_goal_id,
}: {
  calendar_id: number;
  sub_goal_id: number;
  my_top_goal_id: number;
}) {
  try {
    await api.post(
      `/calendars/${calendar_id}/sub-goals/${sub_goal_id}?my_top_goal_id=${my_top_goal_id}`
    );

    return true;
  } catch {
    return false;
  }
}

export async function updateSubGoals({
  calendar_id,
  sub_goal_id,
  name,
  plan_datetime,
  status,
}: {
  calendar_id: number;
  sub_goal_id: number;
  name: string;
  plan_datetime: Date;
  status: string;
}) {
  try {
    await api.put(`/calendars/${calendar_id}/sub-goals/${sub_goal_id}`, {
      name,
      plan_datetime,
      status,
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function deleteSubGoals(calendar_id: number, sub_goal_id: number) {
  try {
    await api.delete(`/calendars/${calendar_id}/sub-goals/${sub_goal_id}`, {
      params: { calendar_id, sub_goal_id },
    });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createTopGoals(
  calendar_id: number,
  name: string,
  color: string,
  status: string,
  show_scope: string
) {
  await api
    .post(`/calendars/${calendar_id}/top-goals`, {
      name,
      color,
      status,
      show_scope,
    })
    .catch((error) => console.log(error));
}

export async function getTopGoals(calendar_id: number) {
  return await api
    .get(`/calendars/${calendar_id}/top-goals`)
    .then((response: { data: TopGoals[] }) => {
      return response.data;
    });
}

export async function updateTopGoals(
  calendar_id: number,
  top_goal_id: number,
  updatedGoalData: Partial<TopGoals>
) {
  await api
    .put(`/calendars/${calendar_id}/top-goals/${top_goal_id}`, updatedGoalData)
    .catch((error) => console.log(error));
}

export async function deleteTopGoals(calendar_id: number, top_goal_id: number) {
  await api
    .delete(`/calendars/${calendar_id}/top-goals/${top_goal_id}`, {
      params: { calendar_id, top_goal_id },
    })
    .catch((error) => console.log(error));
}
