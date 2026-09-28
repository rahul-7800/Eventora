import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import {
    FaTicketAlt,
    FaTimesCircle,
    FaCalendarAlt,
    FaRupeeSign,
    FaArrowRight,
    FaCheckCircle,
    FaClock,
    FaBan,
    FaCompass,
} from "react-icons/fa";

const UserDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        fetchBookings();
    }, [user, navigate]);

    const fetchBookings = async () => {
        try {
            setLoading(true);

            const { data } = await api.get("/bookings/my");

            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        } finally {
            setLoading(false);
        }
    };

    const cancelBooking = async (id) => {
        if (
            window.confirm(
                "Are you sure you want to cancel this booking request?"
            )
        ) {
            try {
                await api.delete(`/bookings/${id}`);

                fetchBookings();
            } catch (error) {
                alert(
                    error.response?.data?.message ||
                        "Error cancelling booking"
                );
            }
        }
    };

    // ================= LOADING =================
    if (loading) {
        return (
            <div className="min-h-[80vh] bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-7xl">

                    <div className="animate-pulse">

                        <div className="h-48 rounded-3xl bg-slate-200"></div>

                        <div className="mt-8 grid gap-5 sm:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-32 rounded-2xl bg-slate-200"
                                ></div>
                            ))}
                        </div>

                        <div className="mt-10 h-8 w-56 rounded bg-slate-200"></div>

                        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {[1, 2, 3].map((item) => (
                                <div
                                    key={item}
                                    className="h-80 rounded-3xl bg-slate-200"
                                ></div>
                            ))}
                        </div>

                    </div>

                </div>
            </div>
        );
    }

    // ================= STATISTICS =================

    const totalBookings = bookings.length;

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "confirmed"
    ).length;

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "pending"
    ).length;

    return (
        <div className="min-h-screen bg-slate-50">

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

                {/* ================= WELCOME ================= */}
                <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 shadow-xl sm:p-10 lg:p-12">

                    {/* Background effects */}
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-violet-600/30 blur-3xl"></div>

                    <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl"></div>

                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left">

                            {/* Avatar */}
                            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-3xl font-black uppercase text-white shadow-lg shadow-violet-500/20">
                                {user?.name?.charAt(0) || "U"}
                            </div>

                            <div>

                                <p className="mb-2 text-sm font-bold uppercase tracking-widest text-violet-300">
                                    Welcome back
                                </p>

                                <h1 className="text-3xl font-black text-white sm:text-4xl">
                                    {user?.name || "User"}!
                                </h1>

                                <p className="mt-2 text-slate-400">
                                    Manage your Eventora bookings and
                                    discover new experiences.
                                </p>

                            </div>

                        </div>

                        {/* Browse button */}
                        <Link
                            to="/"
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:text-white"
                        >
                            Explore Events
                            <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>

                    </div>

                </section>

                {/* ================= STATS ================= */}
                <section className="mt-7 grid gap-5 sm:grid-cols-3">

                    {/* Total */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Total Bookings
                                </p>

                                <p className="mt-2 text-3xl font-black text-slate-900">
                                    {totalBookings}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-600 transition duration-300 group-hover:scale-110">
                                <FaTicketAlt />
                            </div>

                        </div>

                    </div>

                    {/* Confirmed */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Confirmed
                                </p>

                                <p className="mt-2 text-3xl font-black text-emerald-600">
                                    {confirmedBookings}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-600 transition duration-300 group-hover:scale-110">
                                <FaCheckCircle />
                            </div>

                        </div>

                    </div>

                    {/* Pending */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-semibold text-slate-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-black text-orange-500">
                                    {pendingBookings}
                                </p>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl text-orange-500 transition duration-300 group-hover:scale-110">
                                <FaClock />
                            </div>

                        </div>

                    </div>

                </section>

                {/* ================= BOOKINGS HEADER ================= */}
                <section className="mt-12">

                    <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">

                        <div>
                            <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-violet-600">
                                <FaTicketAlt />
                                Your Activity
                            </div>

                            <h2 className="text-3xl font-black text-slate-900">
                                My Booking Requests
                            </h2>

                            <p className="mt-2 text-slate-500">
                                Track your event registrations and booking
                                status.
                            </p>
                        </div>

                        {bookings.length > 0 && (
                            <span className="rounded-full bg-white px-5 py-2 text-sm font-bold text-slate-600 shadow-sm">
                                {bookings.length}{" "}
                                {bookings.length === 1
                                    ? "booking"
                                    : "bookings"}
                            </span>
                        )}

                    </div>

                    {/* ================= EMPTY STATE ================= */}
                    {bookings.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center shadow-sm">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-50 text-3xl text-violet-500">
                                <FaCompass />
                            </div>

                            <h3 className="mt-6 text-2xl font-black text-slate-900">
                                No bookings yet
                            </h3>

                            <p className="mx-auto mt-3 max-w-md leading-7 text-slate-500">
                                You haven't requested a booking for any
                                event yet. Explore Eventora and find your
                                next experience.
                            </p>

                            <Link
                                to="/"
                                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-violet-600 hover:shadow-lg"
                            >
                                Browse Events
                                <FaArrowRight />
                            </Link>

                        </div>
                    ) : (
                        /* ================= BOOKINGS ================= */
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                            {bookings.map((booking) => {

                                const event = booking.eventId;

                                const statusStyles =
                                    booking.status === "confirmed"
                                        ? "bg-emerald-100 text-emerald-700"
                                        : booking.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-orange-100 text-orange-700";

                                return (
                                    <article
                                        key={booking._id}
                                        className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
                                    >

                                        {/* ================= IMAGE ================= */}
                                        <div className="relative h-48 overflow-hidden bg-slate-200">

                                            {event?.imageUrl ? (
                                                <img
                                                    src={event.imageUrl}
                                                    alt={event.title}
                                                    className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-600 to-blue-600">
                                                    <FaTicketAlt className="text-5xl text-white/40" />
                                                </div>
                                            )}

                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                                            {/* Status */}
                                            <div className="absolute left-4 top-4">
                                                <span
                                                    className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg ${statusStyles}`}
                                                >
                                                    {booking.status}
                                                </span>
                                            </div>

                                            {/* Payment */}
                                            {booking.status !== "cancelled" && (
                                                <div className="absolute bottom-4 right-4">

                                                    <span
                                                        className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg ${
                                                            booking.paymentStatus ===
                                                            "paid"
                                                                ? "bg-blue-100 text-blue-700"
                                                                : "bg-white/90 text-slate-700"
                                                        }`}
                                                    >
                                                        {booking.paymentStatus ||
                                                            "non-paid"}
                                                    </span>

                                                </div>
                                            )}

                                        </div>

                                        {/* ================= CONTENT ================= */}
                                        <div className="flex flex-grow flex-col p-6">

                                            {event ? (
                                                <>
                                                    <h3 className="line-clamp-2 text-xl font-black leading-tight text-slate-900 transition duration-300 group-hover:text-violet-600">
                                                        {event.title}
                                                    </h3>

                                                    {/* Event info */}
                                                    <div className="mt-5 space-y-3">

                                                        <div className="flex items-center gap-3 text-sm text-slate-600">

                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                                                                <FaCalendarAlt />
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-slate-400">
                                                                    Event Date
                                                                </p>

                                                                <p className="font-bold text-slate-700">
                                                                    {event.date
                                                                        ? new Date(
                                                                              event.date
                                                                          ).toLocaleDateString(
                                                                              "en-IN",
                                                                              {
                                                                                  day: "numeric",
                                                                                  month: "short",
                                                                                  year: "numeric",
                                                                              }
                                                                          )
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                        </div>

                                                        <div className="flex items-center gap-3 text-sm text-slate-600">

                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                                <FaRupeeSign />
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-slate-400">
                                                                    Amount
                                                                </p>

                                                                <p className="font-bold text-slate-700">
                                                                    {Number(
                                                                        booking.amount
                                                                    ) === 0
                                                                        ? "Free"
                                                                        : `₹${booking.amount}`}
                                                                </p>
                                                            </div>

                                                        </div>

                                                        <div className="flex items-center gap-3 text-sm text-slate-600">

                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
                                                                <FaClock />
                                                            </div>

                                                            <div>
                                                                <p className="text-xs text-slate-400">
                                                                    Requested
                                                                </p>

                                                                <p className="font-bold text-slate-700">
                                                                    {booking.bookedAt
                                                                        ? new Date(
                                                                              booking.bookedAt
                                                                          ).toLocaleDateString(
                                                                              "en-IN"
                                                                          )
                                                                        : "N/A"}
                                                                </p>
                                                            </div>

                                                        </div>

                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex flex-grow flex-col items-center justify-center py-8 text-center">

                                                    <FaBan className="text-3xl text-red-400" />

                                                    <p className="mt-4 font-bold text-red-500">
                                                        Event unavailable
                                                    </p>

                                                    <p className="mt-1 text-sm text-slate-500">
                                                        This event may have
                                                        been deleted.
                                                    </p>

                                                </div>
                                            )}

                                        </div>

                                        {/* ================= FOOTER ================= */}
                                        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 p-4">

                                            {event &&
                                            booking.status !==
                                                "cancelled" ? (
                                                <>
                                                    <Link
                                                        to={`/events/${event._id}`}
                                                        className="group/link inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition duration-300 hover:text-violet-600"
                                                    >
                                                        View Event
                                                        <FaArrowRight className="text-xs transition-transform duration-300 group-hover/link:translate-x-1" />
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            cancelBooking(
                                                                booking._id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-1.5 text-sm font-bold text-red-500 transition duration-300 hover:text-red-700"
                                                    >
                                                        <FaTimesCircle />
                                                        Cancel
                                                    </button>
                                                </>
                                            ) : (
                                                <div className="flex w-full items-center justify-center gap-2 text-sm font-semibold text-slate-400">
                                                    <FaBan />
                                                    Booking Cancelled
                                                </div>
                                            )}

                                        </div>

                                    </article>
                                );
                            })}

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
};

export default UserDashboard;

//import React, { useState, useEffect, useContext } from 'react';
//import { AuthContext } from '../context/AuthContext';
//import api from '../utils/axios';
//import { Link, useNavigate } from 'react-router-dom';
//import { FaTicketAlt, FaTimesCircle } from 'react-icons/fa';
//
//const UserDashboard = () => {
//    const { user } = useContext(AuthContext);
//    const navigate = useNavigate();
//    const [bookings, setBookings] = useState([]);
//    const [loading, setLoading] = useState(true);
//
//    useEffect(() => {
//        if (!user) {
//            navigate('/login');
//            return;
//        }
//        fetchBookings();
//    }, [user, navigate]);
//
//    const fetchBookings = async () => {
//        try {
//            const { data } = await api.get('/bookings/my');
//            setBookings(data);
//        } catch (error) {
//            console.error('Error fetching bookings', error);
//        } finally {
//            setLoading(false);
//        }
//    };
//
//    const cancelBooking = async (id) => {
//        if (window.confirm('Are you sure you want to cancel this booking request?')) {
//            try {
//                await api.delete(`/bookings/${id}`);
//                fetchBookings();
//            } catch (error) {
//                alert(error.response?.data?.message || 'Error cancelling booking');
//            }
//        }
//    };
//
//    if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading dashboard...</div>;
//
//    return (
//        <div className="max-w-6xl mx-auto">
//            <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 mb-8 border border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-6">
//                <div className="w-20 h-20 bg-gray-200 text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold uppercase tracking-widest shrink-0">
//                    {user?.name.charAt(0)}
//                </div>
//                <div className="flex flex-col items-center sm:items-start">
//                    <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">Welcome, {user?.name}!</h1>
//                    <p className="text-gray-500 flex items-center justify-center sm:justify-start gap-2">
//                        <span className="w-2 h-2 rounded-full bg-green-500"></span> User Dashboard
//                    </p>
//                </div>
//            </div>
//
//            <div className="flex items-center justify-between mb-6">
//                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2 sm:gap-3">
//                    <FaTicketAlt className="text-gray-700" /> My Bookings requests
//                </h2>
//            </div>
//
//            {bookings.length === 0 ? (
//                <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
//                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
//                        <FaTicketAlt className="text-gray-300 text-3xl" />
//                    </div>
//                    <p className="text-xl text-gray-500 mb-6 mt-4 font-medium">You haven't booked any events yet.</p>
//                    <Link to="/" className="inline-block bg-gray-900 hover:bg-black text-white font-bold py-3 px-8 rounded-lg transition shadow-md">
//                        Browse Events
//                    </Link>
//                </div>
//            ) : (
//                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                    {bookings.map((booking) => (
//                        <div key={booking._id} className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col">
//                            <div className="p-6 border-b border-gray-50 flex-grow">
//                                {booking.eventId ? (
//                                    <>
//                                        <div className="flex justify-between items-start mb-4">
//                                            <h3 className="text-lg font-bold text-gray-900 leading-tight">{booking.eventId.title}</h3>
//                                            <div className="flex flex-col gap-1 items-end">
//                                                <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
//                                                    booking.status === 'cancelled' ? 'bg-red-100 text-red-700' :
//                                                        'bg-yellow-100 text-yellow-700'
//                                                    }`}>
//                                                    {booking.status}
//                                                </span>
//                                                {booking.status !== 'cancelled' && (
//                                                    <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
//                                                        }`}>
//                                                        {booking.paymentStatus.replace('_', ' ')}
//                                                    </span>
//                                                )}
//                                            </div>
//                                        </div>
//                                        <div className="text-sm text-gray-500 mb-4 space-y-1">
//                                            <p><strong className="text-gray-700">Date:</strong> {new Date(booking.eventId.date).toLocaleDateString()}</p>
//                                            <p><strong className="text-gray-700">Amount:</strong> {booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</p>
//                                            <p><strong className="text-gray-700">Requested:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
//                                        </div>
//                                    </>
//                                ) : (
//                                    <p className="text-red-500 italic">Event details unavailable (might have been deleted)</p>
//                                )}
//                            </div>
//                            <div className="p-4 bg-gray-50 flex justify-between items-center shrink-0">
//                                {booking.eventId && booking.status !== 'cancelled' ? (
//                                    <>
//                                        <Link to={`/events/${booking.eventId._id}`} className="text-gray-900 font-semibold text-sm hover:underline">View Event</Link>
//                                        <button
//                                            onClick={() => cancelBooking(booking._id)}
//                                            className="text-red-500 font-semibold text-sm hover:text-red-700 transition flex items-center gap-1"
//                                        >
//                                            <FaTimesCircle /> Cancel
//                                        </button>
//                                    </>
//                                ) : (
//                                    <div className="w-full text-center text-sm text-gray-500 italic">Booking Cancelled</div>
//                                )}
//                            </div>
//                        </div>
//                    ))}
//                </div>
//            )}
//        </div>
//    );
//};
//
//export default UserDashboard;