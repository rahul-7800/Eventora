import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import EventCard from "../components/EventCard";
import {
   FaSearch,
    FaRegClock,
    FaTicketAlt,
    FaShieldAlt,
    FaFire,
    FaBolt,
} from "react-icons/fa";

const Home = () => {
    const [events, setEvents] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchEvents();
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const fetchEvents = async () => {
        try {
            setLoading(true);

            const { data } = await api.get(
                `/events?search=${encodeURIComponent(search)}`
            );

            setEvents(data);
        } catch (error) {
            console.error("Error fetching events:", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    const getSeatPercentage = (event) => {
        if (!event.totalSeat) return 0;

        return Math.min(
            100,
            Math.max(0, (event.availableSeat / event.totalSeat) * 100)
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">

            {/* ================= HERO ================= */}
            <section className="relative overflow-hidden bg-slate-950">

                {/* Background effects */}
                <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-violet-600/30 blur-3xl animate-pulse"></div>

                <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl"></div>

                <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-pink-600/20 blur-3xl"></div>

                <div className="relative mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">

                    <div className="mx-auto max-w-4xl text-center">

                        {/* Badge */}
                        <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md animate-bounce">
                            <FaFire className="text-orange-400" />
                            Discover what's happening near you
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">

                            Experience
                            <span className="block bg-gradient-to-r from-blue-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                                Events That Matter
                            </span>

                        </h1>

                        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">
                            Find concerts, conferences, workshops and unforgettable
                            experiences. Discover your next favorite event with Eventora.
                        </p>

                        {/* Search */}
                        <div className="mx-auto mt-10 max-w-3xl">

                            <div className="group relative">

                                <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-lg text-slate-400 transition group-focus-within:text-violet-500" />

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search events, concerts, workshops..."
                                    className="w-full rounded-2xl border border-white/10 bg-white py-5 pl-14 pr-6 text-base text-slate-900 shadow-2xl outline-none transition duration-300 placeholder:text-slate-400 focus:border-violet-400 focus:ring-4 focus:ring-violet-500/20"
                                />

                            </div>

                        </div>

                        {/* Quick categories */}
                        <div className="mt-7 flex flex-wrap justify-center gap-3">

                            {["Music", "Technology", "Business", "Workshop", "Sports"].map(
                                (category) => (
                                    <button
                                        key={category}
                                        onClick={() => setSearch(category)}
                                        className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/10 hover:text-white"
                                    >
                                        {category}
                                    </button>
                                )
                            )}

                        </div>

                    </div>

                </div>

                {/* Bottom curve */}
                <div className="absolute bottom-0 left-0 h-12 w-full bg-slate-50 [clip-path:ellipse(60%_100%_at_50%_100%)]"></div>

            </section>


            {/* ================= FEATURES ================= */}
            <section className="bg-slate-50 py-16">

                <div className="mx-auto max-w-7xl px-6 lg:px-8">

                    <div className="grid gap-6 md:grid-cols-3">

                        {[
                            {
                                icon: FaTicketAlt,
                                title: "Easy Booking",
                                text: "Find and reserve tickets in just a few clicks.",
                            },
                            {
                                icon: FaShieldAlt,
                                title: "Secure Experience",
                                text: "Your booking information stays protected.",
                            },
                            {
                                icon: FaRegClock,
                                title: "Instant Access",
                                text: "Get your event details and booking confirmation quickly.",
                            },
                        ].map((feature) => {
                            const Icon = feature.icon;

                            return (
                                <div
                                    key={feature.title}
                                    className="group rounded-3xl border border-slate-200 bg-white p-7 shadow-sm transition duration-500 hover:-translate-y-2 hover:shadow-xl"
                                >

                                    <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-2xl text-violet-600 transition duration-500 group-hover:rotate-6 group-hover:scale-110">
                                        <Icon />
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900">
                                        {feature.title}
                                    </h3>

                                    <p className="mt-2 leading-6 text-slate-500">
                                        {feature.text}
                                    </p>

                                </div>
                            );
                        })}

                    </div>

                </div>

            </section>


            {/* ================= EVENTS ================= */}
  {/* ================= EVENTS ================= */}
<section id="events" className="bg-slate-50 pb-24 pt-8">

    <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Section heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-violet-600">
                    <FaBolt />
                    Explore
                </div>

                <h2 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                    Upcoming Events
                </h2>

                <p className="mt-2 text-slate-500">
                    Discover experiences you won't want to miss.
                </p>
            </div>

            <div className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-slate-600 shadow-sm">
                {events.length} events found
            </div>

        </div>

        {/* ================= LOADING ================= */}
        {loading && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {[1, 2, 3, 4, 5, 6].map((item) => (
                    <div
                        key={item}
                        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
                    >

                        {/* Image skeleton */}
                        <div className="h-60 animate-pulse bg-slate-200"></div>

                        {/* Content skeleton */}
                        <div className="space-y-4 p-6">

                            <div className="h-4 w-24 animate-pulse rounded bg-slate-200"></div>

                            <div className="h-6 w-3/4 animate-pulse rounded bg-slate-200"></div>

                            <div className="h-4 w-full animate-pulse rounded bg-slate-200"></div>

                            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200"></div>

                            <div className="h-10 w-1/2 animate-pulse rounded bg-slate-200"></div>

                            <div className="h-10 w-full animate-pulse rounded-xl bg-slate-200"></div>

                        </div>

                    </div>
                ))}

            </div>
        )}

        {/* ================= NO EVENTS ================= */}
        {!loading && events.length === 0 && (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-20 text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-400">
                    <FaSearch />
                </div>

                <h3 className="mt-6 text-2xl font-bold text-slate-800">
                    No events found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-slate-500">
                    We couldn't find anything matching your search.
                    Try another keyword or category.
                </p>

                <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="mt-6 rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white transition duration-300 hover:-translate-y-1 hover:bg-violet-600"
                >
                    View all events
                </button>

            </div>
        )}

        {/* ================= EVENT CARDS ================= */}
        {!loading && events.length > 0 && (
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">

                {events.map((event) => (
                    <EventCard
                        key={event._id}
                        event={event}
                    />
                ))}

            </div>
        )}

    </div>

</section>

                
            {/* ================= CTA ================= */}
            {/* ================= CTA SECTION ================= */}
            <section className="relative overflow-hidden bg-slate-950 py-20">

                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/20 via-transparent to-blue-600/20"></div>

                <div className="relative mx-auto max-w-4xl px-6 text-center">

                    {/* Icon */}
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl text-white backdrop-blur">
                        <FaTicketAlt />
                    </div>

                    {/* Heading */}
                    <h2 className="text-3xl font-black text-white sm:text-4xl">
                        Ready for your next experience?
                    </h2>

                    {/* Description */}
                    <p className="mx-auto mt-4 max-w-2xl text-slate-400">
                        Explore amazing events, book your tickets and create
                        memories that last.
                    </p>

                    {/* Button */}
                    <button
                        type="button"
                        onClick={() => {
                            document
                                .getElementById("events")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                });
                        }}
                        className="mt-8 rounded-xl bg-white px-7 py-3.5 font-bold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-violet-500 hover:text-white hover:shadow-lg hover:shadow-violet-500/20"
                    >
                        Explore Events
                    </button>

                </div>

            </section>

        </div>
    );
};

export default Home;

//import { useEffect, useState } from "react";
//import { Link } from "react-router-dom";
//import api from "../axios";
//import Navbar from "../components/Navbar";
//import Footer from "../components/Footer";
//import EventCard from "../components/EventCard";
//
//const Home = () => {
//    const [events, setEvents] = useState([]);
//    const [search, setSearch] = useState("");
//    const [category, setCategory] = useState("all");
//    const [loading, setLoading] = useState(true);
//
//    useEffect(() => {
//        fetchEvents();
//    }, []);
//
//    const fetchEvents = async () => {
//        try {
//            const response = await api.get("/events");
//            setEvents(response.data);
//        } catch (error) {
//            console.error("Error fetching events:", error);
//        } finally {
//            setLoading(false);
//        }
//    };
//
//    const filteredEvents = events.filter((event) => {
//        const matchesSearch =
//            event.title?.toLowerCase().includes(search.toLowerCase()) ||
//            event.description?.toLowerCase().includes(search.toLowerCase());
//
//        const matchesCategory =
//            category === "all" ||
//            event.category?.toLowerCase() === category.toLowerCase();
//
//        return matchesSearch && matchesCategory;
//    });
//
//    return (
//        <>
//            <Navbar />
//
//            <main className="home">
//
//                {/* HERO */}
//                <section className="hero">
//                    <div className="hero-content">
//                        <span className="hero-badge">
//                            ✨ Experience More With Eventora
//                        </span>
//
//                        <h1>
//                            Discover Events.
//                            <br />
//                            Create Memories.
//                        </h1>
//
//                        <p>
//                            Find exciting events, book your tickets,
//                            and enjoy unforgettable experiences.
//                        </p>
//
//                        <div className="search-box">
//                            <input
//                                type="text"
//                                placeholder="Search events..."
//                                value={search}
//                                onChange={(e) => setSearch(e.target.value)}
//                            />
//
//                            <button>Search</button>
//                        </div>
//                    </div>
//                </section>
//
//                {/* CATEGORIES */}
//                <section className="categories container">
//                    <div className="section-heading">
//                        <span>EXPLORE</span>
//                        <h2>Browse Categories</h2>
//                    </div>
//
//                    <div className="category-grid">
//
//                        <button
//                            className={category === "all" ? "active" : ""}
//                            onClick={() => setCategory("all")}
//                        >
//                            <span>🎟️</span>
//                            All Events
//                        </button>
//
//                        <button
//                            className={category === "tech" ? "active" : ""}
//                            onClick={() => setCategory("tech")}
//                        >
//                            <span>💻</span>
//                            Technology
//                        </button>
//
//                        <button
//                            className={category === "non-tech" ? "active" : ""}
//                            onClick={() => setCategory("non-tech")}
//                        >
//                            <span>🎤</span>
//                            Non-Tech
//                        </button>
//
//                        <button
//                            className={category === "movie" ? "active" : ""}
//                            onClick={() => setCategory("movie")}
//                        >
//                            <span>🎬</span>
//                            Movies
//                        </button>
//
//                    </div>
//                </section>
//
//                {/* EVENTS */}
//                <section className="events-section container">
//
//                    <div className="section-heading">
//                        <span>EVENTORA</span>
//                        <h2>Upcoming Events</h2>
//                        <p>
//                            Explore events and reserve your seat.
//                        </p>
//                    </div>
//
//                    {loading ? (
//                        <div className="loading">
//                            Loading events...
//                        </div>
//                    ) : filteredEvents.length === 0 ? (
//                        <div className="empty">
//                            No events found.
//                        </div>
//                    ) : (
//                        <div className="event-grid">
//                            {filteredEvents.map((event) => (
//                                <EventCard
//                                    key={event._id}
//                                    event={event}
//                                />
//                            ))}
//                        </div>
//                    )}
//
//                </section>
//
//                {/* CTA */}
//                <section className="cta">
//                    <div>
//                        <h2>Ready for your next experience?</h2>
//                        <p>
//                            Explore Eventora and find something you'll love.
//                        </p>
//                    </div>
//
//                    <Link to="/events">
//                        Explore Events
//                    </Link>
//                </section>
//
//            </main>
//
//            <Footer />
//        </>
//    );
//};
//
//export default Home;


//import React, { useState, useEffect } from 'react';
//import { Link } from 'react-router-dom';
//import api from '../utils/axios';
//import {
//    FaCalendarAlt,
//    FaMapMarkerAlt,
//    FaSearch,
//    FaRegClock,
//    FaTicketAlt,
//    FaShieldAlt
//} from 'react-icons/fa';
//
//const Home = () => {
//    const [events, setEvents] = useState([]);
//    const [search, setSearch] = useState('');
//    const [loading, setLoading] = useState(true);
//
//    useEffect(() => {
//        const timeoutId = setTimeout(() => {
//            fetchEvents();
//        }, 400);
//
//        return () => clearTimeout(timeoutId);
//    }, [search]);
//
//    const fetchEvents = async () => {
//        try {
//            console.log("Fetching events...");
//
//            const { data } = await api.get(`/events?search=${search}`);
//
//            console.log("Events received:", data);
//
//            setEvents(data);
//        } catch (error) {
//            console.error("Error fetching events:", error);
//            console.error("Backend response:", error.response?.data);
//        } finally {
//            setLoading(false);
//        }
//    };
//
//    return (
//        <div className="min-h-screen bg-gray-50">
//
//            {/* Hero Section */}
//            <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
//                <div className="max-w-7xl mx-auto px-6 text-center">
//
//                    <h1 className="text-5xl font-bold mb-6">
//                        Discover Amazing Events
//                    </h1>
//
//                    <p className="text-xl mb-8">
//                        Book tickets for the best events happening around you
//                    </p>
//
//                    {/* Search */}
//                    <div className="max-w-2xl mx-auto relative">
//                        <FaSearch className="absolute left-4 top-4 text-gray-400" />
//
//                        <input
//                            type="text"
//                            placeholder="Search events..."
//                            value={search}
//                            onChange={(e) => setSearch(e.target.value)}
//                            className="w-full pl-12 pr-4 py-4 rounded-lg text-gray-800 outline-none"
//                        />
//                    </div>
//
//                </div>
//            </section>
//
//            {/* Features */}
//            <section className="py-12 bg-white">
//                <div className="max-w-7xl mx-auto px-6">
//
//                    <div className="grid md:grid-cols-3 gap-8">
//
//                        <div className="text-center">
//                            <FaTicketAlt className="text-4xl text-blue-600 mx-auto mb-4" />
//                            <h3 className="text-xl font-semibold mb-2">
//                                Easy Booking
//                            </h3>
//                            <p className="text-gray-600">
//                                Book your event tickets quickly and easily.
//                            </p>
//                        </div>
//
//                        <div className="text-center">
//                            <FaShieldAlt className="text-4xl text-blue-600 mx-auto mb-4" />
//                            <h3 className="text-xl font-semibold mb-2">
//                                Secure Booking
//                            </h3>
//                            <p className="text-gray-600">
//                                Your booking information is safe and secure.
//                            </p>
//                        </div>
//
//                        <div className="text-center">
//                            <FaRegClock className="text-4xl text-blue-600 mx-auto mb-4" />
//                            <h3 className="text-xl font-semibold mb-2">
//                                Quick Access
//                            </h3>
//                            <p className="text-gray-600">
//                                Find and book events in just a few clicks.
//                            </p>
//                        </div>
//
//                    </div>
//                </div>
//            </section>
//
//            {/* Events Section */}
//            <section className="py-16">
//                <div className="max-w-7xl mx-auto px-6">
//
//                    <div className="flex justify-between items-center mb-8">
//
//                        <div>
//                            <h2 className="text-3xl font-bold text-gray-800">
//                                Upcoming Events
//                            </h2>
//
//                            <p className="text-gray-600 mt-2">
//                                {events.length} results found
//                            </p>
//                        </div>
//
//                    </div>
//
//                    {/* Loading */}
//                    {loading ? (
//
//                        <div className="text-center py-20">
//                            <p className="text-lg text-gray-600">
//                                Loading events...
//                            </p>
//                        </div>
//
//                    ) : events.length === 0 ? (
//
//                        <div className="text-center py-20">
//                            <h3 className="text-2xl font-semibold text-gray-700">
//                                No events found
//                            </h3>
//
//                            <p className="text-gray-500 mt-2">
//                                Try searching for another event.
//                            </p>
//                        </div>
//
//                    ) : (
//
//                        /* Event Cards */
//                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
//
//                            {events.map((event) => (
//
//                                <div
//                                    key={event._id}
//                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
//
//                                    {/* Event Image */}
//                                    <div className="h-52 w-full bg-gray-200">
//                                        <img
//                                            src={event.imageUrl}
//                                            alt="Event"
//                                            style={{
//                                                width: "100%",
//                                                height: "100%",
//                                                objectFit: "cover"
//                                            }}
//                                        />
//                                    </div>
//
//                                    {/* Event Information */}
//                                    <div className="p-6">
//
//                                        <div className="flex justify-between items-center mb-3">
//
//                                            <span className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
//                                                {event.category}
//                                            </span>
//
//                                            <span className="font-semibold text-green-600">
//                                                ₹{event.ticketPrice}
//                                            </span>
//
//                                        </div>
//
//                                        <h3 className="text-xl font-bold text-gray-800 mb-3">
//                                            {event.title}
//                                        </h3>
//
//                                        <p className="text-gray-600 text-sm mb-4">
//                                            {event.description}
//                                        </p>
//
//                                        {/* Date */}
//                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
//                                            <FaCalendarAlt />
//                                            <span>
//                                                {new Date(event.date).toLocaleDateString()}
//                                            </span>
//                                        </div>
//
//                                        {/* Location */}
//                                        <div className="flex items-center gap-2 text-gray-600 mb-4">
//                                            <FaMapMarkerAlt />
//                                            <span>
//                                                {event.location}
//                                            </span>
//                                        </div>
//
//                                        {/* Seats */}
//                                        <div className="mb-4">
//
//                                            <div className="flex justify-between text-sm mb-1">
//
//                                                <span className="text-gray-600">
//                                                    Available Seats
//                                                </span>
//
//                                                <span className="font-semibold">
//                                                    {event.availableSeat} / {event.totalSeat}
//                                                </span>
//
//                                            </div>
//
//                                            <div className="w-full bg-gray-200 rounded-full h-2">
//
//                                                <div
//                                                    className="bg-blue-600 h-2 rounded-full"
//                                                    style={{
//                                                        width: `${event.totalSeat > 0
//                                                            ? (event.availableSeat / event.totalSeat) * 100
//                                                            : 0
//                                                            }%`
//                                                    }}
//                                                ></div>
//
//                                            </div>
//
//                                        </div>
//
//                                        {/* View Details */}
//                                        <Link
//                                            to={`/events/${event._id}`}
//                                            className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
//                                        >
//                                            View Details
//                                        </Link>
//
//                                    </div>
//
//                                </div>
//
//                            ))}
//
//                        </div>
//
//                    )}
//
//                </div>
//            </section>
//
//        </div>
//    );
//};
//
//export default Home;