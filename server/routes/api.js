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

// upload-image route
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

// delete-image route
router.delete('/delete-image', async (req, res) => {
    const { imageUrl } = req.body;
    if (!imageUrl) {
        return res.status(400).send('No image URL provided.');
    }

    const publicId = imageUrl.split('/').pop().split('.')[0];

    try {
        const result = await cloudinary.uploader.destroy(publicId);
        if (result.result !== 'ok') {
            return res.status(400).send('Failed to delete image.');
        }
        res.send({
            message: 'Image deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting image:', error);
        res.status(500).send('Internal server error.');
    }
});

// Sample route
router.get('/', (req, res) => {
    res.send('This is a sample API route');
});

module.exports = router;