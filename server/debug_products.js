const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift')
    .then(async () => {
        console.log('Connected to DB');
        const products = await Product.find().sort({ createdAt: -1 }).limit(5);
        console.log('Latest 5 Products:');
        products.forEach(p => console.log(`- ${p.name} (ID: ${p._id}, User: ${p.user})`));

        const users = await User.find();
        console.log('\nUsers:');
        users.forEach(u => console.log(`- ${u.name} (ID: ${u._id}, Role: ${u.role}, Email: ${u.email})`));

        process.exit();
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
