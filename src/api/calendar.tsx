import api from "./config";
import { UserInfo } from "./users";

export type CalendarInfo = {
  id: number;
  name: string;
  image: string | null;
};

export type CalendarInfoDetail = CalendarInfo & {
  users: UserInfo[];
};

export async function createCalendar(
  name: string,
  image: string | null,
  user_ids: number[]
) {
  api.post("/calendars", { name, image, user_ids }).then((response) => {
    console.log(response.data);
  });
}

export async function getCalendars() {
  return api
    .get("/calendars")
    .then((response: { data: CalendarInfo[] }) => response.data);
}

export async function getCalendar(calendar_id: number) {
  return api
    .get(`/calendars/${calendar_id}`)
    .then((response: { data: CalendarInfoDetail }) => response.data);
}
