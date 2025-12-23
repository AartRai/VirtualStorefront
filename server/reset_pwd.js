const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetPassword = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const emails = ['business1@gmail.com', 'aartirai991@gmail.com'];
        const newPassword = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        for (const email of emails) {
            let user = await User.findOne({ email });
            if (user) {
                user.password = hashedPassword;
                await user.save();
                console.log(`Password for ${email} reset to: ${newPassword}`);
            } else {
                console.log(`User ${email} not found.`);
            }
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetPassword();
