const express = require('express');
const Model = require('../models/applicationModel');
const router = express.Router();
require('dotenv').config()
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

// Check if user has already applied
router.get('/check/:interviewId', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { interviewId } = req.params;

        const existingApplication = await Model.findOne({
            user: userId,
            interview: interviewId
        });

        res.json({ hasApplied: !!existingApplication });
    } catch (err) {
        res.status(500).json({ error: 'Error checking application status' });
    }
});

// Application submission endpoint
router.post('/add', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const { interviewId } = req.body;

        if (!interviewId) {
            return res.status(400).json({ message: 'Interview ID is required' });
        }

        const existingApplication = await Model.findOne({
            user: userId,
            interview: interviewId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: 'You have already applied for this interview'
            });
        }

        const newApplication = new Model({
            user: userId,
            interview: interviewId,
            status: 'Pending',
            createdAt: new Date()
        });

        const result = await newApplication.save();
        const populatedResult = await Model.findById(result._id)
            .populate('user', 'name email')
            .populate({
                path: 'interview',
                populate: {
                    path: 'company',
                    select: 'name email description'
                }
            });

        res.status(200).json(populatedResult);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

// Get all applications for a user
router.get('/getall', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const applications = await Model.find({ user: userId })
            .populate('user', 'name email')
            .populate({
                path: 'interview',
                populate: {
                    path: 'company panel',
                    select: 'name email description'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// Get applications for a specific interview
router.get('/getbyinterview/:interviewId', verifyToken, async (req, res) => {
    try {
        const applications = await Model.find({ interview: req.params.interviewId })
            .populate('user', 'name email education experience location skills phone bio resume')
            .populate({
                path: 'interview',
                populate: {
                    path: 'company',
                    select: 'name email description'
                }
            })
            .sort({ createdAt: -1 });

        res.status(200).json(applications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

// Get applications for a company
router.get('/getbyinterview/:id', async (req, res) => {
    try {
        const applications = await Model.find({ interview: req.params.id })
            .populate('user', 'name email education experience location skills phone bio resume')
            .populate({
                path: 'interview',
                match: { company: companyId },
                populate: {
                    path: 'company',
                    select: 'name email description'
                }
            })
            .sort({ createdAt: -1 });

        // Filter out applications where interview is null
        const companyApplications = applications.filter(app => app.interview !== null);
        res.status(200).json(companyApplications);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching company applications' });
    }
});

// Update application status and add feedback
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { status, feedback, scheduledTime, meetingLink, codeLink } = req.body;

        if (!status && !feedback && !scheduledTime && !meetingLink && !codeLink) {
            return res.status(400).json({ message: 'No valid update fields provided' });
        }

        const application = await Model.findById(req.params.id)
            .populate({
                path: 'interview',
                select: 'company'
            });

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify if the company owns the interview associated with this application
        if (application.interview.company.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        // Update the application
        if (status) {
            if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
                return res.status(400).json({ message: 'Invalid status value' });
            }
            application.status = status;
        }

        if (feedback) application.feedback = feedback;
        if (scheduledTime) application.scheduledTime = new Date(scheduledTime);
        if (meetingLink) application.meetingLink = meetingLink;
        if (codeLink) application.codeLink = codeLink;

        await application.save();

        // Return populated application
        const updatedApplication = await Model.findById(req.params.id)
            .populate('user', 'name email')
            .populate({
                path: 'interview',
                populate: {
                    path: 'company panel',
                    select: 'name email description'
                }
            });

        res.status(200).json(updatedApplication);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating application' });
    }
});

module.exports = router;