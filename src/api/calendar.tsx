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
  return api
    .post("/calendars", { name, image, introduction })
    .then((response) => response.data);
}

export async function getCalendars({ user_id }: { user_id?: number }) {
  return api
    .get("/calendars", { params: { user_id } })
    .then((response: { data: CalendarInfo[] }) => response.data);
}

export async function getCalendar(calendar_id: number) {
  return api
    .get(`/calendars/${calendar_id}`)
    .then((response: { data: CalendarInfo }) => response.data);
}
