const express = require('express');
const Model = require('../models/interviewModel');
const verifyToken = require('../middlewares/verifyToken');
const router = express.Router();

router.post('/add', verifyToken, (req, res) => {
    req.body.company = req.user._id;
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.put('/join/:id', verifyToken, async (req, res) => {
    try {
        // First check if the company is already in the panel
        const interview = await Model.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ message: "Interview not found" });
        }

        // Check if company is already in panel
        if (interview.panel.includes(req.user._id)) {
            return res.status(400).json({ message: "You are already a member of this panel" });
        }

        // Add company to the interview panel
        const result = await Model.findByIdAndUpdate(
            req.params.id,
            { $push: { panel: req.user._id } },
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: "Successfully joined the panel", panel: result });
    } catch (err) {
        console.error(err);
        // Send the specific validation error message if available
        const errorMessage = err.errors?.panel?.message || "Error joining the panel";
        res.status(500).json({ message: errorMessage, error: err });
    }
});

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getbycompany', verifyToken, (req, res) => {
    const companyId = req.user._id;
    
    Model.find({ company: companyId })
        .then((interviews) => {
            res.status(200).json(interviews);
        })
        .catch((err) => {
            console.error('Error fetching company interviews:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch company interviews',
                error: err.message
            });
        });
});

router.get('/panel/interviews', verifyToken, (req, res) => {
    const companyId = req.user._id;
    console.log(companyId);
    
    Model.find({ panel: companyId })
        .then((interviews) => {
            res.status(200).json(interviews);
        })
        .catch((err) => {
            console.error('Error fetching panel interviews:', err);
            res.status(500).json({
                success: false,
                message: 'Failed to fetch panel interviews',
                error: err.message
            });
        });
});

router.get('/getall', (req, res) => {
    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

module.exports = router;