const { app, BrowserWindow, ipcMain, Tray, Menu } = require("electron");
const path = require("path");
const { startTracking } = require("./tracker/activityTracker");

let mainWindow;
let tray;
let isQuitting = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // show after ready
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true
    }
  });

  mainWindow.loadFile("renderer/index.html");

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // 🔹 Run in background (do not quit on close)
  mainWindow.on("close", (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(path.join(__dirname, "icon.png")); // add any icon.png
  tray.setToolTip("Digital Wellbeing");

  const trayMenu = Menu.buildFromTemplate([
    {
      label: "Open App",
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: "Start Tracking",
      click: () => {
        console.log("🟢 Start Tracking from Tray");
        startTracking(mainWindow);
      }
    },
    {
      label: "Exit",
      click: () => {
        isQuitting = true;
        app.quit();
      }
    }
  ]);

  tray.setContextMenu(trayMenu);

  // Double-click tray to open app
  tray.on("double-click", () => {
    mainWindow.show();
  });
}

// IPC from renderer button
ipcMain.on("start-tracking", () => {
  console.log("📩 IPC received: start-tracking");
  startTracking(mainWindow);
});

app.whenReady().then(() => {
  createWindow();
  //createTray();
});