const { spawn } = require("child_process");
const path = require("path");

const processes = [];

function startProcess(name, cwd, script, args) {
    const child = spawn(process.execPath, [script, ...args], {
        cwd,
        stdio: "inherit"
    });

    processes.push(child);

    child.on("error", (error) => {
        console.error(`[${name}] Error:`, error.message);
    });

    child.on("exit", (code) => {
        console.log(`[${name}] exited with code ${code}`);
    });
}

// Backend
startProcess(
    "SERVER",
    path.join(__dirname, "server"),
    path.join(__dirname, "server", "node_modules", "nodemon", "bin", "nodemon.js"),
    ["index.js"]
);

// Frontend
startProcess(
    "CLIENT",
    path.join(__dirname, "client"),
    path.join(__dirname, "client", "node_modules", "vite", "bin", "vite.js"),
    []
);

// Stop both when Ctrl+C is pressed
process.on("SIGINT", () => {
    console.log("\nStopping Eventora...");

    processes.forEach((child) => {
        child.kill();
    });

    process.exit(0);
});