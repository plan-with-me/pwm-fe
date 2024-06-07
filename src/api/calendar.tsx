import api from "./config";
import { UserInfo } from "./users";

export type CalendarInfo = {
  id: number;
  name: string;
  introduction: string | null;
  image: string | null;
};

export type CalendarInfoDetail = CalendarInfo & {
  users: UserInfo[];
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

export async function getCalendarUsers(calendar_id: number) {
  return await api
    .get(`/calendars/${calendar_id}/users`)
    .then((response: { data: UserInfo[] }) => {
      console.log(response.data);
      return response.data;
    });
}

// 덜 적음
export async function addCalendarUser(calendar_id: number, user_id: number) {
  await api.post(`/calendars/${calendar_id}/users/${user_id}`);
}

export async function deleteCalendarUser(calendar_id: number, user_id: number) {
  return await api.delete(`/calendars/${calendar_id}/users/${user_id}`);
}
