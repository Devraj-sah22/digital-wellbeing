const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { startTracking } = require("./tracker/activityTracker");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true
        }
    });

    mainWindow.loadFile("renderer/index.html");
}

ipcMain.on("start-tracking", () => {
    console.log("📩 IPC received: start-tracking");
    startTracking(mainWindow);
});

app.whenReady().then(createWindow);