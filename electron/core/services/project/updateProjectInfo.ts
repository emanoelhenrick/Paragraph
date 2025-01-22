import { ProjectInfo } from "electron/core/models/ProjectInfo"
import { getProjectInfoPath } from "../../localPaths"
import { writeAsync } from "fs-jetpack"

export async function updateProjectInfo(data: ProjectInfo) {
  const projectInfoPath = getProjectInfoPath(data.id)
  await writeAsync(projectInfoPath, data)
}