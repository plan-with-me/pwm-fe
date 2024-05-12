import api from "./config";


export type UserInfo = {
  id: number;
  name: string;
  image: string | null;
  introduction: string | null;
  created_at: string;
  updated_at: string;
};

export async function getUserInfo() {
  const data = await api
    .get("/users/me")
    .then((response: { data: UserInfo }) => {
      return response.data;
    });
  return data;
}
