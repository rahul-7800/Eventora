const { google } = require("googleapis");
const http = require("http");
const url = require("url");

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const REDIRECT_URI = "http://localhost:3000";

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://mail.google.com/"],
    prompt: "consent"
});

const server = http.createServer(async (req, res) => {
    const query = url.parse(req.url, true).query;

    if (!query.code) {
        res.end("Waiting for Google authorization...");
        return;
    }

    try {
        const { tokens } = await oauth2Client.getToken(query.code);

        console.log("\n================================");
        console.log("✅ OAuth successful!");
        console.log("================================");
        console.log("\nRefresh Token:");
        console.log(tokens.refresh_token);
        console.log("\nSave this token securely.");

        res.end("OAuth successful! You can close this tab.");
        server.close();
    } catch (error) {
        console.error("❌ Token error:", error.message);
        res.end("OAuth failed. Check your terminal.");
    }
});

server.listen(3000, () => {
    console.log("\n================================");
    console.log("OAuth server running");
    console.log("http://localhost:3000");
    console.log("================================");

    console.log("\nOpen this URL:");
    console.log(authUrl);
});