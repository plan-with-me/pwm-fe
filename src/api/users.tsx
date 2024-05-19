import api from "./config";

export type UserInfo = {
  id: number;
  name: string;
  image: string | null;
  introduction: string | null;
};

export async function getUserInfo() {
  const data = await api
    .get("/users/me")
    .then((response: { data: UserInfo }) => {
      return response.data;
    });
  return data;
}
