const { spawn } = require("child_process");
const path = require("path");

console.log("Starting Task Manager Development Servers...\n");

// Start backend server
const backend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "server"),
  stdio: "inherit",
  shell: true,
});

// Start frontend server
const frontend = spawn("npm", ["run", "dev"], {
  cwd: path.join(__dirname, "client"),
  stdio: "inherit",
  shell: true,
});

// Handle process termination
process.on("SIGINT", () => {
  console.log("\nShutting down servers...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log("\nShutting down servers...");
  backend.kill();
  frontend.kill();
  process.exit(0);
});
