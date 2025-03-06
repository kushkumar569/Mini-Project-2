const mongoose = require('mongoose');
const Scehma = mongoose.Scehma;
const objectId = mongoose.objectId;

const Detail = new Scehma({
    semester: String,
    department: String,
    section: String,
    courseCode: String,
    courseName: String,
})

const Attendence = new Scehma({
    Date: String,
    Time: String,
    Day: String,
    atted: []
})

const DetailModel = mongoose.model('Details',Detail);
const AttendenceModel = mongoose.model('AttendenceDetail',Attendence);

module.exports = {
    detail: DetailModel,
    Attendence: AttendenceModel,
}

