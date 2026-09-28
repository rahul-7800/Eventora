import React from "react";
import { Link } from "react-router-dom";
import {
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaStar,
    FaArrowRight,
} from "react-icons/fa";

const EventCard = ({ event }) => {

    const availableSeats = Number(event.availableSeat) || 0;
    const totalSeats = Number(event.totalSeat) || 0;

    const seatPercentage =
        totalSeats > 0
            ? Math.min(100, Math.max(0, (availableSeats / totalSeats) * 100))
            : 0;

    const isSoldOut = availableSeats <= 0;

    const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
          })
        : "Date unavailable";

    return (
        <article className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">

            {/* ================= IMAGE ================= */}
            <div className="relative h-60 overflow-hidden bg-slate-200">

                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title || "Event"}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-violet-500 to-blue-600 text-white">
                        <span className="text-lg font-bold">
                            Eventora
                        </span>
                    </div>
                )}

                {/* Image overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />


                {/* Category */}
                <div className="absolute left-4 top-4">
                    <span className="rounded-full border border-white/20 bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-800 shadow-lg backdrop-blur-md">
                        {event.category || "Event"}
                    </span>
                </div>


                {/* Price */}
                <div className="absolute bottom-4 right-4">
                    <span className="rounded-xl bg-slate-950/85 px-4 py-2 text-sm font-bold text-white shadow-lg backdrop-blur-md">
                        ₹{event.ticketPrice ?? 0}
                    </span>
                </div>


                {/* Sold out */}
                {isSoldOut && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                        <span className="rounded-full bg-red-500 px-5 py-2 text-sm font-bold text-white shadow-lg">
                            Sold Out
                        </span>
                    </div>
                )}

            </div>


            {/* ================= CONTENT ================= */}
            <div className="p-6">

                {/* Featured */}
                <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-violet-600">
                    <FaStar />
                    Featured Event
                </div>


                {/* Title */}
                <h3 className="line-clamp-1 text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-violet-600">
                    {event.title || "Untitled Event"}
                </h3>


                {/* Description */}
                <p className="mt-2 line-clamp-2 min-h-12 text-sm leading-6 text-slate-500">
                    {event.description || "Discover this amazing experience with Eventora."}
                </p>


                {/* ================= EVENT INFO ================= */}

                {/* Date */}
                <div className="mt-5 flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition duration-300 group-hover:scale-105">
                        <FaCalendarAlt />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-slate-400">
                            Date
                        </p>

                        <p className="truncate text-sm font-semibold text-slate-700">
                            {formattedDate}
                        </p>
                    </div>

                </div>


                {/* Location */}
                <div className="mt-3 flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition duration-300 group-hover:scale-105">
                        <FaMapMarkerAlt />
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs text-slate-400">
                            Location
                        </p>

                        <p className="truncate text-sm font-semibold text-slate-700">
                            {event.location || "Location unavailable"}
                        </p>
                    </div>

                </div>


                {/* ================= SEATS ================= */}
                <div className="mt-5">

                    <div className="mb-2 flex items-center justify-between">

                        <span className="text-xs font-medium text-slate-500">
                            Available seats
                        </span>

                        <span
                            className={`text-xs font-bold ${
                                isSoldOut
                                    ? "text-red-500"
                                    : availableSeats <= 10
                                    ? "text-orange-500"
                                    : "text-slate-700"
                            }`}
                        >
                            {isSoldOut
                                ? "Sold out"
                                : `${availableSeats} / ${totalSeats}`}
                        </span>

                    </div>


                    {/* Progress */}
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                                isSoldOut
                                    ? "bg-red-500"
                                    : availableSeats <= 10
                                    ? "bg-orange-500"
                                    : "bg-gradient-to-r from-violet-500 to-blue-500"
                            }`}
                            style={{
                                width: `${seatPercentage}%`,
                            }}
                        />

                    </div>

                </div>


                {/* ================= BUTTON ================= */}
                {isSoldOut ? (
                    <button
                        disabled
                        className="mt-6 w-full cursor-not-allowed rounded-xl bg-slate-100 py-3.5 font-bold text-slate-400"
                    >
                        Sold Out
                    </button>
                ) : (
                    <Link
                        to={`/events/${event._id}`}
                        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-950 py-3.5 font-bold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-violet-600 hover:shadow-lg hover:shadow-violet-500/25"
                    >
                        View Event

                        <FaArrowRight className="text-sm transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                )}

            </div>

        </article>
    );
};

export default EventCard;