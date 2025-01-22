interface DayStats {
  date: Date
  wordsWritten: number
}

export interface IdProps {
  id: string
  title: string
  folder?: IdProps
}

export interface ProjectInfo {
  name: string
  id: string
  chapters: IdProps[]
  notes: IdProps[]
  scenes: IdProps[]
  stats?: {
    deadline: Date
    wordsPerChapterLimit: number
    days: DayStats[]
  }
}