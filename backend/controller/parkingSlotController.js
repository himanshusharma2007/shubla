const ParkingSlot = require('../model/parkingSlotModel');

exports.updateParkingData = async (req, res) => {
    try {
        const { 
            title, 
            subtitle, 
            facilities, 
            description, 
            totalSlots, 
            availableSlots 
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || !totalSlots || !availableSlots) {
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

        // Update all parking slots with the new data
        const updatedSlots = await ParkingSlot.updateMany(
            {},  // empty filter to update all documents
            {
                $set: {
                    title,
                    subtitle,
                    facilities,
                    description,
                    totalSlots,
                    availableSlots
                }
            },
            { 
                new: true,
                runValidators: true 
            }
        );

        if (updatedSlots.matchedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "No parking slots found to update"
            });
        }

        res.status(200).json({
            success: true,
            message: "All parking slots updated successfully",
            modifiedCount: updatedSlots.modifiedCount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating parking slots",
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
