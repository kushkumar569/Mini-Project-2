import { atom } from "recoil";

export const TeacherLatitude = atom({
  key: "TeacherLatitude",
  default: 32.943144657701716
});

export const TeacherLongitude = atom({ 
  key: "TeacherLongitude",
  default: 74.95526578190709
});

export const StudentLatitude = atom({
  key: "StudentLatitude",
  default: 0.0
});

export const StudentLongitude = atom({
  key: "StudentLongitude",
  default: 0.0
});
