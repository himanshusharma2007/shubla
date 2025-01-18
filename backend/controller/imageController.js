const fs = require('fs');
const path = require('path');
const { GalleryImage, InstagramImage } = require("../model/imageModel");
const {
  uploadOnCloudinary,
  deleteOnCloudinary,
} = require("../utils/cloudinary");
const emptyTempFolder = require("../utils/emptyTempFolder");


// Existing functions remain the same...
const ensureTempDir = () => {
    try {
        // Get absolute path to temp directory
        const tempDir = path.resolve(__dirname, '..', 'temp');
        console.log('Temp directory path:', tempDir);
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(tempDir)) {
            console.log('Creating temp directory...');
            fs.mkdirSync(tempDir, { recursive: true });
            console.log('Temp directory created successfully');
        } else {
            console.log('Temp directory already exists');
        }
        
        // Ensure directory has proper permissions
        fs.chmodSync(tempDir, '777');
        console.log('Temp directory permissions updated');
        
        return tempDir;
    } catch (error) {
        console.error('Error in ensureTempDir:', error);
        throw error;
    }
};
const uploadGalleryImage = async (req, res) => {
  try {
    console.log("Starting uploadGalleryImage function...");
    ensureTempDir();
    // Check if file is provided
    if (!req.file) {
      console.log("No image file provided in the request");
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }
    console.log("Image file received:", req.file);

    // Check if alt text is provided
    if (!req.body.alt) {
      console.log("No alt text provided in the request");
      return res.status(400).json({
        success: false,
        message: "Alt text is required",
      });
    }
    console.log("Alt text received:", req.body.alt);

    // Upload image to cloud storage
    console.log("Uploading image to cloud storage...");
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      console.log("Error while uploading image to cloud storage");
      return res.status(500).json({
        success: false,
        message: "Error uploading image to cloud storage",
      });
    }
    console.log("Image uploaded to cloud storage successfully:", uploadResult);

    // Save gallery image to the database
    console.log("Saving image details to the database...");
    const galleryImage = await GalleryImage.create({
      image: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
      alt: req.body.alt,
    });
    console.log("Image details saved to database:", galleryImage);

    // Empty temporary folder
    console.log("Emptying temporary folder...");
    await emptyTempFolder();
    console.log("Temporary folder emptied successfully");

    return res.status(201).json({
      success: true,
      data: galleryImage,
      message: "Gallery image uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadGalleryImage: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllGalleryImages = async (req, res) => {
  try {
    const images = await GalleryImage.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: images,
      message: "Gallery images fetched successfully",
    });
  } catch (error) {
    console.error("Error in getAllGalleryImages: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
const uploadInstagramImage = async (req, res) => {
  try {
    console.log("Starting uploadInstagramImage function...");
    ensureTempDir();
    // Check if file is provided
    if (!req.file) {
      console.log("No image file provided in the request");
      return res.status(400).json({
        success: false,
        message: "Image file is required",
      });
    }
    console.log("Image file received:", req.file);

    // Check if alt text is provided
    if (!req.body.alt) {
      console.log("No alt text provided in the request");
      return res.status(400).json({
        success: false,
        message: "Alt text is required",
      });
    }
    console.log("Alt text received:", req.body.alt);

    // Check if Instagram link is provided
    if (!req.body.link) {
      console.log("No Instagram link provided in the request");
      return res.status(400).json({
        success: false,
        message: "Instagram link is required",
      });
    }
    console.log("Instagram link received:", req.body.link);

    // Validate Instagram link format
    const urlPattern = /^https?:\/\/.+/i;
    if (!urlPattern.test(req.body.link)) {
      console.log("Invalid Instagram link format:", req.body.link);
      return res.status(400).json({
        success: false,
        message: "Invalid Instagram link format",
      });
    }
    console.log("Instagram link format validated successfully");

    // Upload image to cloud storage
    console.log("Uploading image to cloud storage...");
    const uploadResult = await uploadOnCloudinary(req.file.path);
    if (!uploadResult) {
      console.log("Error while uploading image to cloud storage");
      return res.status(500).json({
        success: false,
        message: "Error uploading image to cloud storage",
      });
    }
    console.log("Image uploaded to cloud storage successfully:", uploadResult);

    // Save Instagram image details to the database
    console.log("Saving Instagram image details to the database...");
    const instagramImage = await InstagramImage.create({
      image: {
        url: uploadResult.url,
        public_id: uploadResult.public_id,
      },
      alt: req.body.alt,
      link: req.body.link,
    });
    console.log("Instagram image details saved to database:", instagramImage);

    return res.status(201).json({
      success: true,
      data: instagramImage,
      message: "Instagram image uploaded successfully",
    });
  } catch (error) {
    console.error("Error in uploadInstagramImage: ", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

const getAllInstagramImages = async (req, res) => {
  try {
    const images = await InstagramImage.find().sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: images,
      message: "Instagram images fetched successfully",
    });
  } catch (error) {
    console.error("Error in getAllInstagramImages: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
        message: "Gallery image not found",
      });
    }

    // Delete from Cloudinary
    await deleteOnCloudinary(image.image.public_id);

    // Delete from database
    await GalleryImage.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Gallery image deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteGalleryImage: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
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
        message: "Instagram image not found",
      });
    }

    // Delete from Cloudinary
    await deleteOnCloudinary(image.image.public_id);

    // Delete from database
    await InstagramImage.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Instagram image deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteInstagramImage: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadGalleryImage,
  getAllGalleryImages,
  uploadInstagramImage,
  getAllInstagramImages,
  deleteGalleryImage,
  deleteInstagramImage,
};
