const ParkingSlot = require('../model/parkingSlotModel');

exports.updateOrCreateParkingData = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            facilities,
            description,
            totalSlots,
            availableSlots,
            price
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || !totalSlots || !availableSlots || !price) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (totalSlots < 1) {
            return res.status(400).json({
                success: false,
                message: "Total parking slots must be at least 1"
            });
        }

        if (availableSlots > totalSlots) {
            return res.status(400).json({
                success: false,
                message: "Available slots cannot exceed total slots"
            });
        }

        if (!Array.isArray(facilities) || facilities.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Facilities must be a non-empty array"
            });
        }

        // Use upsert to update or create a new document
        const result = await ParkingSlot.updateOne(
            {}, // empty filter to target any document or create if none exists
            {
                $set: {
                    title,
                    subtitle,
                    facilities,
                    description,
                    totalSlots,
                    availableSlots,
                    price
                }
            },
            {
                upsert: true, // Create a new document if none exists
                runValidators: true // Ensures data validation
            }
        );

        // Response handling
        if (result.matchedCount === 0 && result.upsertedCount === 1) {
            return res.status(201).json({
                success: true,
                message: "Parking slot created successfully"
            });
        }

        res.status(200).json({
            success: true,
            message: "Parking slot updated successfully"
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
