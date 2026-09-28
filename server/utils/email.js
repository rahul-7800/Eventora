const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,

    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Gmail SMTP failed:");
        console.error(error);
    } else {
        console.log("✅ Gmail SMTP connection successful");
    }
});

const sendOTPEmail = async (email, otp) => {
    try {
        await transporter.sendMail({
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Eventora - Email Verification OTP",
            html: `
                <h2>Eventora Email Verification</h2>
                <p>Your OTP is:</p>
                <h1>${otp}</h1>
                <p>This OTP expires in 5 minutes.</p>
            `,
        });

        console.log(`✅ OTP email sent to ${email}`);
    } catch (error) {
        console.error("❌ Failed to send OTP email:");
        console.error(error);
        throw error;
    }
};

//const nodemailer = require("nodemailer");
//
//// ==================================================
//// Gmail OAuth2 Transporter
//// ==================================================
//
//const transporter = nodemailer.createTransport({
//    service: "gmail",
//
//    auth: {
//        type: "OAuth2",
//        user: process.env.EMAIL_USER,
//        clientId: process.env.GOOGLE_CLIENT_ID,
//        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
//    },
//});
//
//// ==================================================
//// Send OTP Email
//// ==================================================
//
//const sendOTPEmail = async (userEmail, otp) => {
//    try {
//        const mailOptions = {
//            from: `"Eventora" <${process.env.EMAIL_USER}>`,
//            to: userEmail,
//            subject: "Eventora - Email Verification OTP",
//
//            html: `
//                <div style="
//                    font-family: Arial, sans-serif;
//                    max-width: 500px;
//                    margin: 40px auto;
//                    padding: 30px;
//                    border: 1px solid #ddd;
//                    border-radius: 10px;
//                    background-color: #ffffff;
//                ">
//
//                    <h2 style="text-align: center;">
//                        Eventora
//                    </h2>
//
//                    <h3>Email Verification</h3>
//
//                    <p>Hello,</p>
//
//                    <p>
//                        Your OTP for Eventora registration is:
//                    </p>
//
//                    <h1 style="
//                        text-align: center;
//                        letter-spacing: 8px;
//                        font-size: 32px;
//                    ">
//                        ${otp}
//                    </h1>
//
//                    <p>
//                        Enter this OTP to verify your email address.
//                    </p>
//
//                    <p>
//                        If you did not request this OTP, you can safely ignore this email.
//                    </p>
//
//                    <hr>
//
//                    <p style="
//                        text-align: center;
//                        color: #777;
//                        font-size: 12px;
//                    ">
//                        © Eventora
//                    </p>
//
//                </div>
//            `,
//        };
//
//        const info = await transporter.sendMail(mailOptions);
//
//        console.log(`✅ OTP email sent successfully to ${userEmail}`);
//        console.log(`Message ID: ${info.messageId}`);
//
//        return true;
//
//    } catch (error) {
//        console.error("❌ Failed to send OTP email:");
//        console.error(error.message);
//
//        return false;
//    }
//};

// ==================================================
// Send Booking Confirmation Email
// ==================================================

const sendBookingEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Confirmed: ${eventTitle}`,

            html: `
                <div style="
                    font-family: Arial, sans-serif;
                    max-width: 500px;
                    margin: 40px auto;
                    padding: 30px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #ffffff;
                ">

                    <h2 style="text-align: center;">
                        Eventora
                    </h2>

                    <h3>🎉 Booking Confirmed!</h3>

                    <p>
                        Hi <strong>${userName}</strong>,
                    </p>

                    <p>
                        Your booking for
                        <strong>${eventTitle}</strong>
                        has been successfully confirmed.
                    </p>

                    <div style="
                        margin: 20px 0;
                        padding: 15px;
                        background-color: #f5f5f5;
                        border-radius: 8px;
                    ">
                        <strong>Event:</strong>
                        ${eventTitle}
                    </div>

                    <p>
                        Thank you for choosing Eventora.
                    </p>

                    <p>
                        We hope you have a great experience!
                    </p>

                    <hr>

                    <p style="
                        text-align: center;
                        color: #777;
                        font-size: 12px;
                    ">
                        © Eventora
                    </p>

                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`✅ Booking email sent successfully to ${userEmail}`);
        console.log(`Message ID: ${info.messageId}`);

        return true;

    } catch (error) {
        console.error("❌ Failed to send booking email:");
        console.error(error.message);

        return false;
    }
};

const sendBookingRejectedEmail = async (userEmail, userName, eventTitle) => {
    try {
        const mailOptions = {
            from: `"Eventora" <${process.env.EMAIL_USER}>`,
            to: userEmail,
            subject: `Booking Rejected: ${eventTitle}`,
            html: `
                <h2>Eventora - Booking Rejected</h2>

                <p>Hi ${userName},</p>

                <p>
                    Your booking request for
                    <strong>${eventTitle}</strong>
                    has been rejected by the admin.
                </p>

                <p>Thank you,<br>Eventora Team</p>
            `
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("✅ Rejection email sent!");
        console.log("To:", userEmail);
        console.log("Message ID:", info.messageId);

        return true;

    } catch (error) {
        console.error("❌ Rejection email failed:");
        console.error(error);

        return false;
    }
};

module.exports = {
    sendOTPEmail,
    sendBookingEmail,
    sendBookingRejectedEmail
};