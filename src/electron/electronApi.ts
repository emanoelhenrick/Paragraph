import { NewChapterProps } from "electron/core/services/chapter/createNewChapter"
import { NewProjectProps } from "electron/core/services/project/createNewProject"
import { UpdateChapterProps } from "electron/core/services/chapter/updateChapter"
import { ProjectMetaProps } from "electron/core/models/Meta"

export interface ElectronAPI {
  createNewProject: (data: NewProjectProps) => Promise<void>
  getAllProjects: () => Promise<ProjectMetaProps[]>

  createNewChapter: (data: NewChapterProps) => Promise<void>
  updateChapter: (data: UpdateChapterProps) => Promise<void>
}

const services = window.ipcRenderer as unknown as ElectronAPI
export default services