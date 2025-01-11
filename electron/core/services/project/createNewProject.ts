import { randomUUID } from "crypto"
import { getProjectInfoPath, META_PATH } from "../../localPaths"
import { MetaProps } from "../../models/Meta"
import { readAsync, writeAsync } from "fs-jetpack"
import { ProjectInfo } from "../../models/ProjectInfo"

export interface NewProjectProps {
  name: string
}

export async function createNewProject({ name }: NewProjectProps) {
  const newProjectId = randomUUID()

  //ADD TO META
  const projectMeta = { name, id: newProjectId }
  let metadata: MetaProps = await readAsync(META_PATH, 'json')

  if (!metadata) metadata = { projects: [] }

  metadata.projects.push(projectMeta)
  await writeAsync(META_PATH, metadata)

  //CREATE THE PROJECT INFO
  const projectInfoPath = getProjectInfoPath(newProjectId)
  const projectInfo: ProjectInfo = { id: newProjectId, name }
  await writeAsync(projectInfoPath, projectInfo)

  return newProjectId
}