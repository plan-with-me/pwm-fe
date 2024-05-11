import axios from "axios";

const auth = localStorage.getItem("auth");

const api = axios.create({
  baseURL: "https://pwm.ssc.co.kr/api",
  headers: { Authorization: auth },
});

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
