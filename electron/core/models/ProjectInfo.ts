interface DayStats {
  date: Date
  wordsWritten: number
}

export interface ProjectInfo {
  name: string
  id: string
  stats?: {
    deadline: Date
    wordsPerChapterLimit: number
    days: DayStats[]
  }
}