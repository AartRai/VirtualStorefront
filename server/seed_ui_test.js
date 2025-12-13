const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Product = require('./models/Product');
const bcrypt = require('bcryptjs');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        const email = 'ui_test_seller@test.com';
        // Clean up previous run
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            await Product.deleteMany({ user: existingUser._id });
            await User.deleteOne({ _id: existingUser._id });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password', salt);

        const user = new User({
            name: 'UI Test Seller',
            email,
            password: hashedPassword,
            role: 'business'
        });
        await user.save();

        const product = new Product({
            user: user._id,
            name: 'UI Delete Test Product',
            description: 'This is a product created to test UI deletion',
            category: 'Electronics',
            price: 999,
            stock: 5,
            images: ['/placeholder.svg']
        });
        await product.save();

        console.log('User and Product created.');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seed();
