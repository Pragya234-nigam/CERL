const express = require('express');
const Model = require('../models/applicationModel');
const router = express.Router();
require('dotenv').config();
const jwt = require('jsonwebtoken');
const verifyToken = require('../middlewares/verifyToken');
const nodemailer = require('nodemailer');

// Configure nodemailer transporter with SMTP settings
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: process.env.NODE_ENV === 'production' // Allow self-signed certs in development
  }
});

// Verify transporter connection on server start
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP server connection error:', error);
  } else {
    console.log('SMTP server connection established, ready to send emails');
  }
});

// Helper function to send email notifications
const sendStatusEmail = async (application, status) => {
  try {
    if (!application.user || !application.user.email || !application.interview) {
      console.error('Missing user or interview information for email notification');
      return;
    }

    const companyName = application.interview.company?.name || 'The company';
    const interviewTitle = application.interview.title || 'the interview';
    
    let subject, content;
    
    if (status === 'Accepted') {
      subject = `Your Application for ${interviewTitle} has been Accepted!`;
      content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #4CAF50; padding: 15px; color: white; text-align: center; border-radius: 5px 5px 0 0;">
            <h2>Congratulations! Your Application Has Been Accepted</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Dear ${application.user.name || 'Applicant'},</p>
            <p>We're pleased to inform you that your application for <strong>${interviewTitle}</strong> at <strong>${companyName}</strong> has been accepted!</p>
            ${application.scheduledTime ? 
              `<p>Your interview has been scheduled for: <strong>${new Date(application.scheduledTime).toLocaleString()}</strong></p>` : 
              '<p>You will receive further details about your interview schedule soon.</p>'}
            ${application.meetingLink ? 
              `<p>Meeting Link: <a href="${application.meetingLink}" target="_blank">${application.meetingLink}</a></p>` : ''}
            ${application.codeLink ? 
              `<p>Code Test Link: <a href="${application.codeLink}" target="_blank">${application.codeLink}</a></p>` : ''}
            ${application.feedback ? 
              `<p>Feedback: ${application.feedback}</p>` : ''}
            <p>Please make sure to prepare for your interview and be ready at the scheduled time.</p>
            <p>Best of luck!</p>
            <p>Regards,<br>HR Team<br>${companyName}</p>
          </div>
          <div style="text-align: center; padding: 10px; background-color: #eee; border-radius: 0 0 5px 5px; font-size: 12px; color: #666;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `;
    } else if (status === 'Rejected') {
      subject = `Update on Your Application for ${interviewTitle}`;
      content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border-radius: 5px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
          <div style="background-color: #607D8B; padding: 15px; color: white; text-align: center; border-radius: 5px 5px 0 0;">
            <h2>Application Status Update</h2>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <p>Dear ${application.user.name || 'Applicant'},</p>
            <p>Thank you for your interest in <strong>${interviewTitle}</strong> at <strong>${companyName}</strong>.</p>
            <p>After careful consideration, we regret to inform you that we have decided not to proceed with your application at this time.</p>
            ${application.feedback ? 
              `<p>Feedback: ${application.feedback}</p>` : ''}
            <p>We appreciate your interest in our company and wish you all the best in your job search.</p>
            <p>Regards,<br>HR Team<br>${companyName}</p>
          </div>
          <div style="text-align: center; padding: 10px; background-color: #eee; border-radius: 0 0 5px 5px; font-size: 12px; color: #666;">
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `;
    } else {
      // Don't send emails for other status changes
      return;
    }

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: application.user.email,
      subject: subject,
      html: content
    };
    console.log(`Sending email to ${application.user.email} with subject: ${subject}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error('Error sending email notification:', error);
    return false;
  }
};

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
                select: 'company title',
                populate: {
                    path: 'company',
                    select: 'name email'
                }
            })
            .populate('user', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify if the company owns the interview associated with this application
        if (application.interview.company._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this application' });
        }

        // Check for status change to send email notification
        const statusChanged = status && status !== application.status;
        const oldStatus = application.status;

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

        // Send email notification if status changed to Accepted or Rejected
        if (statusChanged && (status === 'Accepted' || status === 'Rejected')) {
            sendStatusEmail(updatedApplication, status)
                .then(sent => {
                    if (sent) {
                        console.log(`Status update email (${status}) sent to ${updatedApplication.user.email}`);
                    }
                })
                .catch(err => {
                    console.error('Failed to send status update email:', err);
                });
        }

        res.status(200).json(updatedApplication);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating application' });
    }
});

// Add a new route to manually trigger email notifications (for testing)
router.post('/send-email/:id', verifyToken, async (req, res) => {
    try {
        // Verify the requester is a company
        if (!req.user._id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const application = await Model.findById(req.params.id)
            .populate({
                path: 'interview',
                select: 'company title',
                populate: {
                    path: 'company',
                    select: 'name email'
                }
            })
            .populate('user', 'name email');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        // Verify if the company owns the interview associated with this application
        if (application.interview.company._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to send emails for this application' });
        }

        const result = await sendStatusEmail(application, application.status);
        
        if (result) {
            res.status(200).json({ message: 'Email sent successfully' });
        } else {
            res.status(400).json({ message: 'Failed to send email or email not required for current status' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending email' });
    }
});

module.exports = router;