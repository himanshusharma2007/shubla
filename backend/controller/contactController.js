const Contact = require('../model/contactModel');
const sendEmail = require('../utils/sendMail');
const dotenv=require('dotenv');
dotenv.config();
exports.sendMessage = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Input validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Create contact message in database
        const contact = await Contact.create({
            name,
            email,
            message
        });

        // Email content for user confirmation
        const userSubject = "Thank you for contacting us";
        const userMessage = `
            <h2>Thank you for reaching out to us!</h2>
            <p>Dear ${name},</p>
            <p>We have received your message and will get back to you soon.</p>
            <p>Your message:</p>
            <p><em>${message}</em></p>
            <br>
            <p>Best regards,</p>
            <p>EJUUZ Team</p>
        `;

        // Email content for admin notification
        const adminSubject = "New Contact Form Submission";
        const adminMessage = `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `;

        // Send confirmation email to user
        await sendEmail(email, userSubject, userMessage);

        // Send notification to admin
        console.log('first', process.env.ADMIN_EMAIL)
        await sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminMessage);

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            contact
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error sending message",
            error: error.message
        });
    }
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await Contact.find()
            .sort({ createdAt: -1 }); // Most recent first

        res.status(200).json({
            success: true,
            count: messages.length,
            messages
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching messages",
            error: error.message
        });
    }
};
