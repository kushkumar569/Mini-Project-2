const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const Info = new Schema({
    semester: String,
    department: String,
    section: String
})

const course = new Schema({
    courseCode: {type: String, unique: true},
    courseName: String
})

const schedule = new Schema({
    courseCode: {type: String, unique: true},
    day: String,
    time: String,
})

const InfoModel = mongoose.model('Info',Info);
const CourseModel = mongoose.model('course',course);
const ScheduleModel = mongoose.model('schedule',schedule);

module.exports = {
    Info: InfoModel,
    course: CourseModel,
    schedule: ScheduleModel
}