const Room = require("../model/roomsModel");

exports.updateOrCreateRoomsData = async (req, res) => {
  try {
      const {
          title,
          subtitle,
          facilities,
          description,
          totalRooms,
          availableRooms,
          roomType,
          capacity,
          features,
          price
      } = req.body;

      // Enhanced input validation
      if (!title || !subtitle || !facilities || !description || 
          !totalRooms || !availableRooms || !roomType || 
          !capacity || !features || !price) {
          return res.status(400).json({
              success: false,
              message: "All fields are required"
          });
      }

      // Validate room type
      if (!['master', 'kids'].includes(roomType)) {
          return res.status(400).json({
              success: false,
              message: "Invalid room type. Must be either 'master' or 'kids'"
          });
      }

      // Validate capacity
      if (capacity > 4) {
          return res.status(400).json({
              success: false,
              message: "Room capacity cannot exceed 4 people"
          });
      }

    

      const roomData = {
          title,
          subtitle,
          facilities,
          description,
          totalRooms,
          availableRooms,
          roomType,
          capacity,
          features: {
              hasAttachedBathroom: features.hasAttachedBathroom || false,
              numberOfBeds: features.numberOfBeds
          },
          price
      };

      // Check if the room already exists
      const existingRoom = await Room.findOne({ title });

      if (existingRoom) {
          const updatedRoom = await Room.findOneAndUpdate(
              { title },
              { $set: roomData },
              { new: true, runValidators: true }
          );

          return res.status(200).json({
              success: true,
              message: "Room updated successfully",
              room: updatedRoom
          });
      }

      const newRoom = new Room(roomData);
      await newRoom.save();

      return res.status(201).json({
          success: true,
          message: "Room created successfully",
          room: newRoom
      });

  } catch (error) {
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
      .select("title subtitle facilities description totalRooms availableRooms")
      .sort({ createdAt: -1 });

    if (!roomData) {
      return res.status(404).json({
        success: false,
        message: "No room data found",
      });
    }

    res.status(200).json({
      success: true,
      roomData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching room data",
      error: error.message,
    });
  }
};
