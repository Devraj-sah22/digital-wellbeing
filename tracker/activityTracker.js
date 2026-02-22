let activeWinFn = null;

let currentApp = null;
let startTime = Date.now();
const appUsage = {};

let mainWindow = null;
let trackingStarted = false;
let intervalId = null;

async function loadActiveWin() {
  if (!activeWinFn) {
    const activeWin = await import("active-win");
    activeWinFn = activeWin.default;
  }
}

async function track() {
  await loadActiveWin();

  const result = await activeWinFn();
  if (!result) return;

  const appName = result.owner.name;
  const now = Date.now();

  if (currentApp !== appName) {
    if (currentApp) {
      const duration = (now - startTime) / 1000;
      appUsage[currentApp] = (appUsage[currentApp] || 0) + duration;
    }
    currentApp = appName;
    startTime = now;
  }

  if (mainWindow) {
    mainWindow.webContents.send("usage-update", {
      currentApp,
      appUsage
    });
  }
}

function startTracking(win) {
  if (trackingStarted) {
    console.log("⚠ Tracking already running");
    return;
  }

  trackingStarted = true;
  mainWindow = win;

  console.log("🚀 Tracking STARTED");

  intervalId = setInterval(track, 1000);
}

module.exports = { startTracking };