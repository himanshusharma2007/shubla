// controllers/bookingController.js
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Camp = require('../models/Camp');
const ParkingSlot = require('../models/ParkingSlot');
const sendEmail = require('../utils/sendEmail');

// Utility function to update service availability
const updateServiceAvailability = async (serviceType) => {
    let ServiceModel;
    switch (serviceType) {
        case 'room':
            ServiceModel = Room;
            break;
        case 'camp':
            ServiceModel = Camp;
            break;
        case 'parking':
            ServiceModel = ParkingSlot;
            break;
        default:
            throw new Error('Invalid service type');
    }

    // Get current service data
    const service = await ServiceModel.findOne().sort({ createdAt: -1 });
    if (!service) {
        throw new Error('Service not found');
    }

    // Get all active bookings for this service type
    const activeBookings = await Booking.find({
        serviceType,
        status: { $in: ['pending', 'confirmed'] },
        checkOut: { $gt: new Date() }
    });

    // Calculate total booked quantity
    const bookedQuantity = activeBookings.reduce((total, booking) => total + booking.quantity, 0);

    // Update available quantity
    const availableQuantity = service[`total${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}s`] - bookedQuantity;

    // Update the service document
    await ServiceModel.updateMany(
        {},
        {
            $set: {
                [`available${serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}s`]: availableQuantity
            }
        }
    );

    return availableQuantity;
};

// Utility function to send booking notifications
const sendBookingNotifications = async (booking, user) => {
    // Email to user
    const userSubject = "Booking Confirmation - Shubla";
    const userMessage = `
        <h2>Booking Confirmed!</h2>
        <p>Dear ${user.name},</p>
        <p>Your booking has been confirmed. Here are the details:</p>
        <ul>
            <li>Service: ${booking.serviceType.charAt(0).toUpperCase() + booking.serviceType.slice(1)}</li>
            <li>Quantity: ${booking.quantity}</li>
            <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
            <li>Check-out: ${new Date(booking.checkOut).toLocaleString()}</li>
            <li>Total Amount: $${booking.totalAmount}</li>
        </ul>
        <p>Thank you for choosing our services!</p>
        <p>Best regards,</p>
        <p>Shubla Team</p>
    `;

    // Email to admin
    const adminSubject = "New Booking Alert - Shubla";
    const adminMessage = `
        <h2>New Booking Received</h2>
        <p><strong>Booking Details:</strong></p>
        <ul>
            <li>Service: ${booking.serviceType}</li>
            <li>Quantity: ${booking.quantity}</li>
            <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
            <li>Check-out: ${new Date(booking.checkOut).toLocaleString()}</li>
            <li>Total Amount: $${booking.totalAmount}</li>
        </ul>
        <p><strong>Customer Details:</strong></p>
        <ul>
            <li>Name: ${user.name}</li>
            <li>Email: ${user.email}</li>
        </ul>
    `;

    // Send emails
    await Promise.all([
        sendEmail(user.email, userSubject, userMessage),
        sendEmail(process.env.ADMIN_EMAIL, adminSubject, adminMessage)
    ]);
};

// Enhanced createBooking controller
exports.createBooking = async (req, res) => {
    try {
        const { serviceType, quantity, checkIn, checkOut } = req.body;
        const user = req.user; // Assuming user is authenticated

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        
        if (checkInDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Check-in time cannot be in the past"
            });
        }

        // Check availability
        const availability = await checkAvailability(
            serviceType,
            quantity,
            checkInDate,
            checkOutDate
        );

        if (!availability.available) {
            return res.status(400).json({
                success: false,
                message: `Only ${availability.availableQuantity} ${serviceType}(s) available for the selected period`
            });
        }

        // Calculate total amount
        const duration = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
        const totalAmount = quantity * availability.price * duration;

        // Create booking
        const booking = await Booking.create({
            user: user._id,
            serviceType,
            quantity,
            checkIn: checkInDate,
            checkOut: checkOutDate,
            totalAmount,
            status: 'confirmed', // Auto-confirm for now
            paymentStatus: 'pending'
        });

        // Update service availability
        await updateServiceAvailability(serviceType);

        // Send notifications
        await sendBookingNotifications(booking, user);

        res.status(201).json({
            success: true,
            message: "Booking confirmed successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating booking",
            error: error.message
        });
    }
};

// Enhanced updateBookingStatus controller
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name email');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        const oldStatus = booking.status;
        booking.status = status;
        await booking.save();

        // Update service availability if status changed
        if (oldStatus !== status) {
            await updateServiceAvailability(booking.serviceType);
        }

        // Send status update notification to user
        const subject = `Booking Status Updated - EJUUZ`;
        const message = `
            <h2>Booking Status Update</h2>
            <p>Dear ${booking.user.name},</p>
            <p>Your booking status has been updated to: ${status}</p>
            <p>Booking Details:</p>
            <ul>
                <li>Service: ${booking.serviceType}</li>
                <li>Check-in: ${new Date(booking.checkIn).toLocaleString()}</li>
                <li>Check-out: ${new Date(booking.checkOut).toLocaleString()}</li>
            </ul>
        `;
        await sendEmail(booking.user.email, subject, message);

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating booking status",
            error: error.message
        });
    }
};

// Add automated cleanup for expired bookings
const cleanupExpiredBookings = async () => {
    try {
        const expiredBookings = await Booking.find({
            status: { $in: ['pending', 'confirmed'] },
            checkOut: { $lt: new Date() }
        });

        for (const booking of expiredBookings) {
            booking.status = 'completed';
            await booking.save();
            await updateServiceAvailability(booking.serviceType);
        }
    } catch (error) {
        console.error('Error in cleanup:', error);
    }
};

// Run cleanup every hour
setInterval(cleanupExpiredBookings, 60 * 60 * 1000);

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message
        });
    }
};

// Get all bookings (admin only)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching bookings",
            error: error.message
        });
    }
};

// Update booking status
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found"
            });
        }

        booking.status = status;
        await booking.save();

        // If booking is completed, update service availability
        if (status === 'completed') {
            // The availability will automatically update based on new bookings
            // and their check-in/check-out times
        }

        res.status(200).json({
            success: true,
            message: "Booking status updated successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating booking status",
            error: error.message
        });
    }
};