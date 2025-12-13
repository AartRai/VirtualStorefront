const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Filename: timestamp-originalName
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File Filter (Images Only)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit per file, practical
});

// @route   POST api/upload
// @desc    Upload an image
// @access  Public (or Private if you want strict control, typically public for ease)
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        // Return relative path for DB
        const filePath = `/uploads/${req.file.filename}`;
        res.json({ filePath });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
