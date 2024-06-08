import api from "./config";

export type CalendarInfo = {
  id: number;
  name: string;
  introduction: string | null;
  image: string | null;
};

export type CalendarUserInfo = {
  id: number;
  name: string;
  introduction: string;
  image: string;
  uid: string;
  is_admin: boolean;
};

export async function createCalendar({
  name,
  image,
  introduction,
}: {
  name: string;
  image?: string;
  introduction?: string;
}) {
  return await api
    .post("/calendars", { name, image, introduction })
    .then((response) => response.data);
}

export async function getCalendars({ user_id }: { user_id?: number }) {
  return await api
    .get("/calendars", { params: { user_id } })
    .then((response: { data: CalendarInfo[] }) => response.data);
}

export async function getCalendar(calendar_id: number) {
  return await api
    .get(`/calendars/${calendar_id}`)
    .then((response: { data: CalendarInfo }) => response.data);
}

export async function updateCalendar({
  calendar_id,
  name,
  introduction,
  image,
}: {
  calendar_id: number;
  name: string;
  introduction?: string;
  image?: string;
}) {
  await api
    .put(`/calendars/${calendar_id}`, { name, introduction, image })
    .then((response) => console.log(response.data));
}

export async function deleteCalendar(calendar_id: number) {
  await api
    .delete(`/calendars/${calendar_id}`)
    .then((response) => console.log(response.data));
}

export type Permission = {
  id: number;
  calendar_id: number;
  user_id: number;
  is_admin: boolean;
};

export async function getCalendarPermission(calendar_id: number) {
  return await api
    .get(`/calendars/${calendar_id}/permission`)
    .then((response: { data: Permission }) => {
      console.log(response.data);
      return response.data;
    });
}

export async function getCalendarUsers(calendar_id: number) {
  return await api
    .get(`/calendars/${calendar_id}/users`)
    .then((response: { data: CalendarUserInfo[] }) => {
      console.log(response.data);
      return response.data;
    });
}

export async function addCalendarUser(calendar_id: number, user_id: number) {
  await api.post(`/calendars/${calendar_id}/users/${user_id}`);
}

export async function updateCalendarPermission(
  calendar_id: number,
  user_id: number,
  admin?: boolean
) {
  return await api.put(
    `/calendars/${calendar_id}/users/${user_id}?admin=${admin}`
  );
}

export async function deleteCalendarUser(calendar_id: number, user_id: number) {
  return await api.delete(`/calendars/${calendar_id}/users/${user_id}`);
}
