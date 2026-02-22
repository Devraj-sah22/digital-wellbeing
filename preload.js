const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
  startTracking: () => {
    console.log("🖱 Start button clicked");
    ipcRenderer.send("start-tracking");
  },
  onUsageUpdate: (callback) =>
    ipcRenderer.on("usage-update", (_, data) => callback(data))
});