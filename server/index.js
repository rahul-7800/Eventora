const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const bookingRoutes = require('./routes/booking');

const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('MongoDB Connected');
        console.log('Database:', mongoose.connection.name);

        // TEST: show users available to the server
        const users = await User.find({}, 'name email role isVerified');

        console.log('Users in database:');
        console.log(users);
    })
    .catch((error) => {
        console.error('MongoDB Connection Error:', error);
    });

app.get('/', (req, res) => {
    res.send('Eventora API is running');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});