const userModel = require('../model/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const nodemailer = require('nodemailer');
require('dotenv').config();


const generateToken = (_id) => {
    const jwtKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({ _id }, jwtKey, { expiresIn: "5d" });
};
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,  
        pass: process.env.PASSWORD
    }
});


const sendFirstTimeLoginEmail = (email, name, actionUrl) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .email-container {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                }
                .email-header {
                    text-align: center;
                    padding-bottom: 20px;
                }
                .email-body {
                    font-size: 16px;
                    color: #333333;
                    line-height: 1.6;
                }
                .email-footer {
                    text-align: center;
                    padding: 20px 0;
                    color: #888888;
                    font-size: 12px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    color: #ffffff;
                    background-color: #007bff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin: 20px 0;
                    font-weight: bold;
                }
                .button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="email-header">
                    <h1>Welcome to the Internship Challenge!</h1>
                </div>
                <div class="email-body">
                    <p>Hi ${name},</p>
                    <p>Thank you for participating in our internship challenge! We are excited to have you on board.</p>
                    <p>To get started, please visit the link below:</p>
                    <a href="${actionUrl}" class="button">Start the Challenge</a>
                    <p>If you have any questions, feel free to reach out!</p>
                </div>
                <div class="email-footer">
                    <p>&copy; 2024 Interns Scholars. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Internship Challenge',
        html: htmlContent // Insert the HTML content here
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Welcome email sent:", info.response);
        }
    });
};



const sendLoginEmail = (email) => {
    const mailOptions = {
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Login Alert',
        text: 'You have successfully logged in.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Error sending email:", error);
        } else {
            console.log("Login email sent:", info.response);
        }
    });
};


const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "There is already a user registered with this email" });
        }
        if (!name || !email || !password) {
            return res.status(400).json({ error: "Please fill up all the fields" });
        }
        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: "Please enter a valid email" });
        }
        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ error: "Please enter a strong password" });
        }

        user = new userModel({ name, email, password, isFirstLogin: true });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();

        const jwtToken = generateToken(user._id);
        res.status(200).json({ token: jwtToken, user: { name, email } });
        sendFirstTimeLoginEmail(email, name, 'https://challenge-sand.vercel.app/');
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "An error occurred while registering the user" });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User not found with this email" });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Invalid password" });
        }
        //sendLoginEmail(email, name);
        //sendFirstTimeLoginEmail(email, user.name);
        const jwtToken = generateToken(user._id);
        res.status(200).json({ message: "User logged in successfully", token: jwtToken });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while logging in the user" });
    }
};

// Find a user by ID
const findUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await userModel.findById(userId);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "An error occurred while finding the user" });
    }
};

// Get all users
const users = async (req, res) => {
    try {
        const user = await userModel.find();
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "An error occurred while finding the users" });
    }
};

// Delete a user by ID
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const result = await userModel.deleteOne({ _id: userId });
        if (result.deletedCount === 1) {
            res.status(200).json({ message: "User deleted successfully" });
        } else {
            res.status(400).json({ error: "User not found with this id" });
        }
    } catch (error) {
        console.log(error);
        res.status(400).json({ error: "An error occurred while deleting the user" });
    }
};

module.exports = { registerUser, loginUser, findUser, users, deleteUser };
