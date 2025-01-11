import { getChapterPath } from "../../localPaths"
import { writeAsync } from "fs-jetpack"
import { Chapter } from "../../models/Chapter"

export interface UpdateChapterProps {
  projectId: string
  chapterData: Chapter
}

export async function updateChapter({ projectId, chapterData }: UpdateChapterProps) {
  //UPDATE THE CHAPTER JSON
  const chapterPath = getChapterPath(projectId, chapterData.id)
  return await writeAsync(chapterPath, chapterData)
}