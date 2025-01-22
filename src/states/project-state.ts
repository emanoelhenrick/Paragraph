import { create } from 'zustand'

interface props {
  currentProjectId: string
  setCurrentProjectId: (id: string) => void
}

export const useProject = create<props>((set) => ({
  currentProjectId: '',
  setCurrentProjectId: (id: string) => set(() => ({ currentProjectId: id }))
}))
