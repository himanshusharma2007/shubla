const Room = require("../model/roomsModel");

exports.createRoom = async (req, res) => {
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
      pricing,
    } = req.body;
    console.log(req.body)
    // Enhanced input validation
    if (
      !title ||
      !subtitle ||
      !facilities ||
      !description ||
      !totalRooms ||
      !availableRooms ||
      !roomType ||
      !capacity ||
      !features ||
      !pricing
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate room type
    if (!["master", "kids"].includes(roomType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type. Must be either 'master' or 'kids'",
      });
    }

    // Validate capacity
    if (capacity > 4) {
      return res.status(400).json({
        success: false,
        message: "Room capacity cannot exceed 4 people",
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
        numberOfBeds: features.numberOfBeds,
      },
      pricing,
    };

    const newRoom = new Room(roomData);
    await newRoom.save();

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating room",
      error: error.message,
    });
  }
};

exports.updateRoom = async (req, res) => {
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
      pricing,
    } = req.body;

    // Enhanced input validation
    if (
      !title ||
      !subtitle ||
      !facilities ||
      !description ||
      !totalRooms ||
      !availableRooms ||
      !roomType ||
      !capacity ||
      !features ||
      !pricing
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Validate room type
    if (!["master", "kids"].includes(roomType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid room type. Must be either 'master' or 'kids'",
      });
    }

    // Validate capacity
    if (capacity > 4) {
      return res.status(400).json({
        success: false,
        message: "Room capacity cannot exceed 4 people",
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
        numberOfBeds: features.numberOfBeds,
      },
      pricing,
    };

    // Check if the room exists
    const existingRoom = await Room.findOne({ _id: req.params.id });

    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    const updatedRoom = await Room.findOneAndUpdate(
      { _id: req.params.id },
      { $set: roomData },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room: updatedRoom,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating room",
      error: error.message,
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
