import { app } from "electron"
import path from "path"

const SessionDataDir = app.getPath('sessionData')
const PROJECTS_DIR =  path.join(SessionDataDir, 'projects')
export const META_PATH =  path.join(PROJECTS_DIR, 'meta.json')

// projects/id-do-projeto/
//   - /chapters
//   - /notes/folders
//   - /scenes
//   - meta.json

export const getProjectInfoPath = (projectId: string) => path.join(PROJECTS_DIR, `${projectId}/info.json`)

export const getChaptersFolderPath = (projectId: string) => path.join(PROJECTS_DIR, `${projectId}/chapters`)
export const getChapterPath = (projectId: string, chapterId: string) => path.join(PROJECTS_DIR, `${projectId}/chapters/${chapterId}.json`)

export const getNotesFolderPath = (projectId: string) => path.join(PROJECTS_DIR, `${projectId}/notes`)
export const getNotePath = (projectId: string, folderId: string, noteId: string) => path.join(PROJECTS_DIR, `${projectId}/notes/${folderId}/${noteId}.json`)

export const getScenesFolderPath = (projectId: string) => path.join(PROJECTS_DIR, `${projectId}/scenes`)
export const getScenePath = (projectId: string, sceneId: string) => path.join(PROJECTS_DIR, `${projectId}/scenes/${sceneId}.json`)