require('dotenv').config();
const nodemailer = require('nodemailer');

async function testEmail() {
    console.log('--- Testing SMTP Connection ---');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_EMAIL);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        console.log('Sending test email...');
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: process.env.SMTP_EMAIL, // Send to self
            subject: 'SMTP Test',
            text: 'If you see this, SMTP is working!',
        });
        console.log('SUCCESS: Email sent!', info.messageId);
    } catch (err) {
        console.error('FAILURE:', err.message);
        if (err.code === 'EAUTH') {
            console.error('Hint: Check your App Password. It might be incorrect.');
        }
    }
}

testEmail();
