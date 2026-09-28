import React from "react";
import { Link } from "react-router-dom";
import {
    FaTicketAlt,
    FaInstagram,
    FaTwitter,
    FaFacebookF,
    FaLinkedinIn,
    FaArrowUp,
} from "react-icons/fa";

const Footer = () => {

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <footer
            id="about"
            className="relative overflow-hidden bg-slate-950 text-white"
        >

            {/* Background decoration */}
            <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl"></div>

            <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-blue-600/10 blur-3xl"></div>


            <div className="relative mx-auto max-w-7xl px-6 lg:px-8">

                {/* ================= MAIN FOOTER ================= */}
                <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-4">

                    {/* Brand */}
                    <div className="sm:col-span-2 lg:col-span-1">

                        <Link
                            to="/"
                            className="group inline-flex items-center gap-3"
                        >

                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-blue-600 shadow-lg shadow-violet-500/20 transition duration-300 group-hover:scale-105 group-hover:rotate-3">
                                <FaTicketAlt />
                            </div>

                            <div>
                                <h2 className="text-xl font-black">
                                    Event<span className="text-violet-400">ora</span>
                                </h2>

                                <p className="text-[9px] uppercase tracking-[0.2em] text-slate-500">
                                    Experience More
                                </p>
                            </div>

                        </Link>


                        <p className="mt-6 max-w-sm text-sm leading-7 text-slate-400">
                            Discover amazing events, connect with people and
                            create unforgettable experiences with Eventora.
                        </p>


                        {/* Social icons */}
                        <div className="mt-7 flex gap-3">

                            {[
                                {
                                    icon: FaInstagram,
                                    label: "Instagram",
                                },
                                {
                                    icon: FaTwitter,
                                    label: "Twitter",
                                },
                                {
                                    icon: FaFacebookF,
                                    label: "Facebook",
                                },
                                {
                                    icon: FaLinkedinIn,
                                    label: "LinkedIn",
                                },
                            ].map((social) => {
                                const Icon = social.icon;

                                return (
                                    <a
                                        key={social.label}
                                        href="#"
                                        aria-label={social.label}
                                        className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:bg-violet-600 hover:text-white"
                                    >
                                        <Icon />
                                    </a>
                                );
                            })}

                        </div>

                    </div>


                    {/* Explore */}
                    <div>

                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                            Explore
                        </h3>

                        <ul className="space-y-4 text-sm">

                            <li>
                                <Link
                                    to="/"
                                    className="text-slate-400 transition hover:text-violet-400"
                                >
                                    Home
                                </Link>
                            </li>

                            <li>
                                <a
                                    href="/#events"
                                    className="text-slate-400 transition hover:text-violet-400"
                                >
                                    Events
                                </a>
                            </li>

                            <li>
                                <a
                                    href="/#about"
                                    className="text-slate-400 transition hover:text-violet-400"
                                >
                                    About Eventora
                                </a>
                            </li>

                        </ul>

                    </div>


                    {/* Account */}
                    <div>

                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                            Account
                        </h3>

                        <ul className="space-y-4 text-sm">

                            <li>
                                <Link
                                    to="/login"
                                    className="text-slate-400 transition hover:text-violet-400"
                                >
                                    Login
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/register"
                                    className="text-slate-400 transition hover:text-violet-400"
                                >
                                    Create Account
                                </Link>
                            </li>

                            <li>
                                <Link
                                    to="/dashboard"
                                    className="text-slate-400 transition hover:text-violet-400"
                                >
                                    My Dashboard
                                </Link>
                            </li>

                        </ul>

                    </div>


                    {/* Contact */}
                    <div>

                        <h3 className="mb-5 text-sm font-bold uppercase tracking-wider text-white">
                            Eventora
                        </h3>

                        <p className="text-sm leading-7 text-slate-400">
                            Your destination for discovering and booking
                            unforgettable experiences.
                        </p>

                        <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">

                            <p className="text-xs uppercase tracking-wider text-slate-500">
                                Need help?
                            </p>

                            <p className="mt-1 text-sm font-semibold text-white">
                                We're here for you.
                            </p>

                        </div>

                    </div>

                </div>


                {/* ================= BOTTOM ================= */}
                <div className="flex flex-col gap-5 border-t border-white/10 py-7 sm:flex-row sm:items-center sm:justify-between">

                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} Eventora. All rights reserved.
                    </p>


                    <div className="flex items-center gap-5">

                        <span className="text-xs text-slate-500">
                            Built for memorable experiences
                        </span>

                        <button
                            onClick={scrollToTop}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition duration-300 hover:-translate-y-1 hover:bg-violet-600 hover:text-white"
                            aria-label="Back to top"
                        >
                            <FaArrowUp className="text-sm" />
                        </button>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;