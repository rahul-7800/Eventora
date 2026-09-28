import React, {
    useState,
    useEffect,
    useContext
} from "react";

import {
    useParams,
    useNavigate,
    Link
} from "react-router-dom";

import api from "../utils/axios";

import { AuthContext } from "../context/AuthContext";

import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaChair,
    FaArrowLeft,
    FaShieldAlt,
    FaClock,
    FaCheckCircle,
    FaTicketAlt,
    FaLock,
    FaMinus,
    FaPlus
} from "react-icons/fa";


const EventDetail = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const { user } =
        useContext(AuthContext);


    // =========================================================
    // STATES
    // =========================================================

    const [event, setEvent] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [bookingLoading, setBookingLoading] =
        useState(false);


    // OTP
    const [otp, setOtp] =
        useState("");

    const [showOTP, setShowOTP] =
        useState(false);


    // Multiple tickets
    const [numberOfPeople, setNumberOfPeople] =
        useState(1);


    // OTP countdown
    const [otpTimeLeft, setOtpTimeLeft] =
        useState(0);

    const [otpExpired, setOtpExpired] =
        useState(false);

    const [resendLoading, setResendLoading] =
        useState(false);


    // Messages
    const [error, setError] =
        useState("");

    const [successMsg, setSuccessMsg] =
        useState("");


    // =========================================================
    // FETCH EVENT
    // =========================================================

    useEffect(() => {

        const fetchEvent = async () => {

            try {

                setLoading(true);

                setError("");

                const { data } =
                    await api.get(
                        `/events/${id}`
                    );

                console.log(
                    "Event details:",
                    data
                );

                setEvent(data);

            } catch (err) {

                console.error(
                    "Error loading event:",
                    err
                );

                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to load event details."
                );

            } finally {

                setLoading(false);

            }

        };


        fetchEvent();

    }, [id]);


    // =========================================================
    // OTP COUNTDOWN
    // =========================================================

    useEffect(() => {

        if (
            !showOTP ||
            otpTimeLeft <= 0
        ) {

            if (
                showOTP &&
                otpTimeLeft === 0
            ) {

                setOtpExpired(true);

            }

            return;

        }


        const timer =
            setInterval(() => {

                setOtpTimeLeft(
                    (previousTime) => {

                        if (
                            previousTime <= 1
                        ) {

                            clearInterval(
                                timer
                            );

                            setOtpExpired(
                                true
                            );

                            return 0;

                        }

                        return (
                            previousTime - 1
                        );

                    }
                );

            }, 1000);


        return () =>
            clearInterval(timer);

    }, [
        showOTP,
        otpTimeLeft
    ]);


    // =========================================================
    // FORMAT OTP TIME
    // =========================================================

    const formatOtpTime = () => {

        const minutes =
            Math.floor(
                otpTimeLeft / 60
            );

        const seconds =
            otpTimeLeft % 60;


        return `${String(
            minutes
        ).padStart(2, "0")}:${String(
            seconds
        ).padStart(2, "0")}`;

    };


    // =========================================================
    // SEND BOOKING OTP
    // =========================================================

    const sendBookingOTP =
        async () => {

            if (!user) {

                navigate("/login");

                return;

            }


            await api.post(
                "/bookings/send-otp",
                {
                    email: user.email
                }
            );


            setShowOTP(true);

            // 5 minutes
            setOtpTimeLeft(
                5 * 60
            );

            setOtpExpired(false);

            setOtp("");

            setError("");

            setSuccessMsg(
                "OTP sent to your email. Please check your inbox."
            );

        };


    // =========================================================
    // RESEND OTP
    // =========================================================

    const handleResendOTP =
        async () => {

            if (!user) {

                navigate("/login");

                return;

            }


            setResendLoading(true);

            setError("");

            setSuccessMsg("");


            try {

                await api.post(
                    "/bookings/send-otp",
                    {
                        email:
                            user.email
                    }
                );


                setOtp("");

                setOtpTimeLeft(
                    5 * 60
                );

                setOtpExpired(false);


                setSuccessMsg(
                    "New OTP sent to your email. Please check your inbox."
                );


            } catch (err) {

                console.error(
                    "Resend OTP error:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Failed to resend OTP. Please try again."
                );

            } finally {

                setResendLoading(
                    false
                );

            }

        };


    // =========================================================
    // INCREASE PEOPLE
    // =========================================================

    const increasePeople =
        () => {

            if (!event) return;


            const availableSeats =
                Number(
                    event.availableSeat
                ) || 0;


            if (
                numberOfPeople <
                availableSeats
            ) {

                setNumberOfPeople(
                    (previous) =>
                        previous + 1
                );

            }

        };


    // =========================================================
    // DECREASE PEOPLE
    // =========================================================

    const decreasePeople =
        () => {

            if (
                numberOfPeople > 1
            ) {

                setNumberOfPeople(
                    (previous) =>
                        previous - 1
                );

            }

        };


    // =========================================================
    // BOOKING
    // =========================================================

    const handleBooking =
        async () => {

            if (!user) {

                navigate("/login");

                return;

            }


            // -------------------------------------------------
            // OTP EXPIRED
            // -------------------------------------------------

            if (
                showOTP &&
                otpExpired
            ) {

                setError(
                    "OTP has expired. Please request a new OTP."
                );

                return;

            }


            // -------------------------------------------------
            // CURRENT AVAILABLE SEATS
            // -------------------------------------------------

            const currentAvailableSeats =
                Number(
                    event?.availableSeat
                ) || 0;


            // -------------------------------------------------
            // VALIDATE QUANTITY
            // -------------------------------------------------

            if (
                numberOfPeople < 1
            ) {

                setError(
                    "Please select at least 1 ticket."
                );

                return;

            }


            if (
                numberOfPeople >
                currentAvailableSeats
            ) {

                setError(
                    `Only ${currentAvailableSeats} seats are available.`
                );

                return;

            }


            setBookingLoading(
                true
            );

            setError("");

            setSuccessMsg("");


            try {

                // =================================================
                // SEND OTP
                // =================================================

                if (!showOTP) {

                    await sendBookingOTP();

                }

                // =================================================
                // VERIFY OTP & BOOK
                // =================================================

                else {

                    if (
                        otp.length !== 6
                    ) {

                        setError(
                            "Please enter the complete 6-digit OTP."
                        );

                        setBookingLoading(
                            false
                        );

                        return;

                    }


                    const response =
                        await api.post(
                            "/bookings",
                            {
                                eventId:
                                    event._id,

                                otp,

                                numberOfPeople
                            }
                        );


                    console.log(
                        "Booking response:",
                        response.data
                    );


                    setSuccessMsg(
                        `${numberOfPeople} ticket${
                            numberOfPeople > 1
                                ? "s"
                                : ""
                        } requested successfully! Awaiting admin confirmation.`
                    );


                    // Hide OTP
                    setShowOTP(false);

                    setOtp("");

                    setOtpTimeLeft(0);

                    setOtpExpired(false);


                    // IMPORTANT:
                    // Do NOT reduce availableSeat here.
                    // Backend reduces seats only after admin confirms.


                    // Reset ticket selector
                    setNumberOfPeople(1);

                }

            } catch (err) {

                console.error(
                    "Booking error:",
                    err
                );


                setError(
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Booking failed. Please try again."
                );

            } finally {

                setBookingLoading(
                    false
                );

            }

        };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <div className="min-h-[80vh] bg-slate-50 px-6 py-16">

                <div className="mx-auto max-w-6xl">

                    <div className="animate-pulse overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        <div className="h-80 bg-slate-200"></div>


                        <div className="grid gap-10 p-8 lg:grid-cols-[1fr_360px] lg:p-12">

                            <div className="space-y-5">

                                <div className="h-6 w-24 rounded bg-slate-200"></div>

                                <div className="h-12 w-3/4 rounded bg-slate-200"></div>

                                <div className="h-5 w-full rounded bg-slate-200"></div>

                                <div className="h-5 w-5/6 rounded bg-slate-200"></div>

                                <div className="h-5 w-2/3 rounded bg-slate-200"></div>

                            </div>


                            <div className="h-96 rounded-3xl bg-slate-200"></div>

                        </div>

                    </div>

                </div>

            </div>

        );

    }


    // =========================================================
    // ERROR
    // =========================================================

    if (
        error &&
        !event
    ) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50 px-6">

                <div className="max-w-md rounded-3xl border border-red-100 bg-white p-10 text-center shadow-xl">

                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-2xl text-red-500">

                        <FaTicketAlt />

                    </div>


                    <h2 className="mt-5 text-2xl font-black text-slate-900">

                        Unable to load event

                    </h2>


                    <p className="mt-3 text-slate-500">

                        {error}

                    </p>


                    <Link
                        to="/"
                        className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-violet-600"
                    >

                        <FaArrowLeft />

                        Back to Events

                    </Link>

                </div>

            </div>

        );

    }


    // =========================================================
    // EVENT NOT FOUND
    // =========================================================

    if (!event) {

        return (

            <div className="flex min-h-[70vh] items-center justify-center bg-slate-50">

                <div className="text-center">

                    <h2 className="text-3xl font-black text-slate-900">

                        Event not found

                    </h2>


                    <Link
                        to="/"
                        className="mt-6 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-bold text-white"
                    >

                        <FaArrowLeft />

                        Back Home

                    </Link>

                </div>

            </div>

        );

    }


    // =========================================================
    // EVENT DATA
    // =========================================================

    const availableSeats =
        Number(
            event.availableSeat
        ) || 0;


    const totalSeats =
        Number(
            event.totalSeat
        ) || 0;


    const ticketPrice =
        Number(
            event.ticketPrice
        ) || 0;


    const totalAmount =
        ticketPrice *
        numberOfPeople;


    const isSoldOut =
        availableSeats <= 0;


    const seatPercentage =
        totalSeats > 0
            ? Math.min(
                  100,
                  Math.max(
                      0,
                      (availableSeats /
                          totalSeats) *
                          100
                  )
              )
            : 0;


    const formattedDate =
        event.date
            ? new Date(
                  event.date
              ).toLocaleDateString(
                  "en-IN",
                  {
                      weekday:
                          "long",

                      day:
                          "numeric",

                      month:
                          "long",

                      year:
                          "numeric"
                  }
              )
            : "Date unavailable";


    // =========================================================
    // UI
    // =========================================================

    return (

        <div className="min-h-screen bg-slate-50">

            {/* =================================================
                BACK BUTTON
            ================================================= */}

            <div className="mx-auto max-w-7xl px-6 pt-8 lg:px-8">

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="group inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition duration-300 hover:text-violet-600"
                >

                    <FaArrowLeft className="transition-transform duration-300 group-hover:-translate-x-1" />

                    Back

                </button>

            </div>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="mx-auto max-w-7xl px-6 py-8 lg:px-8 lg:py-12">

                <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-xl">


                    {/* =================================================
                        HERO IMAGE
                    ================================================= */}

                    <div className="relative h-[320px] overflow-hidden sm:h-[420px]">

                        {event.imageUrl ? (

                            <img
                                src={
                                    event.imageUrl
                                }
                                alt={
                                    event.title ||
                                    "Event"
                                }
                                className="h-full w-full object-cover"
                            />

                        ) : (

                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-700 via-blue-700 to-slate-950">

                                <FaTicketAlt className="text-7xl text-white/30" />

                            </div>

                        )}


                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent"></div>


                        {/* Category */}

                        <div className="absolute left-6 top-6 sm:left-8 sm:top-8">

                            <span className="rounded-full border border-white/20 bg-white/90 px-4 py-2 text-xs font-black uppercase tracking-wider text-slate-900 shadow-lg backdrop-blur-md">

                                {event.category ||
                                    "Event"}

                            </span>

                        </div>


                        {/* Price */}

                        <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8">

                            <div className="rounded-2xl border border-white/10 bg-slate-950/80 px-5 py-3 text-white shadow-xl backdrop-blur-md">

                                <p className="text-xs font-medium text-slate-400">

                                    Ticket Price

                                </p>


                                <p className="text-2xl font-black">

                                    {ticketPrice ===
                                    0 ? (

                                        <span className="text-emerald-400">
                                            Free
                                        </span>

                                    ) : (

                                        `₹${ticketPrice}`

                                    )}

                                </p>

                            </div>

                        </div>


                        {/* Hero title */}

                        <div className="absolute bottom-6 left-6 max-w-3xl text-white sm:bottom-8 sm:left-8">

                            <p className="mb-2 flex items-center gap-2 text-sm font-bold text-violet-300">

                                <FaCheckCircle />

                                Eventora Experience

                            </p>


                            <h1 className="text-3xl font-black leading-tight sm:text-5xl">

                                {event.title}

                            </h1>

                        </div>

                    </div>


                    {/* =================================================
                        CONTENT
                    ================================================= */}

                    <div className="grid gap-10 p-6 sm:p-8 lg:grid-cols-[1fr_380px] lg:p-12">


                        {/* =================================================
                            LEFT SIDE
                        ================================================= */}

                        <div>


                            {/* Description */}

                            <div>

                                <p className="text-sm font-black uppercase tracking-widest text-violet-600">

                                    About this event

                                </p>


                                <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">

                                    Everything you need to know

                                </h2>


                                <p className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">

                                    {event.description ||
                                        "Join us for an amazing experience with Eventora."}

                                </p>

                            </div>


                            {/* =================================================
                                EVENT INFO
                            ================================================= */}

                            <div className="mt-10 grid gap-4 sm:grid-cols-2">


                                {/* Date */}

                                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600 transition duration-300 group-hover:scale-110">

                                            <FaCalendarAlt />

                                        </div>


                                        <div>

                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">

                                                Date

                                            </p>


                                            <p className="mt-1 font-bold text-slate-800">

                                                {formattedDate}

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Time */}

                                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 transition duration-300 group-hover:scale-110">

                                            <FaClock />

                                        </div>


                                        <div>

                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">

                                                Time

                                            </p>


                                            <p className="mt-1 font-bold text-slate-800">

                                                {event.time ||
                                                    "Time will be announced"}

                                            </p>

                                        </div>

                                    </div>

                                </div>


                                {/* Location */}

                                <div className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-lg sm:col-span-2">

                                    <div className="flex items-start gap-4">

                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-pink-600 transition duration-300 group-hover:scale-110">

                                            <FaMapMarkerAlt />

                                        </div>


                                        <div className="min-w-0">

                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">

                                                Location

                                            </p>


                                            <p className="mt-1 font-bold text-slate-800">

                                                {event.location ||
                                                    "Location unavailable"}

                                            </p>

                                        </div>

                                    </div>

                                </div>

                            </div>


                            {/* =================================================
                                SEAT STATUS
                            ================================================= */}

                            <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                                <div className="flex items-center justify-between gap-4">

                                    <div>

                                        <p className="text-sm font-bold text-slate-500">

                                            Seat availability

                                        </p>


                                        <p className="mt-1 text-xl font-black text-slate-900">

                                            {isSoldOut
                                                ? "Sold Out"
                                                : `${availableSeats} seats remaining`}

                                        </p>

                                    </div>


                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-xl text-violet-600">

                                        <FaChair />

                                    </div>

                                </div>


                                <div className="mt-5 h-3 overflow-hidden rounded-full bg-slate-100">

                                    <div
                                        className={`h-full rounded-full transition-all duration-1000 ${
                                            isSoldOut
                                                ? "bg-red-500"
                                                : availableSeats <=
                                                  10
                                                ? "bg-orange-500"
                                                : "bg-gradient-to-r from-violet-500 to-blue-500"
                                        }`}
                                        style={{
                                            width: `${seatPercentage}%`
                                        }}
                                    ></div>

                                </div>


                                <div className="mt-2 flex justify-between text-xs font-semibold text-slate-400">

                                    <span>

                                        {availableSeats} available

                                    </span>


                                    <span>

                                        {totalSeats} total

                                    </span>

                                </div>

                            </div>

                        </div>


                        {/* =================================================
                            BOOKING CARD
                        ================================================= */}

                        <aside>

                            <div className="sticky top-24 rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-lg sm:p-7">


                                {/* Heading */}

                                <div className="mb-6">

                                    <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-violet-600">

                                        <FaTicketAlt />

                                        Reserve your spot

                                    </div>


                                    <h2 className="mt-2 text-2xl font-black text-slate-900">

                                        Booking Details

                                    </h2>

                                </div>


                                {/* =================================================
                                    TICKET QUANTITY
                                ================================================= */}

                                <div className="rounded-2xl bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">

                                                Tickets

                                            </p>


                                            <p className="mt-1 text-sm font-semibold text-slate-600">

                                                Select number of people

                                            </p>

                                        </div>


                                        <FaTicketAlt className="text-xl text-violet-500" />

                                    </div>


                                    {/* Quantity selector */}

                                    <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-2">


                                        {/* Minus */}

                                        <button
                                            type="button"
                                            onClick={
                                                decreasePeople
                                            }
                                            disabled={
                                                numberOfPeople <=
                                                    1 ||
                                                bookingLoading ||
                                                !!successMsg
                                            }
                                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                        >

                                            <FaMinus />

                                        </button>


                                        {/* Number */}

                                        <div className="text-center">

                                            <p className="text-2xl font-black text-slate-900">

                                                {numberOfPeople}

                                            </p>


                                            <p className="text-xs font-semibold text-slate-400">

                                                {numberOfPeople ===
                                                1
                                                    ? "Person"
                                                    : "People"}

                                            </p>

                                        </div>


                                        {/* Plus */}

                                        <button
                                            type="button"
                                            onClick={
                                                increasePeople
                                            }
                                            disabled={
                                                numberOfPeople >=
                                                    availableSeats ||
                                                bookingLoading ||
                                                !!successMsg
                                            }
                                            className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-slate-700 shadow-sm transition hover:bg-violet-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
                                        >

                                            <FaPlus />

                                        </button>

                                    </div>


                                    <p className="mt-3 text-center text-xs text-slate-400">

                                        Maximum{" "}

                                        <span className="font-bold text-slate-600">

                                            {availableSeats}

                                        </span>{" "}

                                        tickets available

                                    </p>

                                </div>


                                {/* =================================================
                                    PRICE SUMMARY
                                ================================================= */}

                                <div className="mt-4 rounded-2xl bg-white p-5 shadow-sm">


                                    <div className="flex items-center justify-between text-sm">

                                        <span className="text-slate-500">

                                            Ticket price

                                        </span>


                                        <span className="font-bold text-slate-800">

                                            {ticketPrice ===
                                            0
                                                ? "Free"
                                                : `₹${ticketPrice}`}

                                        </span>

                                    </div>


                                    <div className="mt-3 flex items-center justify-between text-sm">

                                        <span className="text-slate-500">

                                            Quantity

                                        </span>


                                        <span className="font-bold text-slate-800">

                                            ×{" "}

                                            {numberOfPeople}

                                        </span>

                                    </div>


                                    <div className="my-4 border-t border-slate-100"></div>


                                    <div className="flex items-center justify-between">

                                        <span className="font-bold text-slate-700">

                                            Total Amount

                                        </span>


                                        <span className="text-2xl font-black text-violet-600">

                                            {totalAmount ===
                                            0
                                                ? "Free"
                                                : `₹${totalAmount}`}

                                        </span>

                                    </div>

                                </div>


                                {/* =================================================
                                    LOGIN INFO
                                ================================================= */}

                                {!user && (

                                    <div className="mt-5 rounded-2xl border border-violet-100 bg-violet-50 p-4">

                                        <p className="text-sm leading-6 text-violet-800">

                                            Please log in to request a booking.
                                            An OTP will be sent to your
                                            registered email.

                                        </p>

                                    </div>

                                )}


                                {/* =================================================
                                    OTP SECTION
                                ================================================= */}

                                {showOTP && (

                                    <div className="mt-5 rounded-2xl border border-violet-200 bg-white p-5 shadow-sm">


                                        {/* OTP Heading */}

                                        <div className="flex items-center gap-3">

                                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">

                                                <FaLock />

                                            </div>


                                            <div className="flex-1">

                                                <p className="font-bold text-slate-900">

                                                    Verify your booking

                                                </p>


                                                <p className="text-xs text-slate-500">

                                                    Enter the 6-digit OTP

                                                </p>

                                            </div>

                                        </div>


                                        {/* OTP COUNTDOWN */}

                                        <div
                                            className={`mt-4 rounded-xl p-3 text-center ${
                                                otpExpired
                                                    ? "border border-red-100 bg-red-50"
                                                    : "border border-violet-100 bg-violet-50"
                                            }`}
                                        >

                                            {otpExpired ? (

                                                <div>

                                                    <p className="text-sm font-bold text-red-600">

                                                        OTP expired

                                                    </p>


                                                    <p className="mt-1 text-xs text-red-500">

                                                        Please request a new OTP
                                                        to continue.

                                                    </p>

                                                </div>

                                            ) : (

                                                <div>

                                                    <p className="text-xs font-semibold text-slate-500">

                                                        OTP expires in

                                                    </p>


                                                    <div className="mt-1 flex items-center justify-center gap-2">

                                                        <FaClock className="text-violet-500" />


                                                        <p className="text-2xl font-black text-violet-600">

                                                            {formatOtpTime()}

                                                        </p>

                                                    </div>

                                                </div>

                                            )}

                                        </div>


                                        {/* OTP INPUT */}

                                        <input
                                            type="text"
                                            inputMode="numeric"
                                            autoComplete="one-time-code"
                                            placeholder={
                                                otpExpired
                                                    ? "OTP expired"
                                                    : "Enter 6-digit OTP"
                                            }
                                            maxLength={6}
                                            value={otp}
                                            disabled={
                                                otpExpired
                                            }
                                            onChange={(
                                                e
                                            ) =>
                                                setOtp(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                            className={`mt-5 w-full rounded-xl border px-4 py-4 text-center text-xl font-black tracking-[0.5em] outline-none transition duration-300 ${
                                                otpExpired
                                                    ? "cursor-not-allowed border-red-100 bg-red-50 text-slate-400 placeholder:text-red-300"
                                                    : "border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-500/10"
                                            }`}
                                        />


                                        {/* RESEND OTP */}

                                        {otpExpired && (

                                            <button
                                                type="button"
                                                onClick={
                                                    handleResendOTP
                                                }
                                                disabled={
                                                    resendLoading
                                                }
                                                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-violet-200 bg-violet-50 py-3 text-sm font-black text-violet-600 transition duration-300 hover:bg-violet-100 disabled:cursor-not-allowed disabled:opacity-50"
                                            >

                                                {resendLoading ? (

                                                    <>

                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-violet-300 border-t-violet-600"></span>

                                                        Sending OTP...

                                                    </>

                                                ) : (

                                                    <>

                                                        <FaClock />

                                                        Resend OTP

                                                    </>

                                                )}

                                            </button>

                                        )}

                                    </div>

                                )}


                                {/* =================================================
                                    BOOKING BUTTON
                                ================================================= */}

                                <button
                                    type="button"
                                    onClick={
                                        handleBooking
                                    }
                                    disabled={
                                        isSoldOut ||
                                        bookingLoading ||
                                        (
                                            showOTP &&
                                            (
                                                otp.length !==
                                                    6 ||
                                                otpExpired
                                            )
                                        ) ||
                                        (
                                            successMsg &&
                                            !showOTP
                                        )
                                    }
                                    className={`mt-6 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-base font-black transition-all duration-300 ${
                                        isSoldOut ||
                                        (
                                            successMsg &&
                                            !showOTP
                                        ) ||
                                        (
                                            showOTP &&
                                            otpExpired
                                        )
                                            ? "cursor-not-allowed bg-slate-200 text-slate-400"
                                            : "bg-slate-950 text-white shadow-lg hover:-translate-y-1 hover:bg-violet-600 hover:shadow-xl hover:shadow-violet-500/20"
                                    }`}
                                >

                                    {bookingLoading ? (

                                        <>

                                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>

                                            Processing...

                                        </>

                                    ) : showOTP &&
                                      otpExpired ? (

                                        <>

                                            <FaClock />

                                            OTP Expired

                                        </>

                                    ) : showOTP ? (

                                        <>

                                            <FaCheckCircle />

                                            Verify OTP & Confirm

                                        </>

                                    ) : successMsg ? (

                                        <>

                                            <FaCheckCircle />

                                            Request Sent

                                        </>

                                    ) : isSoldOut ? (

                                        "Sold Out"

                                    ) : !user ? (

                                        "Login to Book"

                                    ) : (

                                        <>

                                            <FaTicketAlt />

                                            Request Booking

                                        </>

                                    )}

                                </button>


                                {/* =================================================
                                    ERROR
                                ================================================= */}

                                {error && (

                                    <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-4 text-center text-sm font-semibold text-red-600">

                                        {error}

                                    </div>

                                )}


                                {/* =================================================
                                    SUCCESS
                                ================================================= */}

                                {successMsg && (

                                    <div className="mt-4 rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-center text-sm font-semibold text-emerald-700">

                                        <div className="mb-1 flex items-center justify-center gap-2">

                                            <FaCheckCircle />

                                            Success

                                        </div>


                                        {successMsg}

                                    </div>

                                )}


                                {/* =================================================
                                    SECURITY
                                ================================================= */}

                                <div className="mt-6 border-t border-slate-200 pt-5">

                                    <div className="flex items-start gap-3">

                                        <FaShieldAlt className="mt-1 text-emerald-500" />


                                        <p className="text-xs leading-5 text-slate-500">

                                            Your booking request is protected.
                                            OTP verification helps keep your
                                            Eventora account secure.

                                        </p>

                                    </div>

                                </div>

                            </div>

                        </aside>

                    </div>

                </div>

            </main>

        </div>

    );

};


export default EventDetail;