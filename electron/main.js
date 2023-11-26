const { spawn } = require("child_process");
const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const portfinder = require("portfinder");
const url = require("url");
const os = require("os");

let mainWindow;
let splashWindow;
let forceQuit = false;
let port = 4242;
let weshSpawn;

function getWeshnetPlatformBin() {
  const platform = os.platform();

  switch (platform) {
    case "win32":
      return "app.asar.unpacked/build/win.exe";

    case "linux":
      return "app.asar.unpacked/build/linux";

    case "darwin":
      return "app.asar.unpacked/build/mac";

    default:
      return "";
  }
}

async function bootWeshnet() {
  try {
    port = await portfinder.getPortPromise();

    weshSpawn = spawn(
      path.join(process.resourcesPath, getWeshnetPlatformBin()),
      [port],
    );

    weshSpawn.stdout.on("data", (data) => {
      console.log(`Output: ${data}`);
    });

    weshSpawn.stderr.on("data", (data) => {
      console.error(`Error: ${data}`);
    });

    weshSpawn.on("close", (code) => {
      console.log(`Child process exited with code ${code}`);
    });
  } catch (err) {
    console.log("err", err);
  }
}

async function createWindow() {
  await bootWeshnet();

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "web-build/index.html"),
      protocol: "file:",
      slashes: true,
      query: {
        weshPort: port,
      },
    }),
  );

  splashWindow = new BrowserWindow({
    width: 500,
    height: 300,
    transparent: true,
    frame: false,
    alwaysOnTop: false,
  });

  splashWindow.loadFile("./splash.html");
  splashWindow.center();
  mainWindow.center();
  mainWindow.on("close", (event) => {
    if (!forceQuit) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

ipcMain.on("content-loaded", (event, data) => {
  mainWindow.maximize();
  splashWindow.close();
  mainWindow.show();
});

app.whenReady().then(() => {
  createWindow();
  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

if (process.platform === "darwin") {
  app.on("before-quit", function () {
    forceQuit = true;
  });

  app.on("window-all-closed", function () {
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("before-quit", () => {
    weshSpawn.kill("SIGKILL");
  });
}
