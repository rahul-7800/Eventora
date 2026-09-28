/*const express = require('express');
const router = express.Router();
const { bookEvent, confirmBooking, getMyBookings, cancelBooking, sendBookingOTP } = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

router.post('/send-otp', protect, sendBookingOTP);
router.post('/', protect, bookEvent);
router.put('/:id/confirm', protect, admin, confirmBooking);
router.get('/my', protect, getMyBookings);
router.delete('/:id', protect, cancelBooking);

module.exports = router; 
*/

const express = require('express');

const router = express.Router();

const {
    bookEvent,
    confirmBooking,
    getMyBookings,
    cancelBooking,
    sendBookingOTP,
    getPendingBookings,
    rejectBooking
} = require('../controllers/bookingController');

const { protect, admin } = require('../middleware/auth');

router.post('/send-otp', protect, sendBookingOTP);

router.post('/', protect, bookEvent);

router.get('/my', protect, getMyBookings);

router.get('/pending', protect, admin, getPendingBookings);

router.put('/:id/confirm', protect, admin, confirmBooking);

router.delete('/:id', protect, cancelBooking);

router.put('/:id/reject', protect, admin, rejectBooking);

module.exports = router;