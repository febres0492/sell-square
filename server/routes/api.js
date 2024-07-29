const express = require('express');
const router = express.Router();
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig'); // Adjust the path as necessary
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure multer storage with Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'uploads', // Folder name in Cloudinary
        format: async (req, file) => 'png', // Supports promises as well
        public_id: (req, file) => file.originalname,
    },
});

const upload = multer({ storage: storage });

// Define the upload-image route
router.post('/upload-image', upload.single('image'), (req, res) => {
    console.log('upload-image',req.file);
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }
    res.send({
        message: 'Image uploaded successfully',
        url: req.file.path,
    });
});

// Sample route
router.get('/', (req, res) => {
    res.send('This is a sample API route');
});

module.exports = router;