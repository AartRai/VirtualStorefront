const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Review = require('./models/Review');

dotenv.config();

const checkData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        const user = await User.findOne({ email: 'delete_me@test.com' });
        const review = await Review.findOne({ comment: 'This is a test review to be deleted' });

        console.log('User Exists:', !!user);
        console.log('Review Exists:', !!review);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkData();
