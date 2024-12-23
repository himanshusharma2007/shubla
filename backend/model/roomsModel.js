const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a room title'],
        trim: true,
        maxLength: [100, 'Room title cannot exceed 100 characters']
    },
    subtitle: {
        type: String,
        required: [true, 'Please provide a room subtitle'],
        trim: true,
        maxLength: [200, 'Room subtitle cannot exceed 200 characters']
    },
    facilities: [{
        type: String,
        required: [true, 'Please specify room facilities']
    }],
    description: {
        type: String,
        required: [true, 'Please provide a room description'],
        trim: true
    },
    totalRooms: {
        type: Number,
        required: [true, 'Please specify total number of rooms'],
        min: [1, 'Total rooms must be at least 1']
    },
    availableRooms: {
        type: Number,
        required: [true, 'Please specify number of available rooms'],
    },
    price: {
        type: Number,
        required: [true, 'Please specify room price'],
        min: [1, 'Room price must be at least 1']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Room', roomSchema);