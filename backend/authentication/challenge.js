const express = require('express');
const Submission = require('../model/cdb'); // Adjust the path to your model if necessary

const router = express.Router();

const handleSubmission = async (req, res) => {
    const { github_url, contact_email, solution_language } = req.body;

    try {
        // Check if the email has already been submitted
        const existingSubmission = await Submission.findOne({ email: contact_email });
        if (existingSubmission) {
            return res.status(400).json({ message: 'Email already submitted.' });
        }

        // Create a new submission including all necessary fields
        const newSubmission = new Submission({
            email: contact_email,
            github_url: github_url,
            solution_language: solution_language
        });

        // Save the new submission to the database
        await newSubmission.save();

        return res.status(200).json({
            message: 'Congratulations! You have achieved mission 3.',
            data: {
                github_url,
                contact_email,
                solution_language
            }
        });
    } catch (error) {
        console.error('Error occurred:', error); // Optional: Log the error for debugging
        return res.status(500).json({ message: 'An error occurred.', error });
    }
};

module.exports = { handleSubmission };
