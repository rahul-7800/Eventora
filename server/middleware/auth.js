const jwt = require('jsonwebtoken');
const User = require('../models/User');

/*const protect = async (req, res, next) => {
    let token =
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : null;

    // No token
    if (!token) {
        return res.status(401).json({
            error: 'Not authorized, no token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({
                error: 'Not authorized, user not found'
            });
        }

        next();

    } catch (error) {
        console.error('JWT Error:', error.message);

        return res.status(401).json({
            error: 'Not authorized, token failed'
        });
    }
};*/

const protect = async (req, res, next) => {
    let token =
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
            ? req.headers.authorization.split(' ')[1]
            : null;

    console.log("Authorization header:", req.headers.authorization);
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({
            error: 'Not authorized, no token'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded JWT:", decoded);

        req.user = await User.findById(decoded.id).select('-password');

        console.log("Authenticated user:", req.user);

        if (!req.user) {
            return res.status(401).json({
                error: 'Not authorized, user not found'
            });
        }

        next();

    } catch (error) {
        console.error('JWT Error:', error.message);

        return res.status(401).json({
            error: 'Not authorized, token failed'
        });
    }
};


const admin = (req, res, next) => {
    console.log("Admin check:", req.user);

    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            message: 'Access denied, admin can access only'
        });
    }
};


module.exports = { protect, admin };