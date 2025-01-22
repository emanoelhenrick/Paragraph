import { ProjectInfo } from "electron/core/models/ProjectInfo"
import { getProjectInfoPath } from "../../localPaths"
import { readAsync } from "fs-jetpack"

export async function getProjectInfo(id: string) {
  const projectInfoPath = getProjectInfoPath(id)
  const projectInfo: ProjectInfo = await readAsync(projectInfoPath, 'json')
  return projectInfo
}