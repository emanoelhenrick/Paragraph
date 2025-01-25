import { Tag } from "emblor"

interface DayStats {
  date: Date
  wordsWritten: number
}

export interface IdProps {
  id: string
  title: string
  folder?: IdProps
}

export interface ChapterIdProps extends IdProps {
  position: number
  tags?: Tag[]
}

export interface ProjectInfo {
  name: string
  id: string
  chapters: ChapterIdProps[]
  notes: IdProps[]
  scenes: IdProps[]
  stats?: {
    deadline: Date
    wordsPerChapterLimit: number
    days: DayStats[]
  }
}