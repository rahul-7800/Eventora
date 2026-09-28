const express = require("express");

const router = express.Router();

const {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    forgotPassword,
    verifyResetOtp,
    resetPassword
} = require("../controllers/authController");


// ==========================================
// ACCOUNT AUTHENTICATION
// ==========================================

router.post(
    "/register",
    registerUser
);

router.post(
    "/login",
    loginUser
);

router.post(
    "/verify-otp",
    verifyOtp
);

router.post(
    "/resend-otp",
    resendOtp
);


// ==========================================
// FORGOT PASSWORD
// ==========================================

router.post(
    "/forgot-password",
    forgotPassword
);

router.post(
    "/verify-reset-otp",
    verifyResetOtp
);

router.post(
    "/reset-password",
    resetPassword
);


module.exports = router;