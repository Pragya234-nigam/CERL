const express=require('express');
const Model=require('../models/applicationModel');
const router=express.Router();
require('dotenv').config()
const jwt=require('jsonwebtoken');
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
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error submitting application' });
    }
});

router.get('/getall', verifyToken, (req, res) => {
    const userId = req.user._id;
    Model.find({ user: userId })
        .populate('interview')  // This will populate the interview details
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json(err);
        });
});

router.get('/getbyid/:id',(req,res)=>{
    Model.findById(req.params.id)
    .then((result) => {
         res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.put('/update/:id',(req,res)=>{
    Model.findByIdAndUpdate(req.params.id,req.body,{new:true})
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        res.status(500).json(err);
    });
});

router.delete('/delete/:id',(req,res)=>{
    Model.findByIdAndDelete(req.params.id)
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
                const { _id, fname, lname, email } = result
                const payload = { _id, fname, lname, email };

                jwt.sign(
                    payload,
                    process.env.JWT_SECRET,
                    { expiresIn: '2 days' },
                    (err, token) => {
                        if (err) {
                            console.log(err);
                            res.status(500).json({ message: 'error creating token' })
                        } else {
                            res.status(200).json({ token, fname, lname, email })
                        }
                    }
                )
            }
            else res.status(401).json({ message: 'Login Failed' })
        }).catch((err) => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get all applications for company's interviews
router.get('/company/applications', verifyToken, async (req, res) => {
    try {
        const companyId = req.user._id;
        
        const applications = await Model.find()
            .populate('interview')  // Populate interview details
            .populate('user', '-password')  // Populate user details except password
            .exec();

        // Filter applications for interviews created by this company
        const companyApplications = applications.filter(app => 
            app.interview && app.interview.company.toString() === companyId
        );

        res.status(200).json(companyApplications);
    } catch (err) {
        console.error('Error fetching company applications:', err);
        res.status(500).json({ message: 'Error fetching applications' });
    }
});

module.exports=router;