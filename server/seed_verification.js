const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const Review = require('./models/Review');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');
        console.log('MongoDB Connected');

        // 1. Create Dummy User to Delete
        const email = 'delete_me@test.com';
        await User.deleteOne({ email }); // Clean up if exists

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const dummyUser = new User({
            name: 'Delete Me User',
            email,
            password: hashedPassword,
            role: 'customer'
        });
        await dummyUser.save();
        console.log(`Dummy user ${email} created.`);

        // 2. Create Dummy Review to Delete
        await Review.deleteMany({ comment: 'This is a test review to be deleted' }); // Clean up

        const product = await Product.findOne();
        if (!product) {
            console.log('No products found, cannot create review.');
        } else {
            const review = new Review({
                user: dummyUser._id,
                product: product._id,
                rating: 1,
                comment: 'This is a test review to be deleted',
                createdAt: new Date()
            });
            await review.save();
            console.log('Dummy review created.');
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedData();
