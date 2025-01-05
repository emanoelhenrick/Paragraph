import { getChapterPath } from "../localPaths"
import { writeAsync } from "fs-jetpack"
import { Chapter } from "../models/Chapter"

interface UpdateProjectProps {
  projectId: string
  chapterData: Chapter
}

export async function updateChapter({ projectId, chapterData }: UpdateProjectProps) {
  //UPDATE THE CHAPTER JSON
  const chapterPath = getChapterPath(projectId, chapterData.id)
  return await writeAsync(chapterPath, chapterData)
}