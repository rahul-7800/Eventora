/* const Event = require('../models/Event');

exports.getAllEvents = async (req, res) => {
    try{
        
        const filter = {};
        if(req.query.category){
            filter.category = req.query.category;
        }
        if (req.query.ticketPrice) {
            filter.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find();
        res.json(events);
    } catch (error){
        res.status(500).json({
            error: error.message
        });
    }
};

exports.getEventById = async (req, res) => {
    try{
        const event = await Event.findById(req,URLSearchParams.id);
        if(!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.json(event);
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
};


exports.createEvent = async (req, res) => {
    const {title, description, date, location, category, totalSeat, availableSeat, ticketPrice, imageUrl} = req.body;
    try{
        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            totalSeat,
            ticketPrice,
            imageUrl
        });
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateEvent = async(req,  res) => {
    const {title, description, date, location, category, totalSeat, availableSeat, ticketPrice, imageUrl} = req.body;
    try{
        const event = await Event.findByIdAndUpdate(req.params.id,{
        title, 
        description,
        date,
        location,
        category,
        totalSeat,
        ticketPrice,
        imageUrl
        }, {new: true});
        if (!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.json(event);
    } catch(error) {
        res.status(500).json({error: error.message});
    } 
};


exports.deleteEvent = async (req, res) => {
    try{
        const event = await Event.findByIdAndDelete(req.params.id);
        if(!event) {
            return res.status(404).json({error: 'Event not found'});
        }
        res.json({message: 'Event deleted successfully'});
    } 
    catch(error) {
        res.status(500).json({error: error.message});
    }
}; */

const Event = require('../models/Event');

// Get All Events
exports.getAllEvents = async (req, res) => {
    try {
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category;
        }

        if (req.query.ticketPrice) {
            filter.ticketPrice = req.query.ticketPrice;
        }

        const events = await Event.find(filter).sort({ date: 1 });

        res.json(events);

    } catch (error) {
        console.error('Get events error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};


// Get Event by ID
exports.getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        res.json(event);

    } catch (error) {
        console.error('Get event by ID error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};


// Create Event (Admin)
exports.createEvent = async (req, res) => {
    const {
        title,
        description,
        date,
        location,
        category,
        totalSeat,
        availableSeat,
        ticketPrice,
        imageUrl
    } = req.body;

    try {

        const event = new Event({
            title,
            description,
            date,
            location,
            category,
            totalSeat,
            availableSeat: availableSeat ?? totalSeat,
            ticketPrice,
            imageUrl,
            createdBy: req.user.id
        });

        // IMPORTANT: Save event to MongoDB
        const savedEvent = await event.save();

        console.log('New event created:', savedEvent);

        res.status(201).json(savedEvent);

    } catch (error) {

        console.error('Create event error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};


// Update Event (Admin)
exports.updateEvent = async (req, res) => {

    const {
        title,
        description,
        date,
        location,
        category,
        totalSeat,
        availableSeat,
        ticketPrice,
        imageUrl
    } = req.body;

    try {

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            {
                title,
                description,
                date,
                location,
                category,
                totalSeat,
                availableSeat,
                ticketPrice,
                imageUrl
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        res.json(event);

    } catch (error) {

        console.error('Update event error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};


// Delete Event (Admin)
exports.deleteEvent = async (req, res) => {

    try {

        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                error: 'Event not found'
            });
        }

        res.json({
            message: 'Event deleted successfully'
        });

    } catch (error) {

        console.error('Delete event error:', error);

        res.status(500).json({
            error: error.message
        });
    }
};