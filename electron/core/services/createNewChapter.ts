import { randomUUID } from "crypto"
import { getChapterPath, getProjectInfoPath, META_PATH } from "../localPaths"
import { MetaProps } from "../models/Meta"
import { readAsync, writeAsync } from "fs-jetpack"
import { ProjectInfo } from "../models/ProjectInfo"
import { Chapter } from "../models/Chapter"

interface NewChapterProps {
  projectId: string
  chapterTitle: string
  position: number
}

export async function createNewProject({ projectId, chapterTitle, position }: NewChapterProps) {
  const newChapterId = randomUUID()

  //CREATE THE CHAPTER JSON
  const chapterPath = getChapterPath(projectId, newChapterId)
  const chapter: Chapter = { id: newChapterId, title: chapterTitle, position }
  return await writeAsync(chapterPath, chapter)
}