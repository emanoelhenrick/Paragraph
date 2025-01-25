import { randomUUID } from "crypto"
import { getChapterPath } from "../../localPaths"
import { writeAsync } from "fs-jetpack"
import { Chapter } from "../../models/Chapter"
import { getProjectInfo } from "../project/getProjectInfo"
import { updateProjectInfo } from "../project/updateProjectInfo"

export interface NewChapterProps {
  projectId: string
  chapterTitle: string
  position: number
}

export async function createNewChapter({ projectId, chapterTitle, position }: NewChapterProps) {
  const newChapterId = randomUUID()

  //CREATE THE CHAPTER JSON
  const chapterPath = getChapterPath(projectId, newChapterId)
  const chapter: Chapter = { id: newChapterId, title: chapterTitle, position, tags: [] }
  await writeAsync(chapterPath, chapter)

  //UPDATE PROJECT INFO
  const projectInfo = await getProjectInfo(projectId)
  projectInfo.chapters.push(chapter)
  await updateProjectInfo(projectInfo)
  
  return newChapterId
}