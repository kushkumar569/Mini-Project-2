import { atom } from "recoil"

// may remove later.
export const account = atom({
    key: "Account",
    default: "naveen.gondhi@smvdu.ac.in"
})

export const courseCode = atom({
    key: "code",
    default: "",
})

export const courseName = atom({
    key: "Name",
    default: "",
})

export const semester = atom({
    key: "semester",
    default: "",
})

export const department = atom({
    key: "department",
    default: "",
})

export const section = atom({
    key: "Section",
    default: "",
})

export const day = atom({
    key: "Day",
    default: "",
})

export const date = atom({
    key: "Date",
    default: "",
})

export const time = atom({
    key: "Time",
    default: "",
})