import api from "./config";

export interface DiaryProps {
  title: string;
  icon: string;
  content: Content;
  show_scope: string;
  date: string;
}

export interface EditDiaryProps extends DiaryProps {
  id: number;
}

export interface Diary extends EditDiaryProps {
  created_at: string;
  updated_at: string;
}

interface Content {
  content: string;
}

export async function createDiary({
  title,
  icon,
  content,
  show_scope,
  date,
}: DiaryProps) {
  try {
    await api.post("/diaries", { title, icon, content, show_scope, date });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function getDiaries(userId?: number, date?: string) {
  try {
    const data = await api
      .get<Diary[]>("/diaries", {
        params: { userId, date },
      })
      .then((response) => response.data);

    return data;
  } catch (error) {
    console.log(error);
    return [];
  }
}

export async function editDiary({
  id,
  title,
  icon,
  content,
  show_scope,
  date,
}: EditDiaryProps) {
  try {
    await api.put(`/diaries/${id}`, { title, icon, content, show_scope, date });

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export default async function deleteDiary(diaryId: number) {
  try {
    await api.delete(`/diaries/${diaryId}`);

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
