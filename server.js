const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config(); // Corrected dotenv import

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Ensure environment variables are set
if (!process.env.EMAIL || !process.env.EMAIL_PASSWORD || !process.env.ADMIN_EMAIL) {
    console.error("Missing environment variables: EMAIL, EMAIL_PASSWORD, or ADMIN_EMAIL");
    process.exit(1);
}

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

app.post('/api/book-event', async (req, res) => {
    const { eventType, date, time, guests, venue, menu, name, email, phone, notes } = req.body;

    if (!eventType || !date || !time || !guests || !venue || !menu || !name || !email || !phone) {
        return res.status(400).json({ message: "Missing required booking details" });
    }

    const userMailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: '🎉 Booking Confirmed - Get Ready for an Amazing Event! 🎊',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; border-radius: 10px; background: #f4f4f4;">
                <div style="text-align: center; background: #0073e6; padding: 15px; border-radius: 10px 10px 0 0;">
                    <div style="font-size: 1.875rem; font-weight: bold; color: #fffff;">Anjani Catering Services</div>
                    <h2 style="color: #fff; margin: 10px 0;">Booking Confirmation</h2>
                </div>
                <div style="background: #ffffff; padding: 20px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #333;">Hello <strong>${name}</strong>,</p>
                    <p style="color: #555;">Thank you for booking with us! Here are your event details:</p>
                    <div style="background: #e3f2fd; padding: 15px; border-radius: 5px;">
                        <p><strong>📅 Event Type:</strong> ${eventType}</p>
                        <p><strong>🕒 Date & Time:</strong> ${date} at ${time}</p>
                        <p><strong>👥 Guests:</strong> ${guests}</p>
                        <p><strong>📍 Venue:</strong> ${venue}</p>
                        <p><strong>🍽️ Menu:</strong> ${menu}</p>
                    </div>
                    <p style="color: #555;">We are excited to make your event special! If you need any assistance, feel free to reach out.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://anjanicateringservices.netlify.app/" style="background: #0073e6; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">Visit Our Website</a>
                    </div>
                    <hr style="margin: 20px 0; border: 0.5px solid #ddd;">
                    <p style="text-align: center; color: #777; font-size: 14px;">📞 <strong>Phone:</strong> +91-9752973526 | 📧 <strong>Email:</strong>akashraikwar763@gmail.com</p>
                </div>
            </div>
        `
    };
    
    

    const adminMailOptions = {
        from: process.env.EMAIL,
        to: process.env.ADMIN_EMAIL,
        subject: '📢 New Booking Alert - Review Details!',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 20px; border-radius: 10px; background: #fff3cd;">
                <div style="text-align: center; background: #d9534f; padding: 15px; border-radius: 10px 10px 0 0;">
                    <h2 style="color: #fff; margin: 10px 0;">New Booking Alert 🚀</h2>
                </div>
                <div style="background: #ffffff; padding: 20px; border-radius: 0 0 10px 10px;">
                    <p style="font-size: 16px; color: #333;">A new catering booking has been received. Here are the details:</p>
                    <div style="background: #ffeeba; padding: 15px; border-radius: 5px;">
                        <p><strong>👤 Name:</strong> ${name}</p>
                        <p><strong>📧 Email:</strong> ${email}</p>
                        <p><strong>📞 Phone:</strong> ${phone}</p>
                        <p><strong>📅 Event Type:</strong> ${eventType}</p>
                        <p><strong>🕒 Date & Time:</strong> ${date} at ${time}</p>
                        <p><strong>👥 Guests:</strong> ${guests}</p>
                        <p><strong>📍 Venue:</strong> ${venue}</p>
                        <p><strong>🍽️ Menu:</strong> ${menu}</p>
                        <p><strong>📝 Notes:</strong> ${notes || "No additional notes."}</p>
                    </div>
                    <p style="color: #555;">Please review and follow up if necessary.</p>
                    <div style="text-align: center; margin-top: 20px;">
                        <a href="https://anjanicateringservices.netlify.app/" style="background: #d9534f; color: #fff; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">View Booking Dashboard</a>
                    </div>
                    <hr style="margin: 20px 0; border: 0.5px solid #ddd;">
                    <p style="text-align: center; color: #777; font-size: 14px;">📞 <strong>Phone:</strong> YOUR_PHONE_NUMBER | 📧 <strong>Email:</strong> YOUR_EMAIL</p>
                </div>
            </div>
        `
    };
      

    try {
        await transporter.sendMail(userMailOptions);
        await transporter.sendMail(adminMailOptions);
        res.status(200).json({ message: 'Booking confirmed and emails sent!' });
    } catch (error) {
        console.error("Error sending emails:", error);
        res.status(500).json({ message: 'Error sending emails', error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
