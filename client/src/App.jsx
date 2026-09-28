import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import EventDetail from './pages/EventDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';

function App() {
    return (
        <Router>

            <div className="min-h-screen bg-slate-50 flex flex-col">

                {/* Navbar */}
                <Navbar />

                {/* Main Content */}
                <main className="flex-grow">

                    <Routes>

                        {/* Public Routes */}
                        <Route
                            path="/"
                            element={<Home />}
                        />

                        <Route
                            path="/events/:id"
                            element={<EventDetail />}
                        />

                        <Route
                            path="/login"
                            element={<Login />}
                        />

                        <Route
                            path="/register"
                            element={<Register />}
                        />

                        {/* User */}
                        <Route
                            path="/dashboard"
                            element={<UserDashboard />}
                        />

                        {/* Admin */}
                        <Route
                            path="/admin"
                            element={<AdminDashboard />}
                        />

                        {/* Payment */}
                        <Route
                            path="/payment-success"
                            element={<PaymentSuccess />}
                        />

                        <Route
                            path="/payment-failed"
                            element={<PaymentFailed />}
                        />

                        {/* 404 */}
                        <Route
                            path="*"
                            element={
                                <div className="flex min-h-[60vh] items-center justify-center px-6">
                                    <div className="text-center">

                                        <p className="text-sm font-bold uppercase tracking-widest text-violet-600">
                                            Eventora
                                        </p>

                                        <h1 className="mt-3 text-6xl font-black text-slate-900">
                                            404
                                        </h1>

                                        <p className="mt-3 text-lg text-slate-500">
                                            The page you're looking for doesn't exist.
                                        </p>

                                        <a
                                            href="/"
                                            className="mt-7 inline-flex rounded-xl bg-slate-950 px-6 py-3 font-bold text-white transition duration-300 hover:-translate-y-1 hover:bg-violet-600"
                                        >
                                            Back to Home
                                        </a>

                                    </div>
                                </div>
                            }
                        />

                    </Routes>

                </main>

                {/* Footer */}
                <Footer />

            </div>

        </Router>
    );
}

export default App;

//import React from 'react';
//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
//import Navbar from './components/Navbar';
//import Home from './pages/Home';
//import EventDetail from './pages/EventDetail';
//import Login from './pages/Login';
//import Register from './pages/Register';
//import UserDashboard from './pages/UserDashboard';
//import AdminDashboard from './pages/AdminDashboard';
//import PaymentSuccess from './pages/PaymentSuccess';
//import PaymentFailed from './pages/PaymentFailed';
//
//function App() {
//    return (
//        <Router>
//            <div className="min-h-screen bg-gray-50 flex flex-col">
//                <Navbar />
//                <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8">
//                    <Routes>
//                        <Route path="/" element={<Home />} />
//                        <Route path="/events/:id" element={<EventDetail />} />
//                        <Route path="/login" element={<Login />} />
//                        <Route path="/register" element={<Register />} />
//                        <Route path="/dashboard" element={<UserDashboard />} />
//                        <Route path="/admin" element={<AdminDashboard />} />
//                        <Route path="/payment-success" element={<PaymentSuccess />} />
//                        <Route path="/payment-failed" element={<PaymentFailed />} />
//                        <Route path="*" element={<h1 className="text-3xl font-bold text-center mt-20">404 - Page Not Found</h1>} />
//                    </Routes>
//                </main>
//            </div>
//        </Router>
//    );
//}
//
//export default App;