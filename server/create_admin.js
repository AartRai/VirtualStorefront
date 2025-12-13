const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');
        console.log('MongoDB Connected');

        const email = 'admin_real@test.com';
        let user = await User.findOne({ email });

        if (user) {
            user.role = 'admin';
            await user.save();
            console.log(`User ${email} updated to admin.`);
        } else {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('password', salt);

            user = new User({
                name: 'Admin User',
                email,
                password: hashedPassword,
                role: 'admin'
            });
            await user.save();
            console.log(`User ${email} created as admin.`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createAdmin();
