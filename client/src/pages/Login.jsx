import React, {useState,useContext,useEffect} from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

import {
    FaEnvelope,
    FaLock,
    FaShieldAlt,
    FaArrowRight,
    FaTicketAlt,
    FaCheckCircle,
    FaEye,
    FaEyeSlash,
    FaKey,
    FaRedo,
    FaArrowLeft,
    FaClock
} from "react-icons/fa";


const Login = () => {

    const navigate = useNavigate();

    const {
        login,
        verifyOTP,
        forgotPassword,
        verifyResetOTP,
        resetPassword,
        resendOTP,
    } = useContext(AuthContext);


    // =====================================================
    // LOGIN STATES
    // =====================================================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [otp, setOtp] = useState("");

    const [showOTP, setShowOTP] = useState(false);

    const [showPassword, setShowPassword] = useState(false);


    // =====================================================
    // FORGOT PASSWORD STATES
    // =====================================================

    const [forgotPasswordMode, setForgotPasswordMode] =
        useState(false);

    const [forgotStep, setForgotStep] =
        useState("email");

    const [newPassword, setNewPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showNewPassword, setShowNewPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [resendLoading, setResendLoading] =
        useState(false);

    const [resendMessage, setResendMessage] =
        useState("");


    // =====================================================
    // OTP COUNTDOWN
    // =====================================================

    const [otpTimeLeft, setOtpTimeLeft] =
        useState(0);

    const [otpExpired, setOtpExpired] =
        useState(false);


    // =====================================================
    // COMMON STATES
    // =====================================================

    const [error, setError] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    // =====================================================
    // OTP COUNTDOWN EFFECT
    // =====================================================

    useEffect(() => {

        if (
            !forgotPasswordMode ||
            forgotStep !== "otp" ||
            otpTimeLeft <= 0
        ) {
            return;
        }


        const timer = setInterval(() => {

            setOtpTimeLeft((prev) => {

                if (prev <= 1) {

                    clearInterval(timer);

                    setOtpExpired(true);

                    return 0;
                }

                return prev - 1;

            });

        }, 1000);


        return () => clearInterval(timer);

    }, [
        forgotPasswordMode,
        forgotStep,
        otpTimeLeft
    ]);


    // =====================================================
    // FORMAT OTP TIMER
    // =====================================================

    const formatOtpTime = () => {

        const minutes =
            Math.floor(otpTimeLeft / 60);

        const seconds =
            otpTimeLeft % 60;


        return `${minutes
            .toString()
            .padStart(2, "0")}:${seconds
            .toString()
            .padStart(2, "0")}`;

    };


    // =====================================================
    // NORMAL LOGIN
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setLoading(true);


        try {

            if (!email || !password) {

                setError(
                    "Please enter your email and password."
                );

                setLoading(false);

                return;
            }


            // -------------------------------------------------
            // OTP VERIFICATION FOR LOGIN
            // -------------------------------------------------

            if (showOTP) {

                if (!otp || otp.length !== 6) {

                    setError(
                        "Please enter the 6-digit OTP."
                    );

                    setLoading(false);

                    return;
                }


                const result =
                    await verifyOTP(email, otp);


                if (result) {

                    const loggedUser =
                        result.user || result;


                    if (
                        loggedUser?.role === "admin"
                    ) {

                        navigate("/admin");

                    } else {

                        navigate("/dashboard");

                    }

                }

                setLoading(false);

                return;
            }


            // -------------------------------------------------
            // NORMAL LOGIN
            // -------------------------------------------------

            const result =
                await login(email, password);


            if (
                result?.requiresOTP ||
                result?.showOTP
            ) {

                setShowOTP(true);

                setOtp("");

                setLoading(false);

                return;
            }


            const loggedUser =
                result?.user || result;


            if (loggedUser?.role === "admin") {

                navigate("/admin");

            } else {

                navigate("/dashboard");

            }

        } catch (err) {

            console.error("Login Error:", err);


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Login failed. Please try again."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // FORGOT PASSWORD
    // =====================================================

    const handleForgotPassword = () => {

        setForgotPasswordMode(true);

        setForgotStep("email");

        setError("");

        setOtp("");

        setNewPassword("");

        setConfirmPassword("");

        setResendMessage("");

        setOtpTimeLeft(0);

        setOtpExpired(false);

    };


    // =====================================================
    // BACK TO LOGIN
    // =====================================================

    const handleBackToLogin = () => {

        setForgotPasswordMode(false);

        setForgotStep("email");

        setError("");

        setOtp("");

        setNewPassword("");

        setConfirmPassword("");

        setResendMessage("");

        setOtpTimeLeft(0);

        setOtpExpired(false);

    };


    // =====================================================
    // SEND RESET PASSWORD OTP
    // =====================================================

    const handleSendResetOTP = async (e) => {

        e.preventDefault();

        setError("");

        setResendMessage("");


        if (!email) {

            setError(
                "Please enter your email address."
            );

            return;
        }


        try {

            setLoading(true);


            await forgotPassword(email);


            // ---------------------------------------------
            // START 5 MINUTE COUNTDOWN
            // ---------------------------------------------

            setOtpTimeLeft(5 * 60);

            setOtpExpired(false);

            setOtp("");

            setForgotStep("otp");

            setResendMessage(
                "OTP has been sent to your email."
            );


        } catch (err) {

            console.error(
                "Forgot Password Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to send OTP."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // VERIFY RESET OTP
    // =====================================================

    const handleVerifyResetOTP = async (e) => {

        e.preventDefault();

        setError("");

        setResendMessage("");


        // ---------------------------------------------
        // CHECK EXPIRY
        // ---------------------------------------------

        if (otpExpired || otpTimeLeft <= 0) {

            setError(
                "OTP has expired. Please request a new OTP."
            );

            return;
        }


        if (!otp || otp.length !== 6) {

            setError(
                "Please enter the 6-digit OTP."
            );

            return;
        }


        try {

            setLoading(true);


            await verifyResetOTP(
                email,
                otp
            );


            setForgotStep("password");

            setError("");

        } catch (err) {

            console.error(
                "Verify Reset OTP Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Invalid or expired OTP."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // RESEND RESET OTP
    // =====================================================

    const handleResendResetOTP = async () => {

        setError("");

        setResendMessage("");


        try {

            setResendLoading(true);


            await resendOTP(
                email,
                "password_reset"
            );


            // ---------------------------------------------
            // RESTART 5 MINUTE TIMER
            // ---------------------------------------------

            setOtpTimeLeft(5 * 60);

            setOtpExpired(false);

            setOtp("");

            setResendMessage(
                "A new OTP has been sent to your email."
            );


        } catch (err) {

            console.error(
                "Resend Reset OTP Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to resend OTP."
            );

        } finally {

            setResendLoading(false);

        }

    };


    // =====================================================
    // RESET PASSWORD
    // =====================================================

    const handleResetPassword = async (e) => {

        e.preventDefault();

        setError("");

        setResendMessage("");


        // ---------------------------------------------
        // PASSWORD VALIDATION
        // ---------------------------------------------

        if (!newPassword) {

            setError(
                "Please enter a new password."
            );

            return;
        }


        if (newPassword.length < 6) {

            setError(
                "Password must be at least 6 characters."
            );

            return;
        }


        if (!confirmPassword) {

            setError(
                "Please confirm your password."
            );

            return;
        }


        if (newPassword !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }


        try {

            setLoading(true);


            await resetPassword(
                email,
                otp,
                newPassword
            );


            setForgotStep("success");

            setError("");

        } catch (err) {

            console.error(
                "Reset Password Error:",
                err
            );


            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Unable to reset password."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // MAIN UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center px-4 py-10">

            <div className="w-full max-w-6xl">

                <div className="grid lg:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl border border-white/10 bg-white">


                    {/* =================================================
                        LEFT SIDE - EVENTORA BRANDING
                    ================================================= */}

                    <div className="hidden lg:flex relative bg-gradient-to-br from-indigo-700 via-purple-700 to-indigo-900 p-12 text-white flex-col justify-between overflow-hidden">

                        {/* Decorative circles */}

                        <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full"></div>

                        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full"></div>


                        <div className="relative z-10">

                            <div className="flex items-center gap-3 mb-8">

                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center">

                                    <FaTicketAlt className="text-indigo-700 text-2xl" />

                                </div>

                                <div>

                                    <h1 className="text-3xl font-bold">
                                        Eventora
                                    </h1>

                                    <p className="text-indigo-200 text-sm">
                                        Events made memorable
                                    </p>

                                </div>

                            </div>


                            <h2 className="text-4xl font-bold leading-tight mb-6">

                                Discover.
                                <br />

                                Book.
                                <br />

                                Experience.

                            </h2>


                            <p className="text-indigo-100 text-lg leading-relaxed max-w-md">

                                Find exciting events, reserve your
                                spot and create unforgettable
                                memories with Eventora.

                            </p>

                        </div>


                        <div className="relative z-10 space-y-4">

                            <div className="flex items-center gap-3">

                                <FaCheckCircle className="text-green-300" />

                                <span className="text-indigo-100">
                                    Easy event booking
                                </span>

                            </div>


                            <div className="flex items-center gap-3">

                                <FaCheckCircle className="text-green-300" />

                                <span className="text-indigo-100">
                                    Secure OTP verification
                                </span>

                            </div>


                            <div className="flex items-center gap-3">

                                <FaCheckCircle className="text-green-300" />

                                <span className="text-indigo-100">
                                    Instant booking confirmation
                                </span>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT SIDE
                    ================================================= */}

                    <div className="p-6 sm:p-10 lg:p-12">


                        {/* =================================================
                            FORGOT PASSWORD MODE
                        ================================================= */}

                        {forgotPasswordMode ? (

                            <div className="max-w-md mx-auto">


                                {/* -----------------------------------------
                                    BACK BUTTON
                                ----------------------------------------- */}

                                <button
                                    type="button"
                                    onClick={handleBackToLogin}
                                    className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition mb-6"
                                >

                                    <FaArrowLeft />

                                    Back to Login

                                </button>


                                {/* -----------------------------------------
                                    HEADER
                                ----------------------------------------- */}

                                <div className="text-center mb-8">

                                    <div className="mx-auto w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center mb-4">

                                        {forgotStep === "success" ? (

                                            <FaCheckCircle className="text-green-600 text-3xl" />

                                        ) : (

                                            <FaKey className="text-indigo-600 text-2xl" />

                                        )}

                                    </div>


                                    <h2 className="text-3xl font-bold text-gray-900">

                                        {forgotStep === "email" &&
                                            "Forgot Password?"}

                                        {forgotStep === "otp" &&
                                            "Verify OTP"}

                                        {forgotStep === "password" &&
                                            "Create New Password"}

                                        {forgotStep === "success" &&
                                            "Password Reset!"}

                                    </h2>


                                    <p className="text-gray-500 mt-2">

                                        {forgotStep === "email" &&
                                            "Enter your registered email address."}

                                        {forgotStep === "otp" &&
                                            "Enter the OTP sent to your email."}

                                        {forgotStep === "password" &&
                                            "Create a new secure password."}

                                        {forgotStep === "success" &&
                                            "Your password has been changed successfully."}

                                    </p>

                                </div>


                                {/* =================================================
                                    ERROR MESSAGE
                                ================================================= */}

                                {error && (

                                    <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">

                                        {error}

                                    </div>

                                )}


                                {/* =================================================
                                    SUCCESS / RESEND MESSAGE
                                ================================================= */}

                                {resendMessage && (

                                    <div className="mb-5 p-4 rounded-xl bg-green-50 border border-green-200 text-green-600 text-sm">

                                        {resendMessage}

                                    </div>

                                )}


                                {/* =================================================
                                    STEP 1 - EMAIL
                                ================================================= */}

                                {forgotStep === "email" && (

                                    <form
                                        onSubmit={handleSendResetOTP}
                                        className="space-y-5"
                                    >

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                Email Address

                                            </label>


                                            <div className="relative">

                                                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) =>
                                                        setEmail(e.target.value)
                                                    }
                                                    placeholder="Enter your email"
                                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    required
                                                />

                                            </div>

                                        </div>


                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                        >

                                            {loading ? (

                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                                    Sending OTP...
                                                </>

                                            ) : (

                                                <>
                                                    Send OTP

                                                    <FaArrowRight />

                                                </>

                                            )}

                                        </button>

                                    </form>

                                )}


                                {/* =================================================
                                    STEP 2 - OTP
                                ================================================= */}

                                {forgotStep === "otp" && (

                                    <form
                                        onSubmit={handleVerifyResetOTP}
                                        className="space-y-5"
                                    >

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                Enter 6-Digit OTP

                                            </label>


                                            <div className="relative">

                                                <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={otp}
                                                    disabled={
                                                        otpExpired ||
                                                        loading
                                                    }
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value
                                                                .replace(/\D/g, "")
                                                                .slice(0, 6);

                                                        setOtp(value);

                                                    }}
                                                    placeholder="Enter 6-digit OTP"
                                                    className={`w-full pl-11 pr-4 py-3.5 border rounded-xl outline-none focus:ring-2 transition ${
                                                        otpExpired
                                                            ? "bg-gray-100 border-red-300 cursor-not-allowed"
                                                            : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
                                                    }`}
                                                    required
                                                />

                                            </div>

                                        </div>


                                        {/* -----------------------------------------
                                            COUNTDOWN
                                        ----------------------------------------- */}

                                        {!otpExpired && otpTimeLeft > 0 && (

                                            <div className="flex items-center justify-center gap-2 text-indigo-600 bg-indigo-50 border border-indigo-100 rounded-xl py-3">

                                                <FaClock />

                                                <span className="text-sm font-medium">

                                                    OTP expires in

                                                </span>

                                                <span className="font-bold">

                                                    {formatOtpTime()}

                                                </span>

                                            </div>

                                        )}


                                        {/* -----------------------------------------
                                            EXPIRED MESSAGE
                                        ----------------------------------------- */}

                                        {otpExpired && (

                                            <div className="text-center bg-red-50 border border-red-200 rounded-xl p-4">

                                                <p className="text-red-600 text-sm font-semibold">

                                                    OTP has expired.

                                                </p>

                                                <p className="text-red-500 text-xs mt-1">

                                                    Please request a new OTP.

                                                </p>

                                            </div>

                                        )}


                                        {/* -----------------------------------------
                                            VERIFY BUTTON
                                        ----------------------------------------- */}

                                        <button
                                            type="submit"
                                            disabled={
                                                loading ||
                                                otpExpired ||
                                                otp.length !== 6
                                            }
                                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                        >

                                            {loading ? (

                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                                    Verifying...
                                                </>

                                            ) : (

                                                <>
                                                    Verify OTP

                                                    <FaArrowRight />

                                                </>

                                            )}

                                        </button>


                                        {/* -----------------------------------------
                                            RESEND OTP
                                        ----------------------------------------- */}

                                        <div className="text-center">

                                            {!otpExpired && otpTimeLeft > 0 ? (

                                                <p className="text-sm text-gray-500">

                                                    Resend OTP in{" "}

                                                    <span className="font-semibold text-indigo-600">

                                                        {formatOtpTime()}

                                                    </span>

                                                </p>

                                            ) : (

                                                <button
                                                    type="button"
                                                    onClick={handleResendResetOTP}
                                                    disabled={resendLoading}
                                                    className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 font-semibold text-sm disabled:text-gray-400"
                                                >

                                                    <FaRedo />

                                                    {resendLoading
                                                        ? "Sending..."
                                                        : "Resend OTP"}

                                                </button>

                                            )}

                                        </div>


                                        {/* -----------------------------------------
                                            CHANGE EMAIL
                                        ----------------------------------------- */}

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setForgotStep("email");

                                                setOtp("");

                                                setOtpTimeLeft(0);

                                                setOtpExpired(false);

                                                setError("");

                                                setResendMessage("");

                                            }}
                                            className="w-full text-sm text-gray-500 hover:text-indigo-600 transition"
                                        >

                                            Change email address

                                        </button>

                                    </form>

                                )}


                                {/* =================================================
                                    STEP 3 - NEW PASSWORD
                                ================================================= */}

                                {forgotStep === "password" && (

                                    <form
                                        onSubmit={handleResetPassword}
                                        className="space-y-5"
                                    >

                                        {/* New Password */}

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                New Password

                                            </label>


                                            <div className="relative">

                                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type={
                                                        showNewPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={newPassword}
                                                    onChange={(e) =>
                                                        setNewPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Enter new password"
                                                    className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    required
                                                />


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowNewPassword(
                                                            !showNewPassword
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                                >

                                                    {showNewPassword ? (
                                                        <FaEyeSlash />
                                                    ) : (
                                                        <FaEye />
                                                    )}

                                                </button>

                                            </div>


                                            <p className="text-xs text-gray-500 mt-2">

                                                Password must contain at least 6 characters.

                                            </p>

                                        </div>


                                        {/* Confirm Password */}

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                Confirm Password

                                            </label>


                                            <div className="relative">

                                                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type={
                                                        showConfirmPassword
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    value={confirmPassword}
                                                    onChange={(e) =>
                                                        setConfirmPassword(
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="Confirm new password"
                                                    className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    required
                                                />


                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setShowConfirmPassword(
                                                            !showConfirmPassword
                                                        )
                                                    }
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                                >

                                                    {showConfirmPassword ? (
                                                        <FaEyeSlash />
                                                    ) : (
                                                        <FaEye />
                                                    )}

                                                </button>

                                            </div>

                                        </div>


                                        {/* Reset Password */}

                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                        >

                                            {loading ? (

                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                                    Resetting Password...
                                                </>

                                            ) : (

                                                <>
                                                    Reset Password

                                                    <FaCheckCircle />

                                                </>

                                            )}

                                        </button>

                                    </form>

                                )}


                                {/* =================================================
                                    STEP 4 - SUCCESS
                                ================================================= */}

                                {forgotStep === "success" && (

                                    <div className="text-center">

                                        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-6">

                                            <FaCheckCircle className="text-green-600 text-4xl" />

                                        </div>


                                        <h3 className="text-xl font-bold text-gray-900 mb-2">

                                            Password Changed Successfully

                                        </h3>


                                        <p className="text-gray-500 mb-8">

                                            Your Eventora password has been
                                            updated successfully.

                                        </p>


                                        <button
                                            type="button"
                                            onClick={handleBackToLogin}
                                            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                        >

                                            <FaArrowLeft />

                                            Back to Login

                                        </button>

                                    </div>

                                )}

                            </div>

                        ) : (

                            /* =================================================
                                NORMAL LOGIN MODE
                            ================================================= */

                            <div className="max-w-md mx-auto">


                                {/* -----------------------------------------
                                    HEADER
                                ----------------------------------------- */}

                                <div className="text-center mb-8">

                                    <div className="lg:hidden flex justify-center mb-5">

                                        <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center">

                                            <FaTicketAlt className="text-indigo-600 text-2xl" />

                                        </div>

                                    </div>


                                    <h2 className="text-3xl font-bold text-gray-900">

                                        {showOTP
                                            ? "Verify OTP"
                                            : "Welcome Back"}

                                    </h2>


                                    <p className="text-gray-500 mt-2">

                                        {showOTP
                                            ? "Enter the OTP sent to your email."
                                            : "Login to continue to Eventora."}

                                    </p>

                                </div>


                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                {error && (

                                    <div className="mb-5 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">

                                        {error}

                                    </div>

                                )}


                                {/* =================================================
                                    NORMAL LOGIN FORM
                                ================================================= */}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-5"
                                >


                                    {/* EMAIL */}

                                    <div>

                                        <label className="block text-sm font-semibold text-gray-700 mb-2">

                                            Email Address

                                        </label>


                                        <div className="relative">

                                            <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                            <input
                                                type="email"
                                                value={email}
                                                disabled={showOTP}
                                                onChange={(e) =>
                                                    setEmail(e.target.value)
                                                }
                                                placeholder="Enter your email"
                                                className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition disabled:bg-gray-100"
                                                required
                                            />

                                        </div>

                                    </div>
                                
                                {/* PASSWORD */}
                                
                                {!showOTP && (
                                
                                    <div>
                                
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Password
                                        </label>
                                
                                        <div className="relative">
                                
                                            <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                
                                            <input
                                                type={
                                                    showPassword
                                                        ? "text"
                                                        : "password"
                                                }
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                placeholder="Enter your password"
                                                className="w-full pl-11 pr-12 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500                                 focus:border-indigo-500 transition"
                                                required
                                            />
                                
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowPassword(!showPassword)
                                                }
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-indigo-600"
                                            >
                                
                                                {showPassword ? (
                                                    <FaEyeSlash />
                                                ) : (
                                                    <FaEye />
                                                )}
                                
                                            </button>
                                
                                        </div>
                                
                                
                                        {/* FORGOT PASSWORD - BELOW PASSWORD, RIGHT SIDE */}
                                
                                        <div className="flex justify-end mt-2">
                                
                                            <button
                                                type="button"
                                                onClick={handleForgotPassword}
                                                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition"
                                            >
                                                Forgot Password?
                                            </button>
                                
                                        </div>
                                
                                    </div>
                                
                                )}


                                    {/* LOGIN OTP */}

                                    {showOTP && (

                                        <div>

                                            <label className="block text-sm font-semibold text-gray-700 mb-2">

                                                Enter OTP

                                            </label>


                                            <div className="relative">

                                                <FaShieldAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                                                <input
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={6}
                                                    value={otp}
                                                    onChange={(e) => {

                                                        const value =
                                                            e.target.value
                                                                .replace(/\D/g, "")
                                                                .slice(0, 6);

                                                        setOtp(value);

                                                    }}
                                                    placeholder="Enter 6-digit OTP"
                                                    className="w-full pl-11 pr-4 py-3.5 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                                    required
                                                />

                                            </div>

                                        </div>

                                    )}


                                    {/* SUBMIT */}

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2"
                                    >

                                        {loading ? (

                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>

                                                {showOTP
                                                    ? "Verifying..."
                                                    : "Logging in..."}

                                            </>

                                        ) : (

                                            <>
                                                {showOTP
                                                    ? "Verify OTP"
                                                    : "Login"}

                                                <FaArrowRight />

                                            </>

                                        )}

                                    </button>


                                    {/* BACK FROM OTP */}

                                    {showOTP && (

                                        <button
                                            type="button"
                                            onClick={() => {

                                                setShowOTP(false);

                                                setOtp("");

                                                setError("");

                                            }}
                                            className="w-full text-sm text-gray-500 hover:text-indigo-600 transition"
                                        >

                                            Back to login

                                        </button>

                                    )}

                                </form>


                                {/* =================================================
                                    REGISTER
                                ================================================= */}

                                {!showOTP && (

                                    <p className="text-center text-gray-500 text-sm mt-8">

                                        Don't have an account?{" "}

                                        <Link
                                            to="/register"
                                            className="font-semibold text-indigo-600 hover:text-indigo-700"
                                        >

                                            Create Account

                                        </Link>

                                    </p>

                                )}

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>

    );

};


export default Login;
