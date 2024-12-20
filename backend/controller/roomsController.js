const Room = require('../model/roomsModel');



exports.updateOrCreateRoomsData = async (req, res) => {
    try {
        console.log('req.body in update or create rooms', req.body);
        const { 
            title, 
            subtitle, 
            facilities, 
            description, 
            totalRooms, 
            availableRooms 
        } = req.body;

        // Input validation
        if (!title || !subtitle || !facilities || !description || !totalRooms || !availableRooms) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (totalRooms < 1) {
            return res.status(400).json({
                success: false,
                message: "Total rooms must be at least 1"
            });
        }

        if (availableRooms > totalRooms) {
            return res.status(400).json({
                success: false,
                message: "Available rooms cannot exceed total rooms"
            });
        }

        if (!Array.isArray(facilities) || facilities.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Facilities must be a non-empty array"
            });
        }

        // Check if the room already exists
        const existingRoom = await Room.findOne({ title });

        if (existingRoom) {
            // Update the existing room data
            const updatedRoom = await Room.findOneAndUpdate(
                { title },
                {
                    $set: {
                        subtitle,
                        facilities,
                        description,
                        totalRooms,
                        availableRooms
                    }
                },
                {
                    new: true, // Return the updated document
                    runValidators: true
                }
            );

            return res.status(200).json({
                success: true,
                message: "Room updated successfully",
                room: updatedRoom
            });
        } else {
            // Create a new room document
            const newRoom = new Room({
                title,
                subtitle,
                facilities,
                description,
                totalRooms,
                availableRooms
            });

            await newRoom.save();

            return res.status(201).json({
                success: true,
                message: "Room created successfully",
                room: newRoom
            });
        }
    } catch (error) {
        console.log('error', error);
        res.status(500).json({
            success: false,
            message: "Error updating or creating room",
            error: error.message
        });
    }
};

exports.getRoomsData = async (req, res) => {
    try {
        // Find the most recent room document
        // Since all rooms have the same data, we only need to fetch one
        const roomData = await Room.findOne()
            .select('title subtitle facilities description totalRooms availableRooms')
            .sort({ createdAt: -1 });

        if (!roomData) {
            return res.status(404).json({
                success: false,
                message: "No room data found"
            });
        }

        res.status(200).json({
            success: true,
            roomData
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching room data",
            error: error.message
        });
    }
};