// tracker/activityTracker.js

const activeWin = require("active-win");

let mainWindow = null;
let intervalId = null;

const appUsage = {};
let currentApp = null;
let lastSwitchTime = Date.now();

async function startTracking(win) {
  if (intervalId) return;

  console.log("🚀 Real OS Tracking Started");
  mainWindow = win;

  intervalId = setInterval(async () => {
    const now = Date.now();

    let active;
    try {
      active = await activeWin();
    } catch (err) {
      console.error("Active window error:", err);
      return;
    }

    if (!active || !active.owner) return;

    // ✅ REAL app name (Notepad, Chrome, VS Code, etc.)
    const appName =
      active.owner.name ||
      active.owner.processName ||
      "Unknown";
    // ❌ IGNORE DIGITAL WELLBEING (Electron itself)
    if (
      appName.toLowerCase().includes("electron") ||
      active.title?.includes("Digital Wellbeing")
    ) {
      return; // <-- IMPORTANT
    }

    // FIRST TIME
    if (!currentApp) {
      currentApp = appName;
      lastSwitchTime = now;
      return;
    }

    // APP SWITCHED
    if (appName !== currentApp) {
      const timeSpent = Math.floor((now - lastSwitchTime) / 1000);

      appUsage[currentApp] =
        (appUsage[currentApp] || 0) + timeSpent;

      currentApp = appName;
      lastSwitchTime = now;
    }

    // LIVE UPDATE (running app included)
    const liveUsage = { ...appUsage };
    const runningTime = Math.floor((now - lastSwitchTime) / 1000);

    liveUsage[currentApp] =
      (liveUsage[currentApp] || 0) + runningTime;

    mainWindow.webContents.send("usage-update", {
      currentApp,
      appUsage: liveUsage
    });
  }, 1000);
}

module.exports = { startTracking };