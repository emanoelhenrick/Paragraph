import { Tag } from "emblor"
import { getChapter } from "./getChapter"
import { updateChapter } from "./updateChapter"

export interface UpdateTagsProps {
  projectId: string
  chapterId: string
  tags: Tag[]
}

export async function updateTags({ projectId, chapterId, tags }: UpdateTagsProps) {
  const chapter = await getChapter({ projectId, chapterId })
  const updated = { ...chapter, tags }
  await updateChapter({ projectId, chapterData: updated })
}