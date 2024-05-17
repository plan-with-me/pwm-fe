import api from "./config";

export async function createCalendar(
  name: string,
  image: string | null,
  user_ids: number[]
) {
  api.post("/calendars", { name, image, user_ids }).then((response) => {
    console.log(response.data);
  });
}
