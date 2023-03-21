const { app, BrowserWindow, shell } = require("electron");
const serve = require("electron-serve");

app.setName("TERITORI");

app.dock.setIcon(`${__dirname}/logo.png`);

const mainWindow = () => {
  let browserWindow;

  const loadURL = serve({ directory: `${__dirname}/dist` });

  return app
    .whenReady()
    .then(() => {
      browserWindow = new BrowserWindow({
        backgroundColor: "#FAFAFA",
        width: 1200,
        height: 900,
        webPreferences: {
          contextIsolation: true,
          sandbox: false,
        },
      });

      browserWindow.setTitle("TERITORI");

      browserWindow.webContents.setWindowOpenHandler(({ url }) => {
        const denial = { action: "deny" };

        if (url.substr(0, "file://".length).toLowerCase() === "file://") {
          return denial;
        }

        shell.openExternal(url);
        return denial;
      });

      let quitting = false;

      browserWindow.on("close", (evt) => {
        if (quitting) {
          return;
        }

        evt.preventDefault();

        if (browserWindow.isFullScreen()) {
          browserWindow.once("leave-full-screen", () => browserWindow.hide());
          browserWindow.setFullScreen(false);
        } else {
          browserWindow.hide();
        }
      });

      browserWindow.on("app-command", (e, cmd) => {
        if (cmd === "browser-backward") {
          browserWindow.webContents.goBack();
        }
        if (cmd === "browser-forward") {
          browserWindow.webContents.goForward();
        }
      });

      app.on("before-quit", () => (quitting = true));
      app.on("activate", () => {
        browserWindow.show();
      });

      return browserWindow;
    })
    .then((browserWindowRef) => {
      loadURL(browserWindow).then(() => {
        browserWindow.show();
      });

      return browserWindowRef;
    });
};

mainWindow()
  .then((window) => window)
  .catch((err) => {
    console.log("err", err);
  });
