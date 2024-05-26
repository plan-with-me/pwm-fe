import { atom } from "recoil";

export const selectedTodoAtom = atom<{
  id: number | null;
  text: string;
  status: string;
}>({
  key: "SelectedTodoAtom",
  default: { id: null, text: "", status: "" },
});
