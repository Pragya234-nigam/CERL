const express = require('express');
const Model = require('../models/userModel');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

// for authentication
require('dotenv').config();
const jwt = require('jsonwebtoken');

router.post('/add', (req, res) => {
    console.log(req.body);

    new Model(req.body).save()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
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

router.get('/getbyid', verifyToken, (req, res) => {
    Model.findById(req.user._id)
        .then((result) => {
            // Remove sensitive information
            const { password, ...userData } = result.toObject();
            res.status(200).json(userData);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.put('/update', verifyToken, async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'education', 'skills', 'experience',
            'bio', 'phone', 'location', 'resume'
        ];
        
        // Filter out any fields that are not in allowedUpdates
        const updates = {};
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const result = await Model.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true }
        );

        // Remove sensitive information
        const { password, ...userData } = result.toObject();
        res.status(200).json(userData);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});

router.delete('/delete', verifyToken, (req, res) => {
    Model.findByIdAndDelete(req.user._id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.post('/authenticate', (req, res) => {
    console.log(req.body);
    Model.findOne(req.body)
        .then((result) => {
            if (result) {
                const { _id, name, email } = result;
                const payload = { _id, name, email };

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '2 days' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: 'error creating token' });
                        } else {
                            res.status(200).json({ token, name, email });
                        }
                    }
                );
            } else {
                res.status(401).json({ message: 'Login Failed' });
            }
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;