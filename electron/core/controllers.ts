import { ipcMain } from "electron";
import { createNewChapter } from "./services/chapter/createNewChapter";
import { createNewProject } from "./services/project/createNewProject";
import { updateChapter } from "./services/chapter/updateChapter";
import { getAllProjects } from "./services/project/getAllProjects";
import { getProjectInfo } from "./services/project/getProjectInfo";
import { getChapter } from "./services/chapter/getChapter";
import { updateTags } from "./services/chapter/updateTags";
export default function CoreControllers() {
  //PROJECT
  ipcMain.handle('create-new-project', async (_event, args) => await createNewProject(args))
  ipcMain.handle('get-project-info', async (_event, args) => await getProjectInfo(args))
  ipcMain.handle('get-all-projects', async (_event) => await getAllProjects())

  //CHAPTER
  ipcMain.handle('create-new-chapter', async (_event, args) => await createNewChapter(args))
  ipcMain.handle('get-chapter', async (_event, args) => await getChapter(args))
  ipcMain.handle('update-chapter', async (_event, args) => await updateChapter(args))
  ipcMain.handle('update-tags', async (_event, args) => await updateTags(args))
}