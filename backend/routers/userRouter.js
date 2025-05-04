const express = require('express');
const Model = require('../models/userModel');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// for authentication
require('dotenv').config();
const jwt = require('jsonwebtoken');

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'uploads/resumes';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter to accept only PDF and DOCX files
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF and Word documents are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB max file size
  }
});

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

// Route to upload/update resume
router.post('/upload-resume', verifyToken, upload.single('resume'), async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Get current user document to check for existing resume
    const user = await Model.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete old resume file if it exists
    if (user.resume && fs.existsSync(user.resume)) {
      fs.unlinkSync(user.resume);
    }
    
    // Update user with new resume file path
    const filePath = req.file.path;
    
    // Update user document
    const updatedUser = await Model.findByIdAndUpdate(
      req.user._id,
      { resume: filePath },
      { new: true }
    );
    
    // Remove sensitive information
    const { password, ...userData } = updatedUser.toObject();
    
    res.status(200).json({ 
      message: 'Resume uploaded successfully',
      resumePath: filePath,
      user: userData
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).json({ message: 'Error uploading resume', error: error.message });
  }
});

// Route to download resume
router.get('/resume/:userId', async (req, res) => {
  try {
    const user = await Model.findById(req.params.userId);
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.download(user.resume);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Error downloading resume' });
  }
});

// Modify existing update route to handle resume field differently
router.put('/update', verifyToken, async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'education', 'skills', 'experience',
            'bio', 'phone', 'location'
            // 'resume' removed from here since it's handled by the upload route
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

// Serve resume files statically
router.use('/resume-files', express.static('uploads/resumes'));

// Authentication route
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

// Route to download resume for companies
router.get('/resume/:userId', verifyToken, async (req, res) => {
  try {
    // Ensure the requester is a company
    if (!req.user.isCompany) {
      return res.status(403).json({ message: 'Only companies can access resumes' });
    }
    
    const user = await Model.findById(req.params.userId);
    if (!user || !user.resume) {
      return res.status(404).json({ message: 'Resume not found' });
    }
    
    res.download(user.resume);
  } catch (error) {
    console.error('Error downloading resume:', error);
    res.status(500).json({ message: 'Error downloading resume' });
  }
});

// Check if user has a resume
router.get('/has-resume/:userId', verifyToken, async (req, res) => {
  try {
    // Ensure the requester is a company
    if (!req.user.isCompany) {
      return res.status(403).json({ message: 'Only companies can check resume status' });
    }
    
    const user = await Model.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json({ hasResume: !!user.resume });
  } catch (error) {
    console.error('Error checking resume status:', error);
    res.status(500).json({ message: 'Error checking resume status' });
  }
});

module.exports = router;