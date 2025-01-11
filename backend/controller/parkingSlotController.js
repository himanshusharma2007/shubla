const ParkingSlot = require('../model/parkingSlotModel');

// parkingSlotController.js
// Function to create a new parking slot
exports.createParkingSlot = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            facilities,
            description,
            totalSlots,
            availableSlots,
            dimension,
            pricing,
            amenities
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || 
            !totalSlots || !availableSlots || !dimension || 
            !pricing || !amenities) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate pricing structure
        if (!pricing.weekday || !pricing.weekend) {
            return res.status(400).json({
                success: false,
                message: "Both weekday and weekend pricing must be specified"
            });
        }

        // Validate dimensions (10x10 meters requirement)
        if (dimension.width !== 10 || dimension.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Parking slot dimensions must be 10x10 meters"
            });
        }

        // Validate required amenities
        const requiredAmenities = ['electricity', 'water', 'sanitation'];
        const missingAmenities = requiredAmenities.filter(amenity => !amenities[amenity]);

        if (missingAmenities.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required amenities: ${missingAmenities.join(', ')}`
            });
        }

        // Create parking slot
        const parkingSlot = await ParkingSlot.create({
            title,
            subtitle,
            facilities,
            description,
            totalSlots,
            availableSlots,
            dimension,
            pricing: {
                weekday: 200, // Fixed price as per client requirement
                weekend: 250  // Fixed price as per client requirement
            },
            amenities
        });

        res.status(201).json({
            success: true,
            message: "Parking slot created successfully",
            parkingSlot
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating parking slot",
            error: error.message
        });
    }
};

// Function to update an existing parking slot
exports.updateParkingSlot = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            facilities,
            description,
            totalSlots,
            availableSlots,
            dimension,
            pricing,
            amenities
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || 
            !totalSlots || !availableSlots || !dimension || 
            !pricing || !amenities) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate pricing structure
        if (!pricing.weekday || !pricing.weekend) {
            return res.status(400).json({
                success: false,
                message: "Both weekday and weekend pricing must be specified"
            });
        }

        // Validate dimensions (10x10 meters requirement)
        if (dimension.width !== 10 || dimension.length !== 10) {
            return res.status(400).json({
                success: false,
                message: "Parking slot dimensions must be 10x10 meters"
            });
        }

        // Validate required amenities
        const requiredAmenities = ['electricity', 'water', 'sanitation'];
        const missingAmenities = requiredAmenities.filter(amenity => !amenities[amenity]);

        if (missingAmenities.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing required amenities: ${missingAmenities.join(', ')}`
            });
        }

        // Update parking slot
        const parkingSlot = await ParkingSlot.findOneAndUpdate(
            {_id: req.params.id },
            {
                $set: {
                    title,
                    subtitle,
                    facilities,
                    description,
                    totalSlots,
                    availableSlots,
                    dimension,
                    pricing: {
                        weekday: 200, // Fixed price as per client requirement
                        weekend: 250  // Fixed price as per client requirement
                    },
                    amenities
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!parkingSlot) {
            return res.status(404).json({
                success: false,
                message: "Parking slot not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Parking slot updated successfully",
            parkingSlot
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating parking slot",
            error: error.message
        });
    }
};

exports.getParkingData = async (req, res) => {
    try {
        // Find the most recent parking slot document
        // Since all slots have the same data, we only need to fetch one
        const parkingData = await ParkingSlot.findOne().sort({ createdAt: -1 });

        if (!parkingData) {
            return res.status(404).json({
                success: false,
                message: "No parking slot data found"
            });
        }

        res.status(200).json({
            success: true,
            parkingData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching parking slot data",
            error: error.message
        });
    }
};
