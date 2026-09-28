const Booking = require('../models/Booking.js');
const OTP = require('../models/OTP');
const Event = require('../models/Event');
const User = require('../models/User');

const {
    sendOTPEmail,
    sendBookingEmail,
    sendBookingRejectedEmail
} = require('../utils/email');


// Generate 6 digit OTP
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};


// =====================================================
// SEND BOOKING OTP
// =====================================================

exports.sendBookingOTP = async (req, res) => {
    try {

        const { email } = req.body;

        console.log("Booking OTP request received");
        console.log("Email:", email);

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const otp = generateOtp();

        console.log("Generated OTP:", otp);

        await OTP.findOneAndDelete({
            email,
            action: "booking_verification"
        });

        await OTP.create({
            email,
            otp,
            action: "booking_verification"
        });

        console.log("OTP saved in database");

        await sendBookingEmail(
            email,
            otp,
            "booking_verification"
        );

        console.log("OTP email sent successfully");

        res.json({
            message: "Booking email sent successfully"
        });

    } catch (error) {

        console.error("SEND BOOKING OTP ERROR:", error);

        res.status(500).json({
            error: "Failed to send booking OTP",
            message: error.message
        });
    }
};


// =====================================================
// CREATE BOOKING
// =====================================================

exports.bookEvent = async (req, res) => {

    try {

        const {
            eventId,
            otp,
            numberOfPeople
        } = req.body;


        // ---------------------------------------------
        // Validate number of people
        // ---------------------------------------------

        const people = Number(numberOfPeople);

        if (!Number.isInteger(people) || people < 1) {

            return res.status(400).json({
                error: "Number of tickets must be at least 1"
            });

        }


        // ---------------------------------------------
        // Verify OTP
        // ---------------------------------------------

        const otpRecord = await OTP.findOne({
            email: req.user.email,
            otp,
            action: 'booking_verification'
        });

        if (!otpRecord) {

            return res.status(400).json({
                error: 'Invalid OTP'
            });

        }


        // ---------------------------------------------
        // Find event
        // ---------------------------------------------

        const event = await Event.findById(eventId);

        if (!event) {

            return res.status(404).json({
                error: 'Event not found'
            });

        }


        // ---------------------------------------------
        // Check available seats
        // ---------------------------------------------

        if (event.availableSeat < people) {

            return res.status(400).json({
                error: `Only ${event.availableSeat} seat(s) are available`
            });

        }


        // ---------------------------------------------
        // Check existing booking
        // ---------------------------------------------

        const existingBooking = await Booking.findOne({
            userId: req.user._id,
            eventId,
            status: {
                $in: ['pending', 'confirmed']
            }
        });

        if (existingBooking) {

            return res.status(400).json({
                error: 'You have already booked this event'
            });

        }


        // ---------------------------------------------
        // Calculate total amount
        // ---------------------------------------------

        const totalAmount = event.ticketPrice * people;


        // ---------------------------------------------
        // Create booking
        // ---------------------------------------------

        const booking = await Booking.create({

            userId: req.user._id,

            eventId,

            numberOfPeople: people,

            status: 'pending',

            paymentStatus: 'non-paid',

            amount: totalAmount

        });


        // ---------------------------------------------
        // Delete OTP after successful booking
        // ---------------------------------------------

        await OTP.deleteMany({
            email: req.user.email,
            action: 'booking_verification'
        });


        res.status(201).json({

            message:
                'Booking created successfully. Waiting for admin confirmation.',

            booking

        });

    } catch (error) {

        console.error("BOOK EVENT ERROR:", error);

        res.status(500).json({

            error: 'Failed to create booking',

            message: error.message

        });

    }
};


// =====================================================
// GET PENDING BOOKINGS
// =====================================================

exports.getPendingBookings = async (req, res) => {

    try {

        const bookings = await Booking.find({
            status: 'pending'
        })
            .populate(
                'userId',
                'name email'
            )
            .populate(
                'eventId',
                'title date location ticketPrice'
            );

        res.json(bookings);

    } catch (error) {

        console.error(
            'Get pending bookings error:',
            error
        );

        res.status(500).json({
            error: 'Failed to get pending bookings'
        });

    }
};


// =====================================================
// CONFIRM BOOKING
// =====================================================

exports.confirmBooking = async (req, res) => {

    try {

        console.log("1. Confirm API called");

        console.log(
            "Booking ID:",
            req.params.id
        );

        console.log(
            "Payment Status:",
            req.body.paymentStatus
        );


        const paymentStatus =
            req.body.paymentStatus;


        // ---------------------------------------------
        // Validate payment status
        // ---------------------------------------------

        if (
            !['paid', 'non-paid']
                .includes(paymentStatus)
        ) {

            return res.status(400).json({
                error: 'Invalid payment status'
            });

        }


        console.log(
            "2. Payment status valid"
        );


        // ---------------------------------------------
        // Find booking
        // ---------------------------------------------

        const booking =
            await Booking.findById(req.params.id);


        if (!booking) {

            return res.status(404).json({
                error: 'Booking not found'
            });

        }


        console.log(
            "3. Booking found:",
            booking._id
        );

        console.log(
            "User ID:",
            booking.userId
        );

        console.log(
            "Event ID:",
            booking.eventId
        );


        if (booking.status === 'confirmed') {

            return res.status(400).json({
                error: 'Booking is already confirmed'
            });

        }


        // ---------------------------------------------
        // Find event
        // ---------------------------------------------

        const event =
            await Event.findById(booking.eventId);


        if (!event) {

            return res.status(404).json({
                error: 'Event not found'
            });

        }


        console.log(
            "4. Event found:",
            event.title
        );

        console.log(
            "Available seats:",
            event.availableSeat
        );

        console.log(
            "Required seats:",
            booking.numberOfPeople
        );


        // ---------------------------------------------
        // Check seats again
        // ---------------------------------------------

        if (
            event.availableSeat <
            booking.numberOfPeople
        ) {

            return res.status(400).json({

                error:
                    `Only ${event.availableSeat} seat(s) are available, but this booking requires ${booking.numberOfPeople} seat(s)`

            });

        }


        // ---------------------------------------------
        // Confirm booking
        // ---------------------------------------------

        booking.status = 'confirmed';

        booking.paymentStatus =
            paymentStatus;

        await booking.save();


        console.log(
            "5. Booking confirmed in database"
        );


        // ---------------------------------------------
        // Reduce seats according to quantity
        // ---------------------------------------------

        event.availableSeat -=
            booking.numberOfPeople;

        await event.save();


        console.log(
            "6. Seats updated"
        );


        // ---------------------------------------------
        // Find user
        // ---------------------------------------------

        const user =
            await User.findById(booking.userId);


        if (!user) {

            return res.status(404).json({
                error: 'User not found'
            });

        }


        console.log(
            "7. User found:",
            user.email
        );


        // ---------------------------------------------
        // Send confirmation email
        // ---------------------------------------------

        await sendBookingEmail(
            user.email,
            user.name,
            event.title
        );


        console.log(
            "8. Confirmation email sent"
        );


        res.json({
            message:
                'Booking confirmed successfully'
        });


    } catch (error) {

        console.error(
            "========== CONFIRM BOOKING ERROR =========="
        );

        console.error(error);

        console.error(
            "Message:",
            error.message
        );

        console.error(
            "Stack:",
            error.stack
        );

        console.error(
            "==========================================="
        );


        res.status(500).json({

            error:
                'Failed to confirm booking',

            message:
                error.message

        });

    }
};


// =====================================================
// GET MY BOOKINGS
// =====================================================

exports.getMyBookings = async (req, res) => {

    try {

        const bookings =
            await Booking.find({
                userId: req.user._id
            })
                .populate(
                    'eventId',
                    'title date location ticketPrice'
                );

        res.json(bookings);

    } catch (error) {

        console.error(
            'Get my bookings error:',
            error
        );

        res.status(500).json({
            error: 'Failed to get bookings'
        });

    }
};


// =====================================================
// CANCEL BOOKING
// =====================================================

exports.cancelBooking = async (req, res) => {

    try {

        const booking =
            await Booking.findById(req.params.id);


        if (!booking) {

            return res.status(404).json({
                error: 'Booking not found'
            });

        }


        if (
            booking.userId.toString() !==
            req.user._id.toString()
        ) {

            return res.status(403).json({
                error: 'Unauthorized'
            });

        }


        const wasConfirmed =
            booking.status === 'confirmed';


        booking.status = 'cancelled';

        await booking.save();


        // ---------------------------------------------
        // Return all booked seats
        // ---------------------------------------------

        if (wasConfirmed) {

            const event =
                await Event.findById(
                    booking.eventId
                );


            if (event) {

                event.availableSeat +=
                    booking.numberOfPeople;

                await event.save();

            }

        }


        res.json({
            message:
                'Booking cancelled successfully'
        });


    } catch (error) {

        console.error(
            'Cancel booking error:',
            error
        );

        res.status(500).json({

            error:
                'Failed to cancel booking',

            message:
                error.message

        });

    }
};


// =====================================================
// REJECT BOOKING
// =====================================================

exports.rejectBooking = async (req, res) => {

    try {

        const booking =
            await Booking.findById(req.params.id)

                .populate(
                    'userId',
                    'name email'
                )

                .populate(
                    'eventId',
                    'title'
                );


        if (!booking) {

            return res.status(404).json({
                error: 'Booking not found'
            });

        }


        if (
            booking.status !== 'pending'
        ) {

            return res.status(400).json({

                error:
                    'Only pending bookings can be rejected'

            });

        }


        booking.status = 'cancelled';

        await booking.save();


        console.log(
            "================================"
        );

        console.log(
            "BOOKING REJECTED"
        );

        console.log(
            "User:",
            booking.userId.name
        );

        console.log(
            "Email:",
            booking.userId.email
        );

        console.log(
            "Event:",
            booking.eventId.title
        );


        const emailSent =
            await sendBookingRejectedEmail(

                booking.userId.email,

                booking.userId.name,

                booking.eventId.title

            );


        console.log(
            "EMAIL SENT:",
            emailSent
        );

        console.log(
            "================================"
        );


        res.json({

            message:
                'Booking rejected successfully',

            emailSent:
                emailSent

        });


    } catch (error) {

        console.error(
            'Reject booking error:',
            error
        );

        res.status(500).json({

            error:
                'Failed to reject booking',

            message:
                error.message

        });

    }
};