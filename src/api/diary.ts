import api from "./config";

export interface DiaryProps {
  title: string;
  icon: string;
  content: Content;
  show_scope: string;
}

export interface Diary extends DiaryProps {
  id: number;
}

interface Content {
  content: string;
}

export async function createDiary({
  title,
  icon,
  content,
  show_scope,
}: DiaryProps) {
  try {
    return await api
      .post("/diaries", { title, icon, content, show_scope })
      .then((response) => response.data);
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDiaries(userId?: number, date?: string) {
  return await api
    .get("/diaries", { params: { userId, date } })
    .then((response) => response.data);
}

export async function editDiary({
  id,
  title,
  icon,
  content,
  show_scope,
}: Diary) {
  try {
    return await api
      .put(`/diaries/${id}`, { title, icon, content, show_scope })
      .then((response) => response.data);
  } catch (error) {
    console.log(error);
    return false;
  }
}
