import { atom } from "recoil";

const today = new Date();

export const CalendarDateAtom = atom({
  key: "CalendarDateAtom",
  default: {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
  },
});
