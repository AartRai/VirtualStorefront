const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const checkOrphans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift');

        const orphans = await Product.find({ user: { $exists: false } });
        console.log(`Found ${orphans.length} products without user field.`);

        if (orphans.length > 0) {
            console.log('Orphan IDs:', orphans.map(p => p._id));
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkOrphans();
