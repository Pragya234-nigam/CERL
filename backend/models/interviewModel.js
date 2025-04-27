const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company',
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contactNo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    skills: {
        type: String,
        required: true
    },
    age: {
        type: String,
        required: true
    },
    experience: {
        type: String,
        required: true
    },
    education: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    jobType: {
        type: String,
        required: true
    },
    interviewDate: {
        type: Date,
        required: true
    },
    interviewTime: {
        type: String,
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },
    codeLink: {
        type: String,
        required: true
    },
    image: {
        type: String,
        default: ''
    },
    status: {
        type: String,
        enum: ['Open', 'In Progress', 'Closed'],
        default: 'Open'
    },
    panel: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('interview', interviewSchema);