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

router.put('/join/:id', verifyToken, (req, res) => {
    // Add company to the interview panel
    Model.findByIdAndUpdate(
        req.params.id,
        { $push: { panel: req.user._id } }, // Assuming 'panel' is an array in the model
        { new: true }
    )
        .then((result) => {
            if (!result) {
                return res.status(404).json({ message: "Panel not found" });
            }
            res.status(200).json({ message: "Successfully joined the panel", panel: result });
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: "Error joining the panel", error: err });
        });
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