const mongoose = require('mongoose');
const { course } = require('./TImeTable');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const subject = new Schema({
    email: {type: String, unique: true},
    courseCode: String,
    couseName: String
})

const subjectModel = mongoose.model('subject',subject);
module.exports = {
    subject: subjectModel
}