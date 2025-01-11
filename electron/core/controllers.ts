import { ipcMain } from "electron";
import { createNewChapter } from "./services/chapter/createNewChapter";
import { createNewProject } from "./services/project/createNewProject";
import { updateChapter } from "./services/chapter/updateChapter";
import { getAllProjects } from "./services/project/getAllProjects";
export default function CoreControllers() {
  //PROJECT
  ipcMain.handle('create-new-project', async (_event, args) => await createNewProject(args))
  ipcMain.handle('get-all-projects', async (_event) => await getAllProjects())

  //CHAPTER
  ipcMain.handle('create-new-chapter', async (_event, args) => await createNewChapter(args))
  ipcMain.handle('update-chapter', async (_event, args) => await updateChapter(args))
}