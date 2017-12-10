const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
const clientPath = "./client";

require("electron-reload")(path.join(__dirname, clientPath));

let win;

function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600, frame: false });
    win.setMenu(null);

    win.setResizable(false);

    win.loadURL(url.format({
        pathname: path.join(__dirname, clientPath, "index.html"),
        protocol: "file:",
        slashes: true
    }));

    win.webContents.openDevTools()
    
    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow)

app.on("window-all-closed", () => {
    app.quit();
});

app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});