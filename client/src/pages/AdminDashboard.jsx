import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import {
    FaCalendarAlt,
    FaTicketAlt,
    FaUsers,
    FaClock,
    FaCheckCircle,
    FaTimesCircle,
    FaPlus,
    FaTrash,
    FaMapMarkerAlt,
    FaRupeeSign,
    FaChartLine,
    FaTimes,
    FaImage,
    FaArrowRight,
    FaSpinner,
} from "react-icons/fa";

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [events, setEvents] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [showEventForm, setShowEventForm] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
    });

    useEffect(() => {
        if (!user || user.role !== "admin") {
            navigate("/login");
            return;
        }

        fetchData();
    }, [user, navigate]);

    // ================= FETCH DATA =================

    const fetchData = async () => {
        try {
            setLoading(true);

            const [eventsRes, bookingsRes] = await Promise.all([
                api.get("/events"),
                api.get("/bookings/pending"),
            ]);

            setEvents(eventsRes.data);
            setBookings(bookingsRes.data);
        } catch (error) {
            console.error("Error fetching admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    // ================= FORM CHANGE =================

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // ================= CREATE EVENT =================

    const handleCreateEvent = async (e) => {
        e.preventDefault();

        try {
            setActionLoading("create");

            const eventData = {
                title: formData.title,
                description: formData.description,
                date: formData.date,
                location: formData.location,
                category: formData.category,
                totalSeat: Number(formData.totalSeats),
                availableSeat: Number(formData.totalSeats),
                ticketPrice: Number(formData.ticketPrice),
                imageUrl: formData.image,
            };

            console.log("Creating event:", eventData);

            await api.post("/events", eventData);

            alert("Event created successfully!");

            setShowEventForm(false);

            setFormData({
                title: "",
                description: "",
                date: "",
                location: "",
                category: "",
                totalSeats: "",
                ticketPrice: "",
                image: "",
            });

            fetchData();
        } catch (error) {
            console.error("Create event error:", error);

            alert(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Error creating event"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ================= DELETE EVENT =================

    const handleDeleteEvent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this event?")) {
            return;
        }

        try {
            setActionLoading(`delete-${id}`);

            await api.delete(`/events/${id}`);

            fetchData();
        } catch (error) {
            console.error("Delete event error:", error);

            alert(
                error.response?.data?.message ||
                    "Error deleting event"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ================= CONFIRM BOOKING =================

    const handleConfirmBooking = async (id, paymentStatus) => {
        try {
            setActionLoading(`confirm-${id}`);

            console.log("Booking ID:", id);
            console.log("Payment Status:", paymentStatus);

            const response = await api.put(
                `/bookings/${id}/confirm`,
                { paymentStatus }
            );

            console.log("Confirm response:", response.data);

            fetchData();
        } catch (error) {
            console.error("Confirm booking error:", error);

            alert(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Error confirming booking"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ================= REJECT BOOKING =================

    const handleCancelBooking = async (id) => {
        if (!window.confirm("Reject this booking request?")) {
            return;
        }

        try {
            setActionLoading(`reject-${id}`);

            console.log("Reject Booking ID:", id);

            const response = await api.put(
                `/bookings/${id}/reject`
            );

            console.log("Reject response:", response.data);

            alert("Booking rejected successfully");

            fetchData();
        } catch (error) {
            console.error("Reject booking error:", error);

            alert(
                error.response?.data?.error ||
                    error.response?.data?.message ||
                    "Error rejecting booking"
            );
        } finally {
            setActionLoading(null);
        }
    };

    // ================= STATISTICS =================

    const pendingBookings = bookings.filter(
        (booking) => booking.status === "pending"
    );

    const confirmedBookings = bookings.filter(
        (booking) => booking.status === "confirmed"
    );

    const paidBookings = bookings.filter(
        (booking) =>
            booking.paymentStatus === "paid" &&
            booking.status === "confirmed"
    );

    const totalRevenue = paidBookings.reduce(
        (sum, booking) => sum + Number(booking.amount || 0),
        0
    );

    const paidClients = new Set(
        paidBookings
            .map((booking) => booking.userId?._id)
            .filter(Boolean)
    ).size;

    // ================= LOADING =================

    if (loading) {
        return (
            <div className="min-h-[80vh] bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-7xl animate-pulse">

                    <div className="h-52 rounded-[2rem] bg-slate-200"></div>

                    <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <div
                                key={item}
                                className="h-32 rounded-2xl bg-slate-200"
                            />
                        ))}
                    </div>

                    <div className="mt-10 h-8 w-60 rounded bg-slate-200"></div>

                    <div className="mt-6 grid gap-6 lg:grid-cols-2">
                        <div className="h-[500px] rounded-3xl bg-slate-200"></div>
                        <div className="h-[500px] rounded-3xl bg-slate-200"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">

            <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8 lg:py-14">

                {/* ================================================= */}
                {/* ADMIN HERO */}
                {/* ================================================= */}

                <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 p-8 text-white shadow-xl sm:p-10 lg:p-12">

                    <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-violet-600/30 blur-3xl" />

                    <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />

                    <div className="relative flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between">

                        <div className="flex items-center gap-5">

                            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-blue-500 text-2xl font-black shadow-lg shadow-violet-500/20">
                                {user?.name?.charAt(0) || "A"}
                            </div>

                            <div>
                                <p className="text-sm font-bold uppercase tracking-widest text-violet-300">
                                    Eventora Administration
                                </p>

                                <h1 className="mt-1 text-3xl font-black sm:text-4xl">
                                    Admin Dashboard
                                </h1>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                                    Manage events, review booking requests
                                    and monitor your platform activity.
                                </p>
                            </div>

                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setShowEventForm(!showEventForm)
                            }
                            className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-slate-950 transition duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:text-white"
                        >
                            {showEventForm ? (
                                <>
                                    <FaTimes />
                                    Close Form
                                </>
                            ) : (
                                <>
                                    <FaPlus />
                                    Create New Event
                                </>
                            )}
                        </button>

                    </div>
                </section>

                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <section className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Revenue */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Total Revenue
                                </p>

                                <h3 className="mt-2 text-3xl font-black text-emerald-600">
                                    ₹{totalRevenue}
                                </h3>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-600 transition group-hover:scale-110">
                                <FaRupeeSign />
                            </div>

                        </div>
                    </div>

                    {/* Paid clients */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Paid Clients
                                </p>

                                <h3 className="mt-2 text-3xl font-black text-blue-600">
                                    {paidClients}
                                </h3>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600 transition group-hover:scale-110">
                                <FaUsers />
                            </div>

                        </div>
                    </div>

                    {/* Pending */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Pending Requests
                                </p>

                                <h3 className="mt-2 text-3xl font-black text-orange-500">
                                    {pendingBookings.length}
                                </h3>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-xl text-orange-500 transition group-hover:scale-110">
                                <FaClock />
                            </div>

                        </div>
                    </div>

                    {/* Events */}
                    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                                    Total Events
                                </p>

                                <h3 className="mt-2 text-3xl font-black text-violet-600">
                                    {events.length}
                                </h3>
                            </div>

                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-600 transition group-hover:scale-110">
                                <FaCalendarAlt />
                            </div>

                        </div>
                    </div>

                </section>

                {/* ================================================= */}
                {/* CREATE EVENT */}
                {/* ================================================= */}

                {showEventForm && (
                    <section className="mt-8 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                        <div className="border-b border-slate-100 bg-slate-50 px-6 py-6 sm:px-8">

                            <div className="flex items-center gap-4">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-600">
                                    <FaPlus />
                                </div>

                                <div>
                                    <h2 className="text-2xl font-black text-slate-900">
                                        Create New Event
                                    </h2>

                                    <p className="mt-1 text-sm text-slate-500">
                                        Add a new event to your Eventora
                                        platform.
                                    </p>
                                </div>

                            </div>
                        </div>

                        <form
                            onSubmit={handleCreateEvent}
                            className="grid gap-5 p-6 sm:grid-cols-2 sm:p-8"
                        >

                            {/* Title */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Event Title
                                </label>

                                <input
                                    required
                                    name="title"
                                    type="text"
                                    placeholder="e.g. Tech Innovation Summit"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Category
                                </label>

                                <input
                                    required
                                    name="category"
                                    type="text"
                                    placeholder="e.g. Technology, Music"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Date */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Event Date
                                </label>

                                <input
                                    required
                                    name="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Location */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Location
                                </label>

                                <input
                                    required
                                    name="location"
                                    type="text"
                                    placeholder="e.g. New Delhi"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Seats */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Total Seats
                                </label>

                                <input
                                    required
                                    min="1"
                                    name="totalSeats"
                                    type="number"
                                    placeholder="e.g. 100"
                                    value={formData.totalSeats}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Price */}
                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Ticket Price
                                </label>

                                <input
                                    required
                                    min="0"
                                    name="ticketPrice"
                                    type="number"
                                    placeholder="0 for free event"
                                    value={formData.ticketPrice}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />
                            </div>

                            {/* Image */}
                            <div className="sm:col-span-2">

                                <label className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-700">
                                    <FaImage className="text-violet-500" />
                                    Event Image URL
                                </label>

                                <input
                                    name="image"
                                    type="url"
                                    placeholder="https://example.com/event-image.jpg"
                                    value={formData.image}
                                    onChange={handleInputChange}
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />

                            </div>

                            {/* Description */}
                            <div className="sm:col-span-2">

                                <label className="mb-2 block text-sm font-bold text-slate-700">
                                    Event Description
                                </label>

                                <textarea
                                    required
                                    name="description"
                                    rows="5"
                                    placeholder="Describe your event..."
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
                                />

                            </div>

                            {/* Submit */}
                            <div className="flex justify-end sm:col-span-2">

                                <button
                                    type="submit"
                                    disabled={actionLoading === "create"}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-7 py-3.5 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-violet-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                                >
                                    {actionLoading === "create" ? (
                                        <>
                                            <FaSpinner className="animate-spin" />
                                            Publishing...
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus />
                                            Publish Event
                                        </>
                                    )}
                                </button>

                            </div>

                        </form>
                    </section>
                )}

                {/* ================================================= */}
                {/* MAIN CONTENT */}
                {/* ================================================= */}

                <section className="mt-12 grid gap-8 lg:grid-cols-2">

                    {/* ================================================= */}
                    {/* EVENTS */}
                    {/* ================================================= */}

                    <div>

                        <div className="mb-6 flex items-end justify-between">

                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-violet-600">
                                    <FaCalendarAlt />
                                    Event Management
                                </div>

                                <h2 className="text-2xl font-black text-slate-900">
                                    All Events
                                </h2>
                            </div>

                            <span className="rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
                                {events.length}
                            </span>

                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                            {events.length === 0 ? (
                                <div className="px-6 py-16 text-center">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">
                                        <FaCalendarAlt />
                                    </div>

                                    <h3 className="mt-5 font-bold text-slate-800">
                                        No events created
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        Create your first Eventora event.
                                    </p>

                                </div>
                            ) : (
                                <div className="max-h-[650px] overflow-y-auto">

                                    {events.map((event) => {

                                        const availableSeats =
                                            Number(event.availableSeat) || 0;

                                        const totalSeats =
                                            Number(event.totalSeat) || 0;

                                        const seatPercentage =
                                            totalSeats > 0
                                                ? Math.round(
                                                      (availableSeats /
                                                          totalSeats) *
                                                          100
                                                  )
                                                : 0;

                                        return (
                                            <div
                                                key={event._id}
                                                className="group border-b border-slate-100 p-5 transition duration-300 last:border-b-0 hover:bg-slate-50"
                                            >

                                                <div className="flex gap-4">

                                                    {/* Image */}
                                                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-200">

                                                        {event.imageUrl ? (
                                                            <img
                                                                src={
                                                                    event.imageUrl
                                                                }
                                                                alt={
                                                                    event.title
                                                                }
                                                                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                                                                <FaTicketAlt />
                                                            </div>
                                                        )}

                                                    </div>

                                                    {/* Details */}
                                                    <div className="min-w-0 flex-1">

                                                        <div className="flex flex-col justify-between gap-2 sm:flex-row">

                                                            <div>
                                                                <h3 className="line-clamp-1 font-black text-slate-900">
                                                                    {
                                                                        event.title
                                                                    }
                                                                </h3>

                                                                <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                                                    <FaMapMarkerAlt className="text-violet-500" />
                                                                    {
                                                                        event.location
                                                                    }
                                                                </p>
                                                            </div>

                                                            <span className="h-fit w-fit rounded-full bg-violet-50 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-600">
                                                                {
                                                                    event.category ||
                                                                    "Event"
                                                                }
                                                            </span>

                                                        </div>

                                                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-slate-500">

                                                            <span className="flex items-center gap-1.5">
                                                                <FaCalendarAlt className="text-blue-500" />
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
                                                            </span>

                                                            <span className="flex items-center gap-1.5">
                                                                <FaUsers className="text-emerald-500" />
                                                                {
                                                                    availableSeats
                                                                }{" "}
                                                                /{" "}
                                                                {totalSeats}{" "}
                                                                seats
                                                            </span>

                                                            <span className="flex items-center gap-1.5">
                                                                <FaRupeeSign className="text-orange-500" />
                                                                {Number(
                                                                    event.ticketPrice
                                                                ) === 0
                                                                    ? "Free"
                                                                    : event.ticketPrice}
                                                            </span>

                                                        </div>

                                                        {/* Seat progress */}
                                                        <div className="mt-3">

                                                            <div className="mb-1 flex justify-between text-[10px] font-bold text-slate-400">
                                                                <span>
                                                                    Seat
                                                                    availability
                                                                </span>

                                                                <span>
                                                                    {
                                                                        seatPercentage
                                                                    }
                                                                    %
                                                                </span>
                                                            </div>

                                                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                                                                <div
                                                                    className={`h-full rounded-full transition-all ${
                                                                        availableSeats <=
                                                                        0
                                                                            ? "bg-red-500"
                                                                            : availableSeats <=
                                                                              10
                                                                            ? "bg-orange-500"
                                                                            : "bg-emerald-500"
                                                                    }`}
                                                                    style={{
                                                                        width: `${seatPercentage}%`,
                                                                    }}
                                                                />
                                                            </div>

                                                        </div>

                                                    </div>

                                                </div>

                                                {/* Delete */}
                                                <div className="mt-4 flex justify-end">

                                                    <button
                                                        type="button"
                                                        disabled={
                                                            actionLoading ===
                                                            `delete-${event._id}`
                                                        }
                                                        onClick={() =>
                                                            handleDeleteEvent(
                                                                event._id
                                                            )
                                                        }
                                                        className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                                                    >
                                                        {actionLoading ===
                                                        `delete-${event._id}` ? (
                                                            <FaSpinner className="animate-spin" />
                                                        ) : (
                                                            <FaTrash />
                                                        )}
                                                        Delete
                                                    </button>

                                                </div>

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </div>
                    </div>

                    {/* ================================================= */}
                    {/* BOOKINGS */}
                    {/* ================================================= */}

                    <div>

                        <div className="mb-6 flex items-end justify-between">

                            <div>
                                <div className="mb-2 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-orange-500">
                                    <FaTicketAlt />
                                    User Activity
                                </div>

                                <h2 className="text-2xl font-black text-slate-900">
                                    Booking Requests
                                </h2>
                            </div>

                            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-black text-orange-700">
                                {pendingBookings.length}
                            </span>

                        </div>

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">

                            {bookings.length === 0 ? (
                                <div className="px-6 py-16 text-center">

                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-400">
                                        <FaTicketAlt />
                                    </div>

                                    <h3 className="mt-5 font-bold text-slate-800">
                                        No booking requests
                                    </h3>

                                    <p className="mt-2 text-sm text-slate-500">
                                        New booking requests will appear here.
                                    </p>

                                </div>
                            ) : (
                                <div className="max-h-[650px] overflow-y-auto">

                                    {bookings.map((booking) => {

                                        const isPending =
                                            booking.status === "pending";

                                        const isConfirmed =
                                            booking.status === "confirmed";

                                        return (
                                            <div
                                                key={booking._id}
                                                className={`border-b border-slate-100 p-5 transition last:border-b-0 hover:bg-slate-50 ${
                                                    isPending
                                                        ? "border-l-4 border-l-orange-400"
                                                        : isConfirmed
                                                        ? "border-l-4 border-l-emerald-400"
                                                        : "border-l-4 border-l-red-400"
                                                }`}
                                            >

                                                {/* Header */}
                                                <div className="flex items-start justify-between gap-4">

                                                    <div className="min-w-0">

                                                        <h3 className="line-clamp-2 font-black text-slate-900">
                                                            {
                                                                booking.eventId
                                                                    ?.title
                                                            }
                                                        </h3>

                                                        <p className="mt-1 text-xs text-slate-400">
                                                            Booking ID:{" "}
                                                            {booking._id.slice(
                                                                -8
                                                            )}
                                                        </p>

                                                    </div>

                                                    <div className="flex shrink-0 flex-col items-end gap-1.5">

                                                        <span
                                                            className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                                isConfirmed
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : booking.status ===
                                                                      "cancelled"
                                                                    ? "bg-red-100 text-red-700"
                                                                    : "bg-orange-100 text-orange-700"
                                                            }`}
                                                        >
                                                            {
                                                                booking.status
                                                            }
                                                        </span>

                                                        {booking.status !==
                                                            "cancelled" && (
                                                            <span
                                                                className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                                                                    booking.paymentStatus ===
                                                                    "paid"
                                                                        ? "bg-blue-100 text-blue-700"
                                                                        : "bg-slate-100 text-slate-600"
                                                                }`}
                                                            >
                                                                {booking.paymentStatus ||
                                                                    "non-paid"}
                                                            </span>
                                                        )}

                                                    </div>

                                                </div>

                                                {/* User info */}
                                                <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50 p-4">

                                                    <div className="flex items-center gap-3">

                                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-blue-500 font-bold uppercase text-white">
                                                            {booking.userId?.name?.charAt(
                                                                0
                                                            ) || "U"}
                                                        </div>

                                                        <div className="min-w-0">

                                                            <p className="truncate text-sm font-bold text-slate-800">
                                                                {booking.userId
                                                                    ?.name ||
                                                                    "Unknown User"}
                                                            </p>

                                                            <p className="truncate text-xs text-slate-500">
                                                                {booking.userId
                                                                    ?.email ||
                                                                    "Email unavailable"}
                                                            </p>

                                                        </div>

                                                    </div>

                                                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4">

                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Amount
                                                            </p>

                                                            <p className="mt-1 font-bold text-slate-700">
                                                                {Number(
                                                                    booking.amount
                                                                ) === 0
                                                                    ? "Free"
                                                                    : `₹${booking.amount}`}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                                                Requested
                                                            </p>

                                                            <p className="mt-1 font-bold text-slate-700">
                                                                {booking.bookedAt
                                                                    ? new Date(
                                                                          booking.bookedAt
                                                                      ).toLocaleDateString(
                                                                          "en-IN",
                                                                          {
                                                                              day: "numeric",
                                                                              month: "short",
                                                                          }
                                                                      )
                                                                    : "N/A"}
                                                            </p>
                                                        </div>

                                                    </div>

                                                    {booking.eventId && (
                                                        <div className="mt-3 flex items-center justify-between rounded-lg bg-white px-3 py-2 text-xs">

                                                            <span className="font-semibold text-slate-500">
                                                                Seats remaining
                                                            </span>

                                                            <span
                                                                className={`font-black ${
                                                                    Number(
                                                                        booking
                                                                            .eventId
                                                                            .availableSeat
                                                                    ) <= 0
                                                                        ? "text-red-500"
                                                                        : "text-emerald-600"
                                                                }`}
                                                            >
                                                                {
                                                                    booking
                                                                        .eventId
                                                                        .availableSeat
                                                                }{" "}
                                                                /{" "}
                                                                {
                                                                    booking
                                                                        .eventId
                                                                        .totalSeat
                                                                }
                                                            </span>

                                                        </div>
                                                    )}

                                                </div>

                                                {/* Actions */}
                                                {isPending && (
                                                    <div className="mt-4 grid gap-2 sm:grid-cols-3">

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionLoading ===
                                                                `confirm-${booking._id}`
                                                            }
                                                            onClick={() =>
                                                                handleConfirmBooking(
                                                                    booking._id,
                                                                    "paid"
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-3 py-3 text-xs font-black text-emerald-700 transition hover:bg-emerald-600 hover:text-white disabled:opacity-50"
                                                        >
                                                            {actionLoading ===
                                                            `confirm-${booking._id}` ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaCheckCircle />
                                                            )}
                                                            Approve Paid
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionLoading ===
                                                                `confirm-${booking._id}`
                                                            }
                                                            onClick={() =>
                                                                handleConfirmBooking(
                                                                    booking._id,
                                                                    "non-paid"
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-3 py-3 text-xs font-black text-slate-700 transition hover:bg-slate-900 hover:text-white disabled:opacity-50"
                                                        >
                                                            <FaCheckCircle />
                                                            Approve Non-Paid
                                                        </button>

                                                        <button
                                                            type="button"
                                                            disabled={
                                                                actionLoading ===
                                                                `reject-${booking._id}`
                                                            }
                                                            onClick={() =>
                                                                handleCancelBooking(
                                                                    booking._id
                                                                )
                                                            }
                                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-50 px-3 py-3 text-xs font-black text-red-600 transition hover:bg-red-500 hover:text-white disabled:opacity-50"
                                                        >
                                                            {actionLoading ===
                                                            `reject-${booking._id}` ? (
                                                                <FaSpinner className="animate-spin" />
                                                            ) : (
                                                                <FaTimesCircle />
                                                            )}
                                                            Reject
                                                        </button>

                                                    </div>
                                                )}

                                                {/* Confirmed message */}
                                                {isConfirmed && (
                                                    <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                                                        <FaCheckCircle />
                                                        Booking confirmed
                                                        successfully.
                                                    </div>
                                                )}

                                            </div>
                                        );
                                    })}

                                </div>
                            )}

                        </div>
                    </div>

                </section>

                {/* ================================================= */}
                {/* QUICK ACTIONS */}
                {/* ================================================= */}

                <section className="mt-12">

                    <div className="mb-6">
                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                            Quick Access
                        </p>

                        <h2 className="mt-1 text-2xl font-black text-slate-900">
                            Manage Eventora
                        </h2>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                        <button
                            type="button"
                            onClick={() => setShowEventForm(true)}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-xl text-violet-600 transition group-hover:scale-110">
                                    <FaPlus />
                                </div>

                                <FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-violet-500" />

                            </div>

                            <h3 className="mt-5 font-black text-slate-900">
                                Create Event
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Publish a new event on Eventora.
                            </p>

                        </button>

                        <Link
                            to="/"
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl text-blue-600 transition group-hover:scale-110">
                                    <FaChartLine />
                                </div>

                                <FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-500" />

                            </div>

                            <h3 className="mt-5 font-black text-slate-900">
                                View Website
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                See the public Eventora experience.
                            </p>

                        </Link>

                        <button
                            type="button"
                            onClick={fetchData}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                        >
                            <div className="flex items-center justify-between">

                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-xl text-emerald-600 transition group-hover:scale-110">
                                    <FaChartLine />
                                </div>

                                <FaArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-500" />

                            </div>

                            <h3 className="mt-5 font-black text-slate-900">
                                Refresh Data
                            </h3>

                            <p className="mt-1 text-sm text-slate-500">
                                Reload events and booking requests.
                            </p>

                        </button>

                    </div>

                </section>

            </main>
        </div>
    );
};

export default AdminDashboard;

//import React, { useState, useEffect, useContext } from 'react';
//import { AuthContext } from '../context/AuthContext';
//import api from '../utils/axios';
//import { useNavigate } from 'react-router-dom';
//
//const AdminDashboard = () => {
//    const { user } = useContext(AuthContext);
//    const navigate = useNavigate();
//    const [events, setEvents] = useState([]);
//    const [bookings, setBookings] = useState([]);
//    const [loading, setLoading] = useState(true);
//
//    const [showEventForm, setShowEventForm] = useState(false);
//    const [formData, setFormData] = useState({
//        title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: ''
//    });
//
//    useEffect(() => {
//        if (!user || user.role !== 'admin') {
//            navigate('/login');
//            return;
//        }
//        fetchData();
//    }, [user, navigate]);
//
//    const fetchData = async () => {
//        try {
//            const [eventsRes, bookingsRes] = await Promise.all([
//                api.get('/events'),
//                api.get('/bookings/pending') // Admin gets all pending bookings
//            ]);
//            setEvents(eventsRes.data);
//            setBookings(bookingsRes.data);
//        } catch (error) {
//            console.error('Error fetching admin data', error);
//        } finally {
//            setLoading(false);
//        }
//    };
//
//    /*const handleCreateEvent = async (e) => {
//        e.preventDefault();
//        try {
//            await api.post('/events', formData);
//            setShowEventForm(false);
//            setFormData({ title: '', description: '', date: '', location: '', category: '', totalSeats: '', ticketPrice: '', image: '' });
//            fetchData();
//        } catch (error) {
//            alert(error.response?.data?.message || 'Error creating event');
//        }
//    };*/
//
//    const handleCreateEvent = async (e) => {
//    e.preventDefault();
//
//    try {
//        const eventData = {
//            title: formData.title,
//            description: formData.description,
//            date: formData.date,
//            location: formData.location,
//            category: formData.category,
//            totalSeat: Number(formData.totalSeats),
//            availableSeat: Number(formData.totalSeats),
//            ticketPrice: Number(formData.ticketPrice),
//            imageUrl: formData.image
//        };
//
//        console.log("Creating event:", eventData);
//
//        await api.post('/events', eventData);
//
//        alert('Event created successfully!');
//
//        setShowEventForm(false);
//
//        setFormData({
//            title: '',
//            description: '',
//            date: '',
//            location: '',
//            category: '',
//            totalSeats: '',
//            ticketPrice: '',
//            image: ''
//        });
//
//        fetchData();
//
//    } catch (error) {
//        console.error('Create event error:', error);
//        console.error('Backend response:', error.response?.data);
//
//        alert(
//            error.response?.data?.error ||
//            error.response?.data?.message ||
//            'Error creating event'
//        );
//    }
//    };
//
//
//    const handleDeleteEvent = async (id) => {
//        if (window.confirm('Are you sure you want to delete this event?')) {
//            try {
//                await api.delete(`/events/${id}`);
//                fetchData();
//            } catch (error) {
//                alert('Error deleting event');
//            }
//        }
//    };
//
//    /*const handleConfirmBooking = async (id, paymentStatus) => {
//        try {
//            await api.put(`/bookings/${id}/confirm`, { paymentStatus });
//            fetchData();
//        } catch (error) {
//            alert(error.response?.data?.message || 'Error confirming booking');
//        }
//    };*/
//
//    const handleConfirmBooking = async (id, paymentStatus) => {
//    try {
//        console.log("Booking ID:", id);
//        console.log("Payment Status:", paymentStatus);
//
//        const response = await api.put(
//            `/bookings/${id}/confirm`,
//            { paymentStatus }
//        );
//
//        console.log("Confirm response:", response.data);
//
//        fetchData();
//
//    } catch (error) {
//        console.error("Confirm booking error:", error);
//        console.error("Status:", error.response?.status);
//        console.error("Backend error:", error.response?.data);
//
//        alert(
//            error.response?.data?.error ||
//            error.response?.data?.message ||
//            "Error confirming booking"
//        );
//    }
//};
//
//    /* const handleCancelBooking = async (id) => {
//        if (window.confirm('Cancel this user\'s booking request?')) {
//            try {
//                await api.delete(`/bookings/${id}`);
//                fetchData();
//            } catch (error) {
//                alert(error.response?.data?.message || 'Error cancelling booking');
//            }
//        }
//    }; */

// const handleCancelBooking = async (id) => {
//   try {
//       console.log("Reject Booking ID:", id);
//
//       const response = await api.put(`/bookings/${id}/reject`);
//
//       console.log("Reject response:", response.data);
//
//       alert("Booking rejected successfully");
//       fetchData();
//
//   } catch (error) {
//       console.error("Reject booking error:", error);
//       console.error("Status:", error.response?.status);
//       console.error("Backend error:", error.response?.data);
//
//       alert(
//           error.response?.data?.error ||
//           error.response?.data?.message ||
//           "Error rejecting booking"
//       );
//   }
//;
//
//   if (loading) return <div className="text-center py-20 text-xl font-semibold">Loading admin panel...</div>;
//
//   return (
//       <div className="max-w-7xl mx-auto">
//           <div className="bg-black text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
//               <div>
//                   <h1 className="text-2xl sm:text-3xl font-extrabold mb-2">Admin Dashboard</h1>
//                   <p className="text-gray-300">Manage events and manually confirm bookings.</p>
//               </div>
//               <button
//                   onClick={() => setShowEventForm(!showEventForm)}
//                   className="w-full md:w-auto bg-white text-black font-bold py-3 px-6 rounded-lg hover:bg-gray-100 transition shadow-md"
//               >
//                   {showEventForm ? 'Cancel Creation' : '+ Create New Event'}
//               </button>
//           </div>
//
//           {/* Admin Stats Row */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//                   <div>
//                       <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Total Revenue</p>
//                       <h3 className="text-3xl font-black text-green-600">₹{bookings.reduce((sum, b) => b.paymentStatus === 'paid' && b.status === 'confirmed' ? sum + b.amount : sum, 0)}</h3>
//                   </div>
//                   <div className="w-12 h-12 bg-green-100 text-green-500 rounded-full flex items-center justify-center text-xl font-bold">₹</div>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//                   <div>
//                       <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Paid Clients</p>
//                       <h3 className="text-3xl font-black text-blue-600">{new Set(bookings.filter(b => b.paymentStatus === 'paid' && b.status === 'confirmed').map(b => b.userId?._id)).size}</h3>
//                   </div>
//                   <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center text-xl font-bold">👤</div>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
//                   <div>
//                       <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">Pending Requests</p>
//                       <h3 className="text-3xl font-black text-yellow-600">{bookings.filter(b => b.status === 'pending').length}</h3>
//                   </div>
//                   <div className="w-12 h-12 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-xl font-bold">⏳</div>
//               </div>
//           </div>
//
//           {showEventForm && (
//               <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-8 animation-slideDown">
//                   <h2 className="text-2xl font-bold mb-6 text-gray-800">Create New Event</h2>
//                   <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <input required type="text" placeholder="Event Title" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} />
//                       <input required type="text" placeholder="Category (e.g., Tech, Music)" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
//                       <input required type="date" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
//                       <input required type="text" placeholder="Location" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.location} onChange={e => setFormData({ ...formData, location: e.target.value })} />
//                       <input required type="number" placeholder="Total Seats" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.totalSeats} onChange={e => setFormData({ ...formData, totalSeats: e.target.value })} />
//                       <input required type="number" placeholder="Ticket Price (0 for free)" className="border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.ticketPrice} onChange={e => setFormData({ ...formData, ticketPrice: e.target.value })} />
//
//                       <div className="md:col-span-2">
//                           <input type="text" placeholder="Image URL (Provide any direct link to an image)" className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} />
//                       </div>
//
//                       <textarea required placeholder="Event Description" className="border px-4 py-3 rounded-lg md:col-span-2 h-32 focus:ring-2 focus:ring-gray-700 outline-none transition" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
//                       <button type="submit" className="md:col-span-2 bg-gray-900 text-white font-bold py-3 mt-2 rounded-lg hover:bg-black transition shadow-md">Publish Event</button>
//                   </form>
//               </div>
//           )}
//
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//               {/* Events Section */}
//               <div className="flex flex-col">
//                   <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-600 text-sm">{events.length}</span>
//                       All Events
//                   </h2>
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                       <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
//                           {events.length === 0 ? <li className="p-6 text-gray-500 text-center">No events created yet.</li> :
//                               events.map(event => (
//                                   <li key={event._id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-gray-50 transition border-b border-gray-100 last:border-0">
//                                       <div>
//                                           <h4 className="font-bold text-gray-900 mb-1 leading-tight">{event.title}</h4>
//                                           <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
//                                               <span className="flex items-center gap-1 font-medium"><div className="w-2 h-2 rounded-full bg-blue-500"></div> {new Date(event.date).toLocaleDateString()}</span>
//                                               <span className="flex items-center gap-1 font-medium"><div className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div> {event.availableSeats}/{event.totalSeats} seats</span>
//                                           </div>
//                                       </div>
//                                       <button onClick={() => handleDeleteEvent(event._id)} className="w-full sm:w-auto text-red-500 hover:text-white hover:bg-red-500 border border-red-200 px-4 py-2 rounded-lg text-sm font-bold transition shadow-sm shrink-0">
//                                           Delete
//                                       </button>
//                                   </li>
//                               ))
//                           }
//                       </ul>
//                   </div>
//               </div>
//
//               {/* Bookings Section */}
//               <div className="flex flex-col">
//                   <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-3">
//                       <span className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 text-sm font-bold">{bookings.length}</span>
//                       Booking Requests
//                   </h2>
//                   <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
//                       <ul className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
//                           {bookings.length === 0 ? <li className="p-6 text-gray-500 text-center">No bookings yet.</li> :
//                               bookings.map(booking => (
//                                   <li key={booking._id} className={`p-6 hover:bg-gray-50 transition border-l-4 ${booking.status === 'pending' ? 'border-l-yellow-400' : booking.status === 'confirmed' ? 'border-l-green-400' : 'border-l-red-400'}`}>
//                                       <div className="flex justify-between items-start mb-3">
//                                           <h4 className="font-bold text-gray-900 text-lg leading-tight">{booking.eventId?.title || 'Deleted Event'}</h4>
//                                           <div className="flex flex-col gap-1 items-end shrink-0 ml-4">
//                                               <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>{booking.status}</span>
//                                               {booking.status !== 'cancelled' && <span className={`px-2 py-1 text-[10px] font-black rounded uppercase tracking-wider ${booking.paymentStatus === 'paid' ? 'bg-indigo-100 text-indigo-700' : 'bg-gray-200 text-gray-800'}`}>{booking.paymentStatus.replace('_', ' ')}</span>}
//                                           </div>
//                                       </div>
//                                       <div className="bg-gray-50 rounded-lg p-3 mb-3 border border-gray-100 text-sm">
//                                           <p className="text-gray-700 flex items-center gap-2 mb-1">
//                                               <span className="font-bold w-16 text-gray-500 uppercase text-xs">User:</span>
//                                               <span className="font-semibold">{booking.userId?.name}</span>
//                                               <span className="text-gray-400">({booking.userId?.email})</span>
//                                           </p>
//                                           <p className="text-gray-700 flex items-center gap-2 mb-1">
//                                               <span className="font-bold w-16 text-gray-500 uppercase text-xs">Amount:</span>
//                                               <span className={`font-semibold ${booking.amount === 0 ? 'text-green-600' : ''}`}>{booking.amount === 0 ? 'Free' : `₹${booking.amount}`}</span>
//                                           </p>
//                                           <p className="text-gray-700 flex items-center gap-2 mb-1">
//                                               <span className="font-bold w-16 text-gray-500 uppercase text-xs">Date:</span>
//                                               <span>{new Date(booking.bookedAt).toLocaleString()}</span>
//                                           </p>
//                                           {booking.eventId && (
//                                               <p className="text-gray-700 flex items-center gap-2 mt-2 pt-2 border-t border-gray-200">
//                                                   <span className="font-bold w-16 text-gray-500 uppercase text-xs">Seats:</span>
//                                                   <span className={`font-bold ${booking.eventId.availableSeats > 0 ? 'text-green-600' : 'text-red-500'}`}>{booking.eventId.availableSeats}</span> remaining of {booking.eventId.totalSeats}
//                                               </p>
//                                           )}
//                                       </div>
//
//                                       {/* Action buttons for admin */}
//                                       {booking.status === 'pending' && (
//                                           <div className="flex flex-wrap gap-2 mt-2">
//                                               <button onClick={() => handleConfirmBooking(booking._id, 'paid')} className="flex-1 min-w-[120px] bg-green-50 text-green-700 hover:bg-green-600 hover:text-white border border-green-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition">
//                                                   ✓ Approve as Paid
//                                               </button>
//                                               <button onClick={() => handleConfirmBooking(booking._id, 'non-paid')} className="flex-1 min-w-[120px] bg-gray-50 text-gray-700 hover:bg-gray-800 hover:text-white border border-gray-200 text-xs font-bold py-2.5 px-3 rounded-lg shadow-sm transition">
//                                                   ✓ Approve Undecided
//                                               </button>
//                                               <button onClick={() => handleCancelBooking(booking._id)} className="w-[80px] bg-red-50 text-red-600 hover:bg-red-500 hover:text-white border border-red-200 text-xs font-bold py-2.5 px-3 rounded-lg transition">
//                                                   ✕ Reject
//                                               </button>
//                                           </div>
//                                       )}
//                                   </li>
//                               ))
//                           }
//                       </ul>
//                   </div>
//               </div>
//           </div>
//       </div>
//   );
//;
//
//xport default AdminDashboard;