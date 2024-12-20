const mongoose = require('mongoose');

const parkingSlotSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a parking slot title'],
        trim: true,
        maxLength: [100, 'Parking slot title cannot exceed 100 characters']
    },
    subtitle: {
        type: String,
        required: [true, 'Please provide a parking slot subtitle'],
        trim: true,
        maxLength: [200, 'Parking slot subtitle cannot exceed 200 characters']
    },
    facilities: [{
        type: String,
        required: [true, 'Please specify parking facilities']
    }],
    description: {
        type: String,
        required: [true, 'Please provide a parking slot description'],
        trim: true
    },
    totalSlots: {
        type: Number,
        required: [true, 'Please specify total number of parking slots'],
        min: [1, 'Total parking slots must be at least 1']
    },
    availableSlots: {
        type: Number,
        required: [true, 'Please specify number of available parking slots'],
        validate: {
            validator: function(value) {
                return value <= this.totalSlots;
            },
            message: 'Available slots cannot exceed total slots'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ParkingSlot', parkingSlotSchema);