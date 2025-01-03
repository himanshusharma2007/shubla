const Camp = require('../model/campsModel');

exports.updateOrCreateCampsData = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            facilities,
            description,
            totalCamps,
            availableCamps,
            tentType,
            capacity,
            dimension,
            pricing
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || 
            !totalCamps || !availableCamps || !tentType || 
            !capacity || !dimension || !pricing) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        // Validate tent type
        if (tentType !== 'bedouin') {
            return res.status(400).json({
                success: false,
                message: "Only Bedouin style tents are supported"
            });
        }

        // Validate capacity
        if (capacity > 16) {
            return res.status(400).json({
                success: false,
                message: "Tent capacity cannot exceed 16 people"
            });
        }

        const campData = {
            title,
            subtitle,
            facilities,
            description,
            totalCamps,
            availableCamps,
            tentType,
            capacity,
            dimension,
            pricing
        };

        // Use findOneAndUpdate with upsert
        const camp = await Camp.findOneAndUpdate(
            { title },
            { $set: campData },
            {
                new: true,
                upsert: true,
                runValidators: true
            }
        );

        const message = camp.isNew ? "Camp created successfully" : "Camp updated successfully";

        res.status(camp.isNew ? 201 : 200).json({
            success: true,
            message,
            camp
        });

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
