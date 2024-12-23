const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { checkAdmin } = require("../middleware/checkAdmin");
const { updateOrCreateParkingData, getParkingData } = require('../controller/parkingSlotController');

// Validation middleware
const parkingValidation = [
    check('title')
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title cannot exceed 100 characters'),
    check('subtitle')
        .notEmpty()
        .withMessage('Subtitle is required')
        .isLength({ max: 200 })
        .withMessage('Subtitle cannot exceed 200 characters'),
    check('facilities')
        .isArray()
        .withMessage('Facilities must be an array')
        .notEmpty()
        .withMessage('At least one facility is required'),
    check('description')
        .notEmpty()
        .withMessage('Description is required'),
    check('totalSlots')
        .notEmpty()
        .withMessage('Total slots is required')
        .isInt({ min: 1 })
        .withMessage('Total slots must be at least 1'),
    check('availableSlots')
        .notEmpty()
        .withMessage('Available slots is required')
        .isInt({ min: 0 })
        .withMessage('Available slots cannot be negative')
        .custom((value, { req }) => {
            if (value > req.body.totalSlots) {
                throw new Error('Available slots cannot exceed total slots');
            }
            return true;
        })
];

// Routes
router.route('/update')
    .put(
        checkAdmin,
        parkingValidation,
        updateOrCreateParkingData
    );

router.route('/')
    .get(getParkingData);

module.exports = router;