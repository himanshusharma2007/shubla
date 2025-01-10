const Camp = require('../model/campsModel');

// Function to create a new camp
exports.createCamp = async (req, res) => {
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
            price
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || 
            !totalCamps || !availableCamps || !tentType || 
            !capacity || !dimension || !price) {
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

        // Create camp
        const camp = await Camp.create({
            title,
            subtitle,
            facilities,
            description,
            totalCamps,
            availableCamps,
            tentType,
            capacity,
            dimension,
            price
        });

        res.status(201).json({
            success: true,
            message: "Camp created successfully",
            camp
        });
    } catch (error) {
        console.error("Error in createCamp:", error);
        res.status(500).json({
            success: false,
            message: "Error creating camp",
            error: error.message
        });
    }
};

// Function to update an existing camp
exports.updateCamp = async (req, res) => {
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
            price
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || 
            !totalCamps || !availableCamps || !tentType || 
            !capacity || !dimension || !price) {
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

        // Update camp
        const camp = await Camp.findOneAndUpdate(
            {_id: req.params.id },
            {
                $set: {
                    title,
                    subtitle,
                    facilities,
                    description,
                    totalCamps,
                    availableCamps,
                    tentType,
                    capacity,
                    dimension,
                    price
                }
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!camp) {
            return res.status(404).json({
                success: false,
                message: "Camp not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Camp updated successfully",
            camp
        });
    } catch (error) {
        console.error("Error in updateCamp:", error);
        res.status(500).json({
            success: false,
            message: "Error updating camp",
            error: error.message
        });
    }
};



exports.getCampsData = async (req, res) => {
    try {
        // Find the most recent camp document
        // Since all camps have the same data, we only need to fetch one
        const campData = await Camp.findOne()
            .select('title subtitle facilities description totalCamps availableCampsn pricing availableCamps')
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
