const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOTPEmail } = require('../utils/email');


// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};


// ==========================================
// REGISTER USER
// ==========================================

exports.registerUser = async (req, res) => {
    try {
        console.log("Register request body:", req.body);

        if (!req.body) {
            return res.status(400).json({
                error: "Request body is missing"
            });
        }

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const userExists = await User.findOne({
            email: normalizedEmail
        });

        if (userExists) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const user = await User.create({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        // Generate 6-digit OTP
        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        console.log(
            `OTP for ${normalizedEmail}: ${otp}`
        );

        // Delete old registration OTP
        await OTP.deleteMany({
            email: normalizedEmail,
            action: 'account_verification'
        });

        // Create new OTP
        await OTP.create({
            email: normalizedEmail,
            otp,
            action: 'account_verification'
        });

        // Send OTP email
        await sendOTPEmail(
            normalizedEmail,
            otp,
            'account_verification'
        );

        return res.status(201).json({
            message:
                'User registered successfully. Please check your email for OTP to verify your account.',
            email: user.email
        });

    } catch (error) {
        console.error(
            "Registration error:",
            error
        );

        return res.status(400).json({
            error: error.message
        });
    }
};


// ==========================================
// LOGIN USER
// ==========================================

exports.loginUser = async (req, res) => {
    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        email = email.trim().toLowerCase();

        console.log(
            "Login attempt:",
            email
        );

        const user = await User.findOne({
            email
        });

        console.log(
            "User found:",
            user ? user.email : "NO USER"
        );

        if (!user) {
            return res.status(400).json({
                error:
                    "Invalid credentials, Please sign up first"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        console.log(
            "Password match:",
            isMatch
        );

        if (!isMatch) {
            return res.status(400).json({
                error: "Invalid credentials"
            });
        }

        // Normal users must verify email
        // Admin does NOT need email verification
        if (
            !user.isVerified &&
            user.role === "user"
        ) {

            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            // Delete old OTP
            await OTP.deleteMany({
                email,
                action: "account_verification"
            });

            // Create new OTP
            await OTP.create({
                email,
                otp,
                action: "account_verification"
            });

            console.log(
                `Login OTP for ${email}: ${otp}`
            );

            await sendOTPEmail(
                email,
                otp,
                "account_verification"
            );

            return res.status(400).json({
                error:
                    "Please verify your email first"
            });
        }

        // Generate JWT
        const token = generateToken(
            user._id,
            user.role
        );

        return res.status(200).json({
            message: "Login successful",
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            error:
                "Server error during login"
        });
    }
};


// ==========================================
// VERIFY ACCOUNT OTP
// ==========================================

exports.verifyOtp = async (req, res) => {
    try {
        const {
            email,
            otp,
            action
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                error:
                    "Email and OTP are required"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        const otpRecord = await OTP.findOne({
            email: normalizedEmail,
            otp: otp.trim(),
            action: 'account_verification'
        });

        if (!otpRecord) {
            return res.status(400).json({
                error:
                    "Invalid or expired OTP"
            });
        }

        // 5 minute expiry
        const otpAge =
            Date.now() -
            new Date(
                otpRecord.createdAt
            ).getTime();

        const fiveMinutes =
            5 * 60 * 1000;

        if (otpAge > fiveMinutes) {

            await OTP.deleteMany({
                email: normalizedEmail,
                action:
                    'account_verification'
            });

            return res.status(400).json({
                error:
                    "OTP has expired. Please request a new OTP."
            });
        }

        // Verify user
        const user =
            await User.findOneAndUpdate(
                {
                    email: normalizedEmail
                },
                {
                    isVerified: true
                },
                {
                    new: true
                }
            );

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Delete OTP
        await OTP.deleteMany({
            email: normalizedEmail,
            action:
                'account_verification'
        });

        return res.json({
            message:
                'Email verified successfully',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(
                user._id,
                user.role
            )
        });

    } catch (error) {
        console.error(
            "OTP verification error:",
            error
        );

        return res.status(500).json({
            error:
                "Server error during OTP verification"
        });
    }
};


// ==========================================
// RESEND OTP
// ==========================================

exports.resendOtp = async (req, res) => {
    try {
        const {
            email,
            action
        } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Decide OTP purpose
        const otpAction =
            action === "password_reset"
                ? "password_reset"
                : "account_verification";

        // Find user
        const user =
            await User.findOne({
                email: normalizedEmail
            });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Account verification
        if (
            otpAction ===
            "account_verification"
        ) {

            if (user.isVerified) {
                return res.status(400).json({
                    error:
                        "Email is already verified"
                });
            }
        }

        // Delete previous OTP
        await OTP.deleteMany({
            email: normalizedEmail,
            action: otpAction
        });

        // Generate OTP
        const otp = Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

        console.log(
            `Resend ${otpAction} OTP for ${normalizedEmail}: ${otp}`
        );

        // Save OTP
        await OTP.create({
            email: normalizedEmail,
            otp,
            action: otpAction
        });

        // Send email
        await sendOTPEmail(
            normalizedEmail,
            otp,
            otpAction
        );

        return res.status(200).json({
            message:
                "A new OTP has been sent to your email.",
            email: normalizedEmail
        });

    } catch (error) {
        console.error(
            "Resend OTP error:",
            error
        );

        return res.status(500).json({
            error:
                "Failed to resend OTP"
        });
    }
};


// ==========================================
// FORGOT PASSWORD
// SEND PASSWORD RESET OTP
// ==========================================

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email is required"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Find user
        const user =
            await User.findOne({
                email: normalizedEmail
            });

        if (!user) {
            return res.status(404).json({
                error:
                    "No account found with this email"
            });
        }

        // Generate OTP
        const otp = Math.floor(
            100000 +
            Math.random() * 900000
        ).toString();

        console.log(
            `Password reset OTP for ${normalizedEmail}: ${otp}`
        );

        // Delete previous reset OTP
        await OTP.deleteMany({
            email: normalizedEmail,
            action: "password_reset"
        });

        // Create new reset OTP
        await OTP.create({
            email: normalizedEmail,
            otp,
            action: "password_reset"
        });

        // Send email
        await sendOTPEmail(
            normalizedEmail,
            otp,
            "password_reset"
        );

        return res.status(200).json({
            message:
                "Password reset OTP has been sent to your email.",
            email: normalizedEmail
        });

    } catch (error) {
        console.error(
            "Forgot password error:",
            error
        );

        return res.status(500).json({
            error:
                "Failed to send password reset OTP"
        });
    }
};


// ==========================================
// VERIFY PASSWORD RESET OTP
// ==========================================

exports.verifyResetOtp = async (req, res) => {
    try {
        const {
            email,
            otp
        } = req.body;

        if (!email || !otp) {
            return res.status(400).json({
                error:
                    "Email and OTP are required"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Find OTP
        const otpRecord =
            await OTP.findOne({
                email: normalizedEmail,
                otp: otp.trim(),
                action: "password_reset"
            });

        if (!otpRecord) {
            return res.status(400).json({
                error:
                    "Invalid or expired OTP"
            });
        }

        // Check expiry
        const otpAge =
            Date.now() -
            new Date(
                otpRecord.createdAt
            ).getTime();

        const fiveMinutes =
            5 * 60 * 1000;

        if (otpAge > fiveMinutes) {

            await OTP.deleteMany({
                email: normalizedEmail,
                action: "password_reset"
            });

            return res.status(400).json({
                error:
                    "OTP has expired. Please request a new OTP."
            });
        }

        // Check user
        const user =
            await User.findOne({
                email: normalizedEmail
            });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        return res.status(200).json({
            message:
                "OTP verified successfully",
            email: normalizedEmail
        });

    } catch (error) {
        console.error(
            "Verify reset OTP error:",
            error
        );

        return res.status(500).json({
            error:
                "Server error while verifying OTP"
        });
    }
};


// ==========================================
// RESET PASSWORD
// ==========================================

exports.resetPassword = async (req, res) => {
    try {
        const {
            email,
            otp,
            newPassword
        } = req.body;

        if (
            !email ||
            !otp ||
            !newPassword
        ) {
            return res.status(400).json({
                error:
                    "Email, OTP and new password are required"
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error:
                    "Password must be at least 6 characters"
            });
        }

        const normalizedEmail =
            email.trim().toLowerCase();

        // Verify OTP again
        const otpRecord =
            await OTP.findOne({
                email: normalizedEmail,
                otp: otp.trim(),
                action: "password_reset"
            });

        if (!otpRecord) {
            return res.status(400).json({
                error:
                    "Invalid or expired OTP"
            });
        }

        // Check expiry
        const otpAge =
            Date.now() -
            new Date(
                otpRecord.createdAt
            ).getTime();

        const fiveMinutes =
            5 * 60 * 1000;

        if (otpAge > fiveMinutes) {

            await OTP.deleteMany({
                email: normalizedEmail,
                action: "password_reset"
            });

            return res.status(400).json({
                error:
                    "OTP has expired. Please request a new OTP."
            });
        }

        // Find user
        const user =
            await User.findOne({
                email: normalizedEmail
            });

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }

        // Hash new password
        const salt =
            await bcrypt.genSalt(10);

        const hashedPassword =
            await bcrypt.hash(
                newPassword,
                salt
            );

        // Update password
        user.password =
            hashedPassword;

        await user.save();

        // Delete used OTP
        await OTP.deleteMany({
            email: normalizedEmail,
            action: "password_reset"
        });

        return res.status(200).json({
            message:
                "Password reset successfully. You can now login with your new password."
        });

    } catch (error) {
        console.error(
            "Reset password error:",
            error
        );

        return res.status(500).json({
            error:
                "Failed to reset password"
        });
    }
};


//const User = require('../models/User');
//const OTP = require('../models/OTP');
//const bcrypt = require('bcryptjs');
//const jwt = require('jsonwebtoken');
//const {sendOTPEmail} = require('../utils/email');
//
//const generateToken = (id, role) => {
//    return jwt.sign({id, role}, process.env.JWT_SECRET, {expiresIn: '7d'}); 
//};
//
////Register User
///*exports.registerUser = async (req, res) => {
//    const {name, email, password} = req.body;
//
//    let userExists  = await User.findOne({email});
//    if(userExists){
//        return res.status(400).json({error: 'User already exists'});
//    }
//
//    const salt = await bcrypt.genSalt(10);
//    const hashedPassword = await bcrypt.hash(password, salt);
//
//    try{
//        const user = await User.create ({name, email, password: hashedPassword, role: 'user',isVerified: false});
//
//        const otp = Math.floor(100000 + Math.random() * 900000 ).toString();
//        console.log(`otp for ${email}: ${otp}`);
//        await OTP.create({email, otp, action: 'account_verification'});
//        await sendOTPEmail(email, otp, 'account_verification');
//        res.status(201).json({
//            message: 'User registered successfully. Please check your email for OTP to verify your account .',
//            email: user.email  
//        });
//       
//    }catch (error){
//        res.status(400).json({error: error.message});
//    }
//};*/
//
//exports.registerUser = async (req, res) => {
//    try {
//        console.log("Register request body:", req.body);
//
//        if (!req.body) {
//            return res.status(400).json({
//                error: "Request body is missing"
//            });
//        }
//
//        const { name, email, password } = req.body;
//
//        if (!name || !email || !password) {
//            return res.status(400).json({
//                error: "Name, email and password are required"
//            });
//        }
//
//        const userExists = await User.findOne({ email });
//
//        if (userExists) {
//            return res.status(400).json({
//                error: "User already exists"
//            });
//        }
//
//        const salt = await bcrypt.genSalt(10);
//        const hashedPassword = await bcrypt.hash(password, salt);
//
//        const user = await User.create({
//            name,
//            email,
//            password: hashedPassword,
//            role: 'user',
//            isVerified: false
//        });
//
//        const otp = Math.floor(
//            100000 + Math.random() * 900000
//        ).toString();
//
//        console.log(`OTP for ${email}: ${otp}`);
//
//        await OTP.create({
//            email,
//            otp,
//            action: 'account_verification'
//        });
//
//        await sendOTPEmail(
//            email,
//            otp,
//            'account_verification'
//        );
//
//        res.status(201).json({
//            message: 'User registered successfully. Please check your email for OTP to verify your account.',
//            email: user.email
//        });
//
//    } catch (error) {
//        console.error("Registration error:", error);
//
//        res.status(400).json({
//            error: error.message
//        });
//    }
//};
//
//
////login User
//exports.loginUser = async (req, res) => {
//    try {
//        let { email, password } = req.body;
//
//        // Check required fields
//        if (!email || !password) {
//            return res.status(400).json({
//                error: "Email and password are required"
//            });
//        }
//
//        // Remove extra spaces and make email lowercase
//        email = email.trim().toLowerCase();
//
//        console.log("Login attempt:", email);
//
//        // Find user
//        const user = await User.findOne({ email });
//
//        console.log("User found:", user ? user.email : "NO USER");
//
//        if (!user) {
//            return res.status(400).json({
//                error: "Invalid credentials, Please sign up first"
//            });
//        }
//
//        // Compare password
//        const isMatch = await bcrypt.compare(password, user.password);
//
//        console.log("Password match:", isMatch);
//
//        if (!isMatch) {
//            return res.status(400).json({
//                error: "Invalid credentials"
//            });
//        }
//
//        // Normal users must verify email
//        // Admin does NOT need email verification
//        if (!user.isVerified && user.role === "user") {
//            const otp = Math.floor(
//                100000 + Math.random() * 900000
//            ).toString();
//
//            await OTP.deleteMany({
//                email,
//                action: "account_verification"
//            });
//
//            await OTP.create({
//                email,
//                otp,
//                action: "account_verification"
//            });
//
//            console.log(`Login OTP for ${email}: ${otp}`);
//
//            await sendOTPEmail(
//                email,
//                otp,
//                "account_verification"
//            );
//
//            return res.status(400).json({
//                error: "Please verify your email first"
//            });
//        }
//
//        // Successful login
//        const token = generateToken(user._id, user.role);
//
//        return res.status(200).json({
//            message: "Login successful",
//            _id: user._id,
//            name: user.name,
//            email: user.email,
//            role: user.role,
//            token
//        });
//
//    } catch (error) {
//        console.error("Login error:", error);
//
//        return res.status(500).json({
//            error: "Server error during login"
//        });
//    }
//};
//
//
////Verify OTP
//exports.verifyOtp = async (req, res) => {
//    const {email, otp, action} = req.body;
//    const otpRecord = await OTP.findOne({email, otp, action: 'account_verification'});
//    if(!otpRecord){
//        return res.status(400).json({error: 'Invalid OTP'});
//    }
//    const user = await User.findOneAndUpdate({email}, {isVerified: true});
//    await OTP.deleteMany({email, action: 'account_verification'}); //Remove all OTPs for the same email and action
//    res.json({
//        message: 'Email verified successfully',
//        _id: user._id,
//        name: user.name,
//        email: user.email,
//        role: user.role,    
//        token: generateToken(user._id, user.role)
//    });
//};