import { atom } from "recoil";

export const TeacherLatitude = atom({
  key: "TeacherLatitude",
  default: 32.940918
});

export const TeacherLongitude = atom({ 
  key: "TeacherLongitude",
  default: 74.954437
});

export const StudentLatitude = atom({
  key: "StudentLatitude",
  default: 0.0
});

export const StudentLongitude = atom({
  key: "StudentLongitude",
  default: 0.0
});
