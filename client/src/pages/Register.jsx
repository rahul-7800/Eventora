import React, {
    useState,
    useContext,
    useEffect
} from "react";

import {
    Link,
    useNavigate
} from "react-router-dom";

import { AuthContext } from "../context/AuthContext";


const Register = () => {

    // ==========================================
    // FORM STATES
    // ==========================================

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");


    // ==========================================
    // UI STATES
    // ==========================================

    const [showOTP, setShowOTP] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // OTP TIMER
    // 300 seconds = 5 minutes
    // ==========================================

    const [otpTimer, setOtpTimer] = useState(300);


    // ==========================================
    // AUTH CONTEXT
    // ==========================================

    const {
        register,
        verifyOTP,
        resendOTP
    } = useContext(AuthContext);


    const navigate = useNavigate();


    // ==========================================
    // OTP COUNTDOWN
    // ==========================================

    useEffect(() => {

        if (!showOTP || otpTimer <= 0) {
            return;
        }

        const timer = setInterval(() => {

            setOtpTimer((prev) => prev - 1);

        }, 1000);


        return () => clearInterval(timer);

    }, [showOTP, otpTimer]);


    // ==========================================
    // FORMAT TIMER
    // Example: 04:59
    // ==========================================

    const minutes = Math.floor(otpTimer / 60);

    const seconds = otpTimer % 60;

    const formattedTimer =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;


    // ==========================================
    // HANDLE REGISTER / VERIFY OTP
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        console.log("Sign Up button clicked");


        setLoading(true);
        setError("");
        setSuccess("");


        try {

            // ==================================
            // STEP 1: REGISTER
            // ==================================

            if (!showOTP) {

                console.log("Calling register...");


                // Name validation
                if (!name.trim()) {
                    throw new Error(
                        "Please enter your full name."
                    );
                }


                // Email validation
                if (!email.trim()) {
                    throw new Error(
                        "Please enter your email."
                    );
                }


                // Password validation
                if (password.length < 6) {
                    throw new Error(
                        "Password must be at least 6 characters."
                    );
                }


                // Call AuthContext register
                const response = await register(
                    name.trim(),
                    email.trim(),
                    password
                );


                console.log(
                    "Registration response:",
                    response
                );


                // Show OTP screen
                setShowOTP(true);


                // Start 5-minute timer
                setOtpTimer(300);


                setSuccess(
                    "Registration successful! An OTP has been sent to your email."
                );
            }


            // ==================================
            // STEP 2: VERIFY OTP
            // ==================================

            else {

                console.log("Verifying OTP...");


                // OTP validation
                if (!otp.trim()) {

                    throw new Error(
                        "Please enter the OTP."
                    );
                }


                if (otp.length !== 6) {

                    throw new Error(
                        "OTP must be 6 digits."
                    );
                }


                // Verify OTP
                const response = await verifyOTP(
                    email.trim(),
                    otp.trim()
                );


                console.log(
                    "OTP verification response:",
                    response
                );


                setSuccess(
                    "Email verified successfully!"
                );


                // Go to dashboard
                navigate("/dashboard");
            }


        } catch (error) {

            console.error(
                "Registration / OTP error:",
                error
            );


            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Something went wrong. Please try again.";


            setError(message);

        } finally {

            console.log(
                "Stopping loading..."
            );

            setLoading(false);
        }
    };


    // ==========================================
    // RESEND OTP
    // ==========================================

    const handleResendOTP = async () => {

        setError("");
        setSuccess("");
        setResending(true);


        try {

            console.log("Resending OTP...");


            await resendOTP(
                email.trim()
            );


            // Reset OTP input
            setOtp("");


            // Reset timer to 5 minutes
            setOtpTimer(300);


            setSuccess(
                "A new OTP has been sent to your email."
            );


        } catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );


            const message =
                error.response?.data?.error ||
                error.response?.data?.message ||
                error.message ||
                "Failed to resend OTP. Please try again.";


            setError(message);

        } finally {

            setResending(false);
        }
    };


    // ==========================================
    // JSX
    // ==========================================

    return (

        <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-lg border border-gray-100">


            {/* ==================================
                HEADER
            ================================== */}

            <div className="text-center mb-8">

                <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
                    Create an Account
                </h2>

                <p className="text-gray-500">
                    Join Eventora today
                </p>

            </div>


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (

                <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-6 text-center border border-red-100">

                    {error}

                </div>

            )}


            {/* ==================================
                SUCCESS MESSAGE
            ================================== */}

            {success && (

                <div className="bg-green-50 text-green-700 p-3 rounded-lg mb-6 text-center border border-green-200">

                    {success}

                </div>

            )}


            {/* ==================================
                FORM
            ================================== */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >


                {/* ==================================
                    REGISTRATION FORM
                ================================== */}

                {!showOTP ? (

                    <>

                        {/* NAME */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                Full Name

                            </label>


                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                placeholder="Enter your full name"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none transition shadow-sm"
                            />

                        </div>


                        {/* EMAIL */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                Email Address

                            </label>


                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                placeholder="Enter your email"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none transition shadow-sm"
                            />

                        </div>


                        {/* PASSWORD */}

                        <div>

                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                Password

                            </label>


                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none transition shadow-sm"
                            />

                        </div>

                    </>

                ) : (

                    /* ==================================
                       OTP FORM
                    ================================== */

                    <div>


                        {/* OTP LABEL */}

                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                            Verification Code (OTP)

                        </label>


                        {/* OTP INPUT */}

                        <input
                            type="text"
                            required
                            inputMode="numeric"
                            autoComplete="one-time-code"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            maxLength={6}
                            onChange={(e) => {

                                const value =
                                    e.target.value.replace(
                                        /\D/g,
                                        ""
                                    );

                                setOtp(value);

                            }}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-gray-700 focus:outline-none transition shadow-sm font-bold tracking-widest text-center text-lg"
                        />


                        {/* ==================================
                            OTP COUNTDOWN
                        ================================== */}

                        <div className="text-center mt-3">

                            {otpTimer > 0 ? (

                                <p className="text-sm text-gray-600">

                                    OTP expires in{" "}

                                    <span className="font-bold text-gray-900">

                                        {formattedTimer}

                                    </span>

                                </p>

                            ) : (

                                <p className="text-sm text-red-600 font-semibold">

                                    OTP expired. Please resend OTP.

                                </p>

                            )}

                        </div>


                        {/* ==================================
                            RESEND OTP
                        ================================== */}

                        <div className="text-center mt-3">

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={
                                    resending ||
                                    otpTimer > 0
                                }
                                className="text-gray-900 font-semibold hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
                            >

                                {resending
                                    ? "Sending..."
                                    : "Resend OTP"
                                }

                            </button>

                        </div>

                    </div>

                )}


                {/* ==================================
                    SUBMIT BUTTON
                ================================== */}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black focus:ring-4 focus:ring-gray-200 transition shadow-md mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
                >

                    {loading
                        ? "Processing..."
                        : showOTP
                            ? "Verify & Complete"
                            : "Sign Up"
                    }

                </button>


            </form>


            {/* ==================================
                LOGIN LINK
            ================================== */}

            {!showOTP && (

                <p className="text-center mt-6 text-gray-600">

                    Already have an account?{" "}

                    <Link
                        to="/login"
                        className="text-gray-900 font-bold hover:underline"
                    >
                        Sign in
                    </Link>

                </p>

            )}

        </div>
    );
};


export default Register;
