import { getChapterPath } from "../../localPaths"
import { writeAsync } from "fs-jetpack"
import { Chapter } from "../../models/Chapter"
import { getProjectInfo } from "../project/getProjectInfo"
import { updateProjectInfo } from "../project/updateProjectInfo"
import { Tag } from "emblor"

export interface UpdateChapterProps {
  projectId: string
  chapterData: Chapter
}

export async function updateChapter({ projectId, chapterData }: UpdateChapterProps) {
  //UPDATE THE CHAPTER JSON
  const chapterPath = getChapterPath(projectId, chapterData.id)
  await writeAsync(chapterPath, chapterData)

  const projectInfo = await getProjectInfo(projectId)
  const updated = projectInfo.chapters.map(chap => {
    if (chap.id === chapterData.id) {
      return {
        ...chap,
        title: chapterData.title,
        position: chapterData.position,
        tags: chapterData.tags ? chapterData.tags : []
      }
    }
    return chap
  })

  projectInfo.chapters = updated
  await updateProjectInfo(projectInfo)
}