const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    github_url: { type: String, required: true },  // Include this field
    solution_language: { type: String, required: true } // Include this field
});

const Submission = mongoose.model('Submission', submissionSchema);
module.exports = Submission;
