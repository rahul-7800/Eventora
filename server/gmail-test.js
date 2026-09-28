require("dotenv").config();
const nodemailer = require("nodemailer");

console.log("USER:", process.env.EMAIL_USER);
console.log("PASSWORD LENGTH:", process.env.EMAIL_PASS?.length);

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

transporter.verify()
    .then(() => {
        console.log("✅ GMAIL AUTHENTICATION SUCCESSFUL");
    })
    .catch((error) => {
        console.log("❌ GMAIL AUTHENTICATION FAILED");
        console.log(error.responseCode);
        console.log(error.response);
    });