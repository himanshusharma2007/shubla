const express = require("express");
const router = express.Router();
const { body } = require("express-validator");
const upload = require("../middleware/multer");
const { checkAuth } = require("../middleware/checkAuth");
const { checkAdmin } = require("../middleware/checkAdmin");
const {
  uploadGalleryImage,
  getAllGalleryImages,
  uploadInstagramImage,
  getAllInstagramImages,
  deleteGalleryImage,
  deleteInstagramImage,
} = require("../controller/imageController");
const fs = require('fs');
const path = require('path');
// Validation middleware
const galleryImageValidation = [body("alt").trim()];

const instagramImageValidation = [
  body("alt").trim(),
  body("link")
    .trim()
    .notEmpty()
    .withMessage("Instagram link is required")
    .isURL()
    .withMessage("Invalid Instagram link format"),
];
const ensureTempDir = (req, res, next) => {
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
      
      next();
  } catch (error) {
      console.error('Error in ensureTempDir:', error);
      throw error;
  }
};
// Gallery Image Routes
router.post(
  "/gallery",
  checkAdmin,
  ensureTempDir,
  upload.single("image"),
  galleryImageValidation,
  uploadGalleryImage
);

router.get("/gallery", getAllGalleryImages);

// Instagram Image Routes
router.post(
  "/instagram",
  checkAdmin,
  ensureTempDir,
  upload.single("image"), 
  // Direct middleware usage like in gallery route
  instagramImageValidation,
  uploadInstagramImage
);

router.get("/instagram", getAllInstagramImages);
router.delete("/gallery/:id", deleteGalleryImage);
router.delete("/instagram/:id", deleteInstagramImage);
module.exports = router;
