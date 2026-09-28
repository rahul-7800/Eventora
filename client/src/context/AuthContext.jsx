import React from "react";
import api from "../utils/axios";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);


    // ==========================================
    // RESTORE USER AFTER PAGE REFRESH
    // ==========================================

    React.useEffect(() => {

        const storedUser =
            localStorage.getItem("user");

        const token =
            localStorage.getItem("token");

        if (storedUser && token) {

            try {

                setUser(
                    JSON.parse(storedUser)
                );

            } catch (error) {

                console.error(
                    "Invalid stored user:",
                    error
                );

                localStorage.removeItem(
                    "user"
                );

                localStorage.removeItem(
                    "token"
                );
            }
        }

        setLoading(false);

    }, []);


    // ==========================================
    // LOGIN
    // ==========================================

    const login = async (
        email,
        password
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/login",
                    {
                        email:
                            email.trim(),
                        password
                    }
                );

            console.log(
                "Login successful:",
                data
            );

            setUser(data);

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            localStorage.setItem(
                "token",
                data.token
            );

            return data;

        } catch (error) {

            console.error(
                "Login failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // REGISTER
    // ==========================================

    const register = async (
        name,
        email,
        password
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/register",
                    {
                        name:
                            name.trim(),
                        email:
                            email.trim(),
                        password
                    }
                );

            console.log(
                "Registration response:",
                data
            );

            return data;

        } catch (error) {

            console.error(
                "Registration failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // VERIFY ACCOUNT OTP
    // ==========================================

    const verifyOTP = async (
        email,
        otp
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/verify-otp",
                    {
                        email:
                            email.trim(),
                        otp:
                            otp.trim(),
                        action:
                            "account_verification"
                    }
                );

            console.log(
                "OTP verification response:",
                data
            );

            setUser(data);

            localStorage.setItem(
                "user",
                JSON.stringify(data)
            );

            if (data.token) {

                localStorage.setItem(
                    "token",
                    data.token
                );
            }

            return data;

        } catch (error) {

            console.error(
                "OTP verification failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // RESEND OTP
    // ==========================================

    const resendOTP = async (
        email,
        action = "account_verification"
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/resend-otp",
                    {
                        email:
                            email.trim(),
                        action
                    }
                );

            console.log(
                "Resend OTP response:",
                data
            );

            return data;

        } catch (error) {

            console.error(
                "Resend OTP failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // FORGOT PASSWORD
    // SEND OTP
    // ==========================================

    const forgotPassword = async (
        email
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/forgot-password",
                    {
                        email:
                            email.trim()
                    }
                );

            console.log(
                "Forgot password response:",
                data
            );

            return data;

        } catch (error) {

            console.error(
                "Forgot password failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // VERIFY PASSWORD RESET OTP
    // ==========================================

    const verifyResetOTP = async (
        email,
        otp
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/verify-reset-otp",
                    {
                        email:
                            email.trim(),
                        otp:
                            otp.trim()
                    }
                );

            console.log(
                "Reset OTP verification:",
                data
            );

            return data;

        } catch (error) {

            console.error(
                "Reset OTP verification failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const resetPassword = async (
        email,
        otp,
        newPassword
    ) => {

        try {

            const { data } =
                await api.post(
                    "/auth/reset-password",
                    {
                        email:
                            email.trim(),
                        otp:
                            otp.trim(),
                        newPassword
                    }
                );

            console.log(
                "Password reset response:",
                data
            );

            return data;

        } catch (error) {

            console.error(
                "Password reset failed:",
                error.response?.data ||
                error.message
            );

            throw error;
        }
    };


    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        setUser(null);

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "token"
        );
    };


    // ==========================================
    // PROVIDER
    // ==========================================

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,

                login,
                register,

                verifyOTP,
                resendOTP,

                forgotPassword,
                verifyResetOTP,
                resetPassword,

                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

//import React from "react";
//import api from "../utils/axios";
//
//export const AuthContext = React.createContext();
//
//export const AuthProvider = ({ children }) => {
//    const [user, setUser] = React.useState(null);
//    const [loading, setLoading] = React.useState(true);
//
//    // Restore user after refresh
//    React.useEffect(() => {
//        const storedUser = localStorage.getItem("user");
//
//        if (storedUser) {
//            try {
//                setUser(JSON.parse(storedUser));
//            } catch (error) {
//                console.error("Invalid stored user:", error);
//                localStorage.removeItem("user");
//                localStorage.removeItem("token");
//            }
//        }
//
//        setLoading(false);
//    }, []);
//
//    // Login
//    const login = async (email, password) => {
//        try {
//            const { data } = await api.post("/auth/login", {
//                email,
//                password,
//            });
//
//            setUser(data);
//
//            localStorage.setItem("user", JSON.stringify(data));
//            localStorage.setItem("token", data.token);
//
//            return data;
//        } catch (error) {
//            console.error("Login failed:", error);
//            throw error;
//        }
//    };
//
//    // Register
//    const register = async (name, email, password) => {
//        try {
//            const { data } = await api.post("/auth/register", {
//                name,
//                email,
//                password,
//            });
//
//            return data;
//        } catch (error) {
//            console.error("Registration failed:", error);
//            throw error;
//        }
//    };
//
//    // Verify OTP
//    const verifyOTP = async (email, otp) => {
//        try {
//            const { data } = await api.post("/auth/verify-otp", {
//                email,
//                otp,
//                action: "account_verification",
//            });
//
//            setUser(data);
//
//            localStorage.setItem("user", JSON.stringify(data));
//            localStorage.setItem("token", data.token);
//
//            return data;
//        } catch (error) {
//            console.error("OTP verification failed:", error);
//            throw error;
//        }
//    };
//
//    // Resend OTP
//    const resendOTP = async (email) => {
//        try {
//            const { data } = await api.post("/auth/resend-otp", {
//                email,
//                action: "account_verification",
//            });
//
//            return data;
//        } catch (error) {
//            console.error("Resend OTP failed:", error);
//            throw error;
//        }
//    };
//
//    // Logout
//    const logout = () => {
//        setUser(null);
//
//        localStorage.removeItem("user");
//        localStorage.removeItem("token");
//    };
//
//    return (
//        <AuthContext.Provider
//            value={{
//                user,
//                loading,
//                login,
//                register,
//                verifyOTP,
//                resendOTP,
//                logout,
//            }}
//        >
//            {children}
//        </AuthContext.Provider>
//    );
//};