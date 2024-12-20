const Camp = require('../model/campsModel');

exports.updateOrCreateCampsData = async (req, res) => {
    try {
        const { 
            title, 
            subtitle, 
            facilities, 
            description, 
            totalCamps, 
            availableCamps 
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || !totalCamps || !availableCamps) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (totalCamps < 1) {
            return res.status(400).json({
                success: false,
                message: "Total camps must be at least 1"
            });
        }

        if (availableCamps > totalCamps) {
            return res.status(400).json({
                success: false,
                message: "Available camps cannot exceed total camps"
            });
        }

        if (!Array.isArray(facilities) || facilities.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Facilities must be a non-empty array"
            });
        }

        // Check if the camp already exists
        const existingCamp = await Camp.findOne({ title });

        if (existingCamp) {
            // Update the existing camp data
            const updatedCamp = await Camp.findOneAndUpdate(
                { title },
                {
                    $set: {
                        subtitle,
                        facilities,
                        description,
                        totalCamps,
                        availableCamps
                    }
                },
                {
                    new: true, // Return the updated document
                    runValidators: true
                }
            );

            return res.status(200).json({
                success: true,
                message: "Camp updated successfully",
                camp: updatedCamp
            });
        } else {
            // Create a new camp document
            const newCamp = new Camp({
                title,
                subtitle,
                facilities,
                description,
                totalCamps,
                availableCamps
            });

            await newCamp.save();

            return res.status(201).json({
                success: true,
                message: "Camp created successfully",
                camp: newCamp
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating or creating camp",
            error: error.message
        });
    }
};


exports.getCampsData = async (req, res) => {
    try {
        // Find the most recent camp document
        // Since all camps have the same data, we only need to fetch one
        const campData = await Camp.findOne()
            .select('title subtitle facilities description totalCamps availableCamps')
            .sort({ createdAt: -1 });

        if (!campData) {
            return res.status(404).json({
                success: false,
                message: "No camp data found"
            });
        }

        res.status(200).json({
            success: true,
            campData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching camp data",
            error: error.message
        });
    }
};
