const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const objectId = mongoose.objectId;

const Detail = new Schema({
    semester: String,
    department: String,
    section: String,
    courseCode: String,
    courseName: String,
})

const Attendence = new Schema({
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

