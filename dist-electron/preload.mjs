"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("ipcRenderer", {
  on(...args) {
    const [channel, listener] = args;
    return electron.ipcRenderer.on(channel, (event, ...args2) => listener(event, ...args2));
  },
  off(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.off(channel, ...omit);
  },
  send(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.send(channel, ...omit);
  },
  invoke(...args) {
    const [channel, ...omit] = args;
    return electron.ipcRenderer.invoke(channel, ...omit);
  },
  // You can expose other APTs you need here.
  // ...
  createNewProject: (args) => electron.ipcRenderer.invoke("create-new-project", args),
  getProjectInfo: (args) => electron.ipcRenderer.invoke("get-project-info", args),
  getAllProjects: () => electron.ipcRenderer.invoke("get-all-projects"),
  createNewChapter: (args) => electron.ipcRenderer.invoke("create-new-chapter", args),
  getChapter: (args) => electron.ipcRenderer.invoke("get-chapter", args),
  updateChapter: (args) => electron.ipcRenderer.invoke("update-chapter", args)
});
