import { atom } from "recoil";

export const user = atom({
  key: "user",
  default: "",
});

export const refetch = atom({
  key: "refetch",
  default: false,
});
