const express=require('express');
const Model=require('../models/applicationModel');
const router=express.Router();
require('dotenv').config()
const jwt=require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');

router.post('/add', verifyToken, (req, res) => {
    const { userId, interviewId } = req.body;
    
    // Validate required fields
    if (!userId || !interviewId) {
        return res.status(400).json({ error: 'userId and interviewId are required fields' });
    }

    // Create new application with the validated data
    new Model({
        user: userId,
        interview: interviewId,
        createdAt: new Date()
    }).save()
    .then((result) => {
        res.status(200).json(result);
    }).catch((err) => {
        console.log(err);
        res.status(500).json({ error: 'Error saving application', details: err.message });
    });
});

router.get('/getall',(req,res)=>{
    Model.find()
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

router.get('/check/:userId/:interviewId', async (req, res) => {
    try {
        const { userId, interviewId } = req.params;
        const application = await Model.findOne({ user: userId, interview: interviewId });
        res.json({ hasApplied: !!application });
    } catch (error) {
        res.status(500).json({ error: 'Error checking application status' });
    }
});

module.exports=router;