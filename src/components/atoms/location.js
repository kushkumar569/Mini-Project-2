import { atom } from "recoil";

export const TeacherLatitude = atom({
  key: "TeacherLatitude",
  default: 0.0,
});

export const TeacherLongitude = atom({ 
  key: "TeacherLongitude",
  default: 0.0,
});

export const StudentLatitude = atom({
  key: "StudentLatitude",
  default: 0.0,
});

export const StudentLongitude = atom({
  key: "StudentLongitude",
  default: 0.0,
});
