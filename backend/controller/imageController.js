const { GalleryImage, InstagramImage } = require('../model/imageModel');
const { uploadOnCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');
const emptyTempFolder = require('../utils/emptyTempFolder');

// Existing functions remain the same...
const uploadGalleryImage = async (req, res) => {
    try {
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

        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            return res.status(500).json({
                success: false,
                message: "Error uploading image to cloud storage"
            });
        }

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

const uploadInstagramImage = async (req, res) => {
    try {
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

        const urlPattern = /^https?:\/\/.+/i;
        if (!urlPattern.test(req.body.link)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Instagram link format"
            });
        }

        const uploadResult = await uploadOnCloudinary(req.file.path);
        if (!uploadResult) {
            return res.status(500).json({
                success: false,
                message: "Error uploading image to cloud storage"
            });
        }

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

// New delete functions
const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the image
        const image = await GalleryImage.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Gallery image not found"
            });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(image.image.public_id);

        // Delete from database
        await GalleryImage.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Gallery image deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteGalleryImage: ", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

const deleteInstagramImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the image
        const image = await InstagramImage.findById(id);
        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Instagram image not found"
            });
        }

        // Delete from Cloudinary
        await deleteFromCloudinary(image.image.public_id);

        // Delete from database
        await InstagramImage.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Instagram image deleted successfully"
        });
    } catch (error) {
        console.error("Error in deleteInstagramImage: ", error);
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
    getAllInstagramImages,
    deleteGalleryImage,
    deleteInstagramImage
};