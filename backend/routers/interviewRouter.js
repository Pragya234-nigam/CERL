const express = require('express');
const Model = require('../models/interviewModel');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/add', verifyToken, (req, res) => {
    req.body.company = req.user._id;
    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/getall', async (req, res) => {
    try {
        const interviews = await Model.find()
            .populate('company', 'name email description')
            .populate('panel', 'name email')
            .sort({ createdAt: -1 });
        res.status(200).json(interviews);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching interviews' });
    }
});

router.get('/getbyid/:id', async (req, res) => {
    try {
        const interview = await Model.findById(req.params.id)
            .populate('company', 'name email description')
            .populate('panel', 'name email');
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }
        res.status(200).json(interview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching interview' });
    }
});

router.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const interview = await Model.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Verify ownership
        if (interview.company.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to update this interview' });
        }

        const updatedInterview = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('company', 'name email description')
         .populate('panel', 'name email');

        res.status(200).json(updatedInterview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating interview' });
    }
});

router.put('/join/:id', verifyToken, async (req, res) => {
    try {
        const interview = await Model.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Check if company is already in panel
        if (interview.panel.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already a panel member' });
        }

        // Add company to panel
        interview.panel.push(req.user._id);
        await interview.save();

        // Return updated interview with populated fields
        const updatedInterview = await Model.findById(req.params.id)
            .populate('company', 'name email description')
            .populate('panel', 'name email');

        res.status(200).json(updatedInterview);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error joining panel' });
    }
});

router.delete('/delete/:id', verifyToken, async (req, res) => {
    try {
        const interview = await Model.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: 'Interview not found' });
        }

        // Verify ownership
        if (interview.company.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to delete this interview' });
        }

        await Model.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Interview deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting interview' });
    }
});

module.exports = router;