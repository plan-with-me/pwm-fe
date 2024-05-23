import api from "./config";
import { SubGoals } from "./goals";

export async function createSubGoals(
  name: string,
  plan_datetime: Date,
  status: string,
  calendar_id: number,
  top_goal_id: number,
  refetch: () => void
) {
  api
    .post(
      `/calendars/${calendar_id}/sub-goals`,
      {
        name,
        plan_datetime,
        status,
      },
      { params: { calendar_id, top_goal_id } }
    )
    .then(() => {
      refetch();
    });
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

export async function updateSubGoals({
  calendar_id,
  sub_goal_id,
  name,
  color,
  status,
  show_scope,
  refetch,
}: {
  calendar_id: number;
  sub_goal_id: number;
  name: string;
  color?: string;
  status: string;
  show_scope?: string;
  refetch: () => void;
}) {
  await api
    .put(`/calendars/${calendar_id}/sub-goals/${sub_goal_id}`, {
      name,
      color,
      status,
      show_scope,
    })
    .then((response) => {
      refetch();
      console.log(response.data);
    })
    .catch((error) => console.log(error));
}

export async function deleteSubGoals(
  calendar_id: number,
  sub_goal_id: number,
  refetch: () => void
) {
  api
    .delete(`/calendars/${calendar_id}/sub-goals/${sub_goal_id}`, {
      params: { calendar_id, sub_goal_id },
    })
    .then(() => refetch());
}

export async function createTopGoals(
  calendar_id: number,
  name: string,
  color: string,
  status: string,
  show_scope: string
) {
  api
    .post(
      `/calendars/${calendar_id}/top-goals`,
      { name, color, status, show_scope },
      { params: { calendar_id } }
    )
    .then();
}

export async function getTopGoals(calendar_id: number) {
  return api.get(`/calendars/${calendar_id}/top-goals`).then((response) => {
    return response.data;
  });
}

export async function updateTopGoals(
  calendar_id: number,
  top_goal_id: number,
  name: string,
  color: string,
  status: string,
  show_scope: string
) {
  api
    .put(
      `/calendars/${calendar_id}/top-goals/${top_goal_id}`,
      { name, color, status, show_scope },
      { params: { calendar_id, top_goal_id } }
    )
    .then();
}

export default function deleteTopGoals(
  calendar_id: number,
  top_goal_id: number
) {
  api.delete(`/calendars/${calendar_id}/top-goals/${top_goal_id}`, {
    params: { calendar_id, top_goal_id },
  });
}
