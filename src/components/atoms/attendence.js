import { atom } from "recoil";

export const Attend = atom({
    key: "Attendence",
    default: []
})

export const live = atom({
    key: "Live",
    default: true
})

export const time = atom({
    key: "Time",
    default: ""
})
