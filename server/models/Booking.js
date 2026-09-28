const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        required: true
    },

    // Number of people / tickets booked
    numberOfPeople: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    },

    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'pending'
    },

    paymentStatus: {
        type: String,
        enum: ['non-paid', 'paid'],
        default: 'non-paid'
    },

    // Total amount for all tickets
    amount: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);