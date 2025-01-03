const ParkingSlot = require('../model/parkingSlotModel');

// parkingSlotController.js
exports.updateOrCreateParkingData = async (req, res) => {
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

        const parkingData = {
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
        };

        // Use findOneAndUpdate with upsert
        const parkingSlot = await ParkingSlot.findOneAndUpdate(
            { title },
            { $set: parkingData },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        const message = parkingSlot.isNew ? 
            "Parking slot created successfully" : 
            "Parking slot updated successfully";

        res.status(parkingSlot.isNew ? 201 : 200).json({
            success: true,
            message,
            parkingSlot
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating or creating parking slot",
            error: error.message
        });
    }
};

exports.getParkingData = async (req, res) => {
    try {
        // Find the most recent parking slot document
        // Since all slots have the same data, we only need to fetch one
        const parkingData = await ParkingSlot.findOne()
            .select('title subtitle facilities description totalSlots availableSlots')
            .sort({ createdAt: -1 });

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
