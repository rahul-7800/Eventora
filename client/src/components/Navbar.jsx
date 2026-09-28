import React, { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
    FaTicketAlt,
    FaBars,
    FaTimes,
    FaUserCircle,
    FaChevronDown,
    FaSignOutAlt,
    FaTachometerAlt,
    FaCalendarAlt,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);

    const navigate = useNavigate();
    const location = useLocation();

    const [mobileMenu, setMobileMenu] = useState(false);
    const [profileMenu, setProfileMenu] = useState(false);

    const handleLogout = () => {
        logout();
        setProfileMenu(false);
        setMobileMenu(false);
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const closeMobileMenu = () => {
        setMobileMenu(false);
    };

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 shadow-sm backdrop-blur-xl">

            <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">

                <div className="flex h-20 items-center justify-between">

                    {/* ================= LOGO ================= */}
                    <Link
                        to="/"
                        onClick={closeMobileMenu}
                        className="group flex items-center gap-3"
                    >
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                            <FaTicketAlt className="text-lg" />
                        </div>

                        <div>
                            <h1 className="text-xl font-black tracking-tight text-slate-900">
                                Event<span className="text-violet-600">ora</span>
                            </h1>

                            <p className="hidden text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 sm:block">
                                Experience More
                            </p>
                        </div>
                    </Link>


                    {/* ================= DESKTOP NAV ================= */}
                    <div className="hidden items-center gap-2 md:flex">

                        <Link
                            to="/"
                            className={`rounded-xl px-4 py-2.5 text-sm font-semibold transition duration-300 ${
                                isActive("/")
                                    ? "bg-violet-50 text-violet-600"
                                    : "text-slate-600 hover:bg-slate-50 hover:text-violet-600"
                            }`}
                        >
                            Home
                        </Link>

                        <a
                            href="/#events"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-300 hover:bg-slate-50 hover:text-violet-600"
                        >
                            Events
                        </a>

                        <a
                            href="/#about"
                            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition duration-300 hover:bg-slate-50 hover:text-violet-600"
                        >
                            About
                        </a>

                    </div>


                    {/* ================= RIGHT SIDE ================= */}
                    <div className="hidden items-center gap-3 md:flex">

                        {!user ? (
                            <>
                                <Link
                                    to="/login"
                                    className="rounded-xl px-5 py-2.5 text-sm font-bold text-slate-700 transition duration-300 hover:bg-slate-100"
                                >
                                    Login
                                </Link>

                                <Link
                                    to="/register"
                                    className="rounded-xl bg-slate-950 px-5 py-2.5 text-sm font-bold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:bg-violet-600 hover:shadow-violet-500/20"
                                >
                                    Get Started
                                </Link>
                            </>
                        ) : (

                            <div className="relative">

                                {/* Profile Button */}
                                <button
                                    onClick={() =>
                                        setProfileMenu(!profileMenu)
                                    }
                                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 transition duration-300 hover:border-violet-200 hover:bg-violet-50"
                                >

                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-blue-500 text-white">
                                        <FaUserCircle />
                                    </div>

                                    <div className="hidden text-left lg:block">
                                        <p className="max-w-28 truncate text-sm font-bold text-slate-800">
                                            {user.name || "User"}
                                        </p>

                                        <p className="text-[10px] uppercase tracking-wider text-slate-400">
                                            {user.role || "Member"}
                                        </p>
                                    </div>

                                    <FaChevronDown
                                        className={`text-xs text-slate-400 transition duration-300 ${
                                            profileMenu
                                                ? "rotate-180"
                                                : ""
                                        }`}
                                    />

                                </button>


                                {/* Dropdown */}
                                {profileMenu && (
                                    <>

                                        {/* Invisible overlay */}
                                        <div
                                            className="fixed inset-0 z-[-1]"
                                            onClick={() =>
                                                setProfileMenu(false)
                                            }
                                        ></div>

                                        <div className="absolute right-0 mt-3 w-64 origin-top-right overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">

                                            {/* User info */}
                                            <div className="mb-2 rounded-xl bg-slate-50 p-4">

                                                <p className="truncate font-bold text-slate-900">
                                                    {user.name || "User"}
                                                </p>

                                                <p className="mt-1 truncate text-xs text-slate-500">
                                                    {user.email}
                                                </p>

                                            </div>


                                            {/* Dashboard */}
                                            <Link
                                                to={
                                                    user.role === "admin"
                                                        ? "/admin"
                                                        : "/dashboard"
                                                }
                                                onClick={() =>
                                                    setProfileMenu(false)
                                                }
                                                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
                                            >
                                                <FaTachometerAlt />
                                                Dashboard
                                            </Link>


                                            {/* User bookings */}
                                            {user.role !== "admin" && (
                                                <Link
                                                    to="/dashboard"
                                                    onClick={() =>
                                                        setProfileMenu(false)
                                                    }
                                                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-violet-50 hover:text-violet-600"
                                                >
                                                    <FaCalendarAlt />
                                                    My Bookings
                                                </Link>
                                            )}


                                            <div className="my-2 border-t border-slate-100"></div>


                                            {/* Logout */}
                                            <button
                                                onClick={handleLogout}
                                                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                                            >
                                                <FaSignOutAlt />
                                                Logout
                                            </button>

                                        </div>

                                    </>
                                )}

                            </div>
                        )}

                    </div>


                    {/* ================= MOBILE BUTTON ================= */}
                    <button
                        onClick={() => setMobileMenu(!mobileMenu)}
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-100 md:hidden"
                        aria-label="Toggle menu"
                    >
                        {mobileMenu ? (
                            <FaTimes className="text-lg" />
                        ) : (
                            <FaBars className="text-lg" />
                        )}
                    </button>

                </div>


                {/* ================= MOBILE MENU ================= */}
                {mobileMenu && (
                    <div className="border-t border-slate-100 pb-5 pt-4 md:hidden">

                        <div className="space-y-1">

                            <Link
                                to="/"
                                onClick={closeMobileMenu}
                                className={`block rounded-xl px-4 py-3 font-semibold ${
                                    isActive("/")
                                        ? "bg-violet-50 text-violet-600"
                                        : "text-slate-600 hover:bg-slate-50"
                                }`}
                            >
                                Home
                            </Link>

                            <a
                                href="/#events"
                                onClick={closeMobileMenu}
                                className="block rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Events
                            </a>

                            <a
                                href="/#about"
                                onClick={closeMobileMenu}
                                className="block rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                About
                            </a>

                        </div>


                        {/* Mobile auth */}
                        <div className="mt-4 border-t border-slate-100 pt-4">

                            {!user ? (
                                <div className="grid grid-cols-2 gap-3">

                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="rounded-xl border border-slate-200 py-3 text-center text-sm font-bold text-slate-700"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className="rounded-xl bg-slate-950 py-3 text-center text-sm font-bold text-white"
                                    >
                                        Get Started
                                    </Link>

                                </div>
                            ) : (
                                <div className="space-y-2">

                                    <Link
                                        to={
                                            user.role === "admin"
                                                ? "/admin"
                                                : "/dashboard"
                                        }
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 rounded-xl bg-violet-50 px-4 py-3 font-semibold text-violet-600"
                                    >
                                        <FaTachometerAlt />
                                        Dashboard
                                    </Link>

                                    {user.role !== "admin" && (
                                        <Link
                                            to="/dashboard"
                                            onClick={closeMobileMenu}
                                            className="flex items-center gap-3 rounded-xl px-4 py-3 font-semibold text-slate-600 hover:bg-slate-50"
                                        >
                                            <FaCalendarAlt />
                                            My Bookings
                                        </Link>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-semibold text-red-500 hover:bg-red-50"
                                    >
                                        <FaSignOutAlt />
                                        Logout
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>
                )}

            </div>

        </nav>
    );
};

export default Navbar;

//import React, { useContext } from 'react';
//import { Link, useNavigate } from 'react-router-dom';
//import { AuthContext } from '../context/AuthContext';
//import { FaTicketAlt } from 'react-icons/fa';
//
//const Navbar = () => {
//    const { user, logout } = useContext(AuthContext);
//    const navigate = useNavigate();
//
//    const handleLogout = () => {
//        logout();
//        navigate('/login');
//    };
//
//    return (
//        <nav className="bg-gray-900 shadow-lg">
//            <div className="container mx-auto px-4">
//                <div className="flex flex-col md:flex-row justify-between items-center py-4 gap-4">
//                    <Link to="/" className="text-white text-2xl font-bold flex items-center gap-2">
//                        <FaTicketAlt /> Eventora
//                    </Link>
//                    <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
//                        <Link to="/" className="text-gray-200 hover:text-white transition cursor-pointer">Events</Link>
//                        {user ? (
//                            <>
//                                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="text-gray-200 hover:text-white transition">Dashboard</Link>
//                                <button onClick={handleLogout} className="bg-gray-700 hover:bg-black text-white px-4 py-2 rounded-md transition">Logout</button>
//                            </>
//                        ) : (
//                            <>
//                                <Link to="/login" className="text-gray-200 hover:text-white transition">Login</Link>
//                                <Link to="/register" className="bg-white text-gray-900 hover:bg-gray-100 px-4 py-2 rounded-md font-semibold transition">Sign Up</Link>
//                            </>
//                        )}
//                    </div>
//                </div>
//            </div>
//        </nav>
//    );
//};
//
//export default Navbar;