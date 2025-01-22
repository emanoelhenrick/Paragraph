import { getChapterPath } from "../../localPaths"
import { readAsync } from "fs-jetpack"

export interface GetChapterProps {
  projectId: string
  chapterId: string
}

export async function getChapter({ projectId, chapterId }: GetChapterProps) {
  const chapterPath = getChapterPath(projectId, chapterId)
  return await readAsync(chapterPath, 'json')
}