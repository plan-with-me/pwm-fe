import axios from "axios";

const auth = localStorage.getItem("auth");

const api = axios.create({
  baseURL: "https://pwm.ssc.co.kr/api",
  headers: { Authorization: auth },
});

export type TopGoals = {
  id: number;
  name: "string";
  color: "string";
  status: "string";
  show_scope: "string";
  created_at: "string";
  updated_at: "string";
};

export async function getTopGoals() {
  const data = await api
    .get("/top-goals")
    .then((response: { data: TopGoals[] }) => {
      return response.data;
    });

  return data;
}
