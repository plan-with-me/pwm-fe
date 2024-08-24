import api from "./config";

export async function createDiary(
  title: string,
  icon: string,
  content: object,
  show_scope: string
) {
  try {
    return await api
      .post("/diaries", { title, icon, content, show_scope })
      .then((response) => response.data);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDiaries(userId: number) {
  return await api
    .get("/diaries", { params: { userId } })
    .then((response) => response.data);
}
