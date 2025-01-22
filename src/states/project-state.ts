import { IdProps, ProjectInfo } from 'electron/core/models/ProjectInfo'
import { create } from 'zustand'

interface props {
  info: ProjectInfo
  setInfo: (info: ProjectInfo) => void
}

export const useProjectInfo = create<props>((set) => ({
  info: {
    id: '',
    name: ''
  } as ProjectInfo,
  setInfo: (data: ProjectInfo) => set(() => ({ info: data })),
}))
