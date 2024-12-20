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
} = require("../controller/imageController");

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

// Gallery Image Routes
router.post(
  "/gallery",
  checkAdmin,
  upload.single("image"),
  galleryImageValidation,
  uploadGalleryImage
);

router.get("/gallery", getAllGalleryImages);

// Instagram Image Routes
router.post(
  "/instagram",
  checkAdmin,
  upload.single("image"),  // Direct middleware usage like in gallery route
  instagramImageValidation,
  uploadInstagramImage
);


router.get("/instagram", getAllInstagramImages);

module.exports = router;
