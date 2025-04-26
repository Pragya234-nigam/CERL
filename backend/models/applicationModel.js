const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    interview: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'interviews',
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
    notificationSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('applications', applicationSchema);