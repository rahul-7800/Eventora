const { google } = require("googleapis");

// ==================================================
// Gmail API OAuth2
// ==================================================

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

const gmail = google.gmail({
    version: "v1",
    auth: oauth2Client,
});

// ==================================================
// Create Gmail RAW message
// ==================================================

const createRawMessage = ({ to, subject, html }) => {
    const message = [
        `From: "Eventora" <${process.env.EMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        "MIME-Version: 1.0",
        'Content-Type: text/html; charset="UTF-8"',
        "",
        html,
    ].join("\r\n");

    return Buffer.from(message)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
};

// ==================================================
// Send Gmail
// ==================================================

const sendEmail = async ({ to, subject, html }) => {
    const raw = createRawMessage({
        to,
        subject,
        html,
    });

    const response = await gmail.users.messages.send({
        userId: "me",
        requestBody: {
            raw,
        },
    });

    return response.data;
};

// ==================================================
// Send OTP Email
// ==================================================

const sendOTPEmail = async (email, otp) => {
    try {
        await sendEmail({
            to: email,
            subject: "Eventora - Email Verification OTP",

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

                    <h3>Email Verification</h3>

                    <p>Hello,</p>

                    <p>
                        Your OTP for Eventora registration is:
                    </p>

                    <h1 style="
                        text-align: center;
                        letter-spacing: 8px;
                        font-size: 32px;
                    ">
                        ${otp}
                    </h1>

                    <p>
                        This OTP expires in 5 minutes.
                    </p>

                    <p>
                        If you did not request this OTP,
                        you can safely ignore this email.
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
        });

        console.log(`✅ OTP email sent successfully to ${email}`);

        return true;

    } catch (error) {
        console.error("❌ Failed to send OTP email:");
        console.error(error.response?.data || error.message);

        throw error;
    }
};

// ==================================================
// Send Booking Confirmation Email
// ==================================================

const sendBookingEmail = async (
    userEmail,
    userName,
    eventTitle
) => {
    try {
        await sendEmail({
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
        });

        console.log(
            `✅ Booking email sent successfully to ${userEmail}`
        );

        return true;

    } catch (error) {
        console.error("❌ Failed to send booking email:");
        console.error(error.response?.data || error.message);

        return false;
    }
};

// ==================================================
// Send Booking Rejected Email
// ==================================================

const sendBookingRejectedEmail = async (
    userEmail,
    userName,
    eventTitle
) => {
    try {
        await sendEmail({
            to: userEmail,
            subject: `Booking Rejected: ${eventTitle}`,

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

                    <h2>Eventora - Booking Rejected</h2>

                    <p>
                        Hi <strong>${userName}</strong>,
                    </p>

                    <p>
                        Your booking request for
                        <strong>${eventTitle}</strong>
                        has been rejected by the admin.
                    </p>

                    <p>
                        Thank you,<br>
                        Eventora Team
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
        });

        console.log(
            `✅ Rejection email sent successfully to ${userEmail}`
        );

        return true;

    } catch (error) {
        console.error("❌ Rejection email failed:");
        console.error(error.response?.data || error.message);

        return false;
    }
};

// ==================================================
// Export
// ==================================================

module.exports = {
    sendOTPEmail,
    sendBookingEmail,
    sendBookingRejectedEmail,
};