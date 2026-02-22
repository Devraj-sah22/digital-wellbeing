// tracker/activityTracker.js
let mainWindow = null;
let intervalId = null;

const appUsage = {};
let currentApp = "Chrome";
let seconds = 0;

/**
 * Simulation-based tracking
 * (Used due to OS-level restrictions on Windows)
 */
function startTracking(win) {
  if (intervalId) return;

  console.log("🚀 Tracking started (SIMULATION MODE)");
  mainWindow = win;

  intervalId = setInterval(() => {
    seconds++;

    // Simulate app switch every 10 seconds
    if (seconds % 10 === 0) {
      currentApp = currentApp === "Chrome" ? "VSCode" : "Chrome";
    }

    appUsage[currentApp] = (appUsage[currentApp] || 0) + 1;

    mainWindow.webContents.send("usage-update", {
      currentApp,
      appUsage
    });
  }, 1000);
}

module.exports = { startTracking };