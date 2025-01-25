import { Tag } from "emblor"

export interface Chapter {
  id: string
  title: string
  position: number
  content?: any
  resume?: string
  tags?: Tag[]
}