import { NewChapterProps } from "electron/core/services/chapter/createNewChapter"
import { NewProjectProps } from "electron/core/services/project/createNewProject"
import { UpdateChapterProps } from "electron/core/services/chapter/updateChapter"
import { ProjectMetaProps } from "electron/core/models/Meta"
import { ProjectInfo } from "electron/core/models/ProjectInfo"
import { GetChapterProps } from "electron/core/services/chapter/getChapter"
import { Chapter } from "electron/core/models/Chapter"
import { UpdateTagsProps } from "electron/core/services/chapter/updateTags"

export interface ElectronAPI {
  createNewProject: (data: NewProjectProps) => Promise<string>
  getProjectInfo: (id: string) => Promise<ProjectInfo>
  getAllProjects: () => Promise<ProjectMetaProps[]>

  createNewChapter: (data: NewChapterProps) => Promise<string>
  getChapter: (data: GetChapterProps) => Promise<Chapter>
  updateChapter: (data: UpdateChapterProps) => Promise<void>
  updateTags: (data: UpdateTagsProps) => Promise<void>
}

const services = window.ipcRenderer as unknown as ElectronAPI
export default services