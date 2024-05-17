import api from "./config";

export type CalendarInfo = {
  id: number;
  name: string;
  image: string | null;
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
