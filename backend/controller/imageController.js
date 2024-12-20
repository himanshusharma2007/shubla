const { GalleryImage, InstagramImage } = require('../model/imageModel');
const { uploadOnCloudinary } = require('../utils/cloudinary');
const emptyTempFolder = require('../utils/emptyTempFolder');
// Gallery Image Controllers
const uploadGalleryImage = async (req, res) => {
    try {
        // Check if file exists
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        // Check if alt text is provided
        if (!req.body.alt) {
            return res.status(400).json({
                success: false,
                message: "Alt text is required"
            });
        }

        // Upload to Cloudinary
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            return res.status(500).json({
                success: false,
                message: "Error uploading image to cloud storage"
            });
        }

        // Create gallery image
        const galleryImage = await GalleryImage.create({
            image: {
                url: uploadResult.url,
                public_id: uploadResult.public_id
            },
            alt: req.body.alt
        });
        await emptyTempFolder();
        return res.status(201).json({
            success: true,
            data: galleryImage,
            message: "Gallery image uploaded successfully"
        });
    } catch (error) {
        console.error("Error in uploadGalleryImage: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllGalleryImages = async (req, res) => {
    try {
        const images = await GalleryImage.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            data: images,
            message: "Gallery images fetched successfully"
        });
    } catch (error) {
        console.error("Error in getAllGalleryImages: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

// Instagram Image Controllers
const uploadInstagramImage = async (req, res) => {
    try {
        console.log("Request body:", req.body);
        console.log("Request file:", req.file);
        console.log("upload instagram called")
        // Validate required fields
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Image file is required"
            });
        }

        if (!req.body.alt) {
            return res.status(400).json({
                success: false,
                message: "Alt text is required"
            });
        }

        if (!req.body.link) {
            return res.status(400).json({
                success: false,
                message: "Instagram link is required"
            });
        }

        // Basic URL validation
        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(req.body.link)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Instagram link format"
            });
        }

        // Upload to Cloudinary
        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            return res.status(500).json({
                success: false,
                message: "Error uploading image to cloud storage"
            });
        }

        // Create Instagram image
        const instagramImage = await InstagramImage.create({
            image: {
                url: uploadResult.url,
                public_id: uploadResult.public_id
            },
            alt: req.body.alt,
            link: req.body.link
        });

        return res.status(201).json({
            success: true,
            data: instagramImage,
            message: "Instagram image uploaded successfully"
        });
    } catch (error) {
        console.error("Error in uploadInstagramImage: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const getAllInstagramImages = async (req, res) => {
    try {
        const images = await InstagramImage.find().sort({ createdAt: -1 });
        
        return res.status(200).json({
            success: true,
            data: images,
            message: "Instagram images fetched successfully"
        });
    } catch (error) {
        console.error("Error in getAllInstagramImages: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    uploadGalleryImage,
    getAllGalleryImages,
    uploadInstagramImage,
    getAllInstagramImages
};