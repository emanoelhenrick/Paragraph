import { randomUUID } from "crypto"
import { getProjectInfoPath, META_PATH } from "../localPaths"
import { MetaProps } from "../models/Meta"
import { readAsync, writeAsync } from "fs-jetpack"
import { ProjectInfo } from "../models/ProjectInfo"

interface NewProjectProps {
  name: string
  deadline: Date
  wordsPerChapterLimit: number
}

export async function createNewProject({ name, deadline, wordsPerChapterLimit }: NewProjectProps) {
  const newProjectId = randomUUID()

  //ADD TO META
  const projectMeta = { name, id: newProjectId }
  const metadata: MetaProps = await readAsync(META_PATH, 'json')
  metadata.projects.push(projectMeta)
  await writeAsync(META_PATH, metadata)

  //CREATE THE PROJECT INFO
  const projectInfoPath = getProjectInfoPath(newProjectId)
  const projectInfo: ProjectInfo = {
    id: newProjectId, name,
    stats: { deadline, wordsPerChapterLimit, days: [] }
  }
  return await writeAsync(projectInfoPath, projectInfo)
}