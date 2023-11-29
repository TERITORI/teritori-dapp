window.addEventListener("DOMContentLoaded", () => {
  const { ipcRenderer } = require("electron");
  ipcRenderer.send("content-loaded", "");

  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const type of ["chrome", "node", "electron"]) {
    replaceText(`${type}-version`, process.versions[type]);
  }
});
