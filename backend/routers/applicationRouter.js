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
        
        // Check if user has already applied
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

// Update application status and add feedback
router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { status, feedback, scheduledTime } = req.body;
        const application = await Model.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Update the application
        application.status = status || application.status;
        application.feedback = feedback || application.feedback;
        application.scheduledTime = scheduledTime || application.scheduledTime;
        
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