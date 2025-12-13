const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/brands', require('./routes/brands'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/business', require('./routes/business'));
app.use('/api/upload', require('./routes/upload'));

// Serve Static Uploads
const path = require('path'); // Ensure path is imported
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database Connection
// Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/locallift')
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.error('MongoDB Connection Error:', err));

app.get('/', (req, res) => {
    res.send('LocalLift API is running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
