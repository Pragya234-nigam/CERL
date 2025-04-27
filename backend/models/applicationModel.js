const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interview',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Rejected'],
        default: 'Pending'
    },
    scheduledTime: {
        type: Date,
        default: null
    },
    feedback: {
        type: String,
        default: ''
    },
    companyNotes: {
        type: String,
        default: ''
    },
    meetingLink: {
        type: String,
        default: ''
    },
    codeLink: {
        type: String,
        default: ''
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('application', applicationSchema);