import { create } from 'zustand'

interface props {
  selectedSection: string
  setSelectedSection: (section: string) => void
}

export const useSelectedSection = create<props>((set) => ({
  selectedSection: 'chapters',
  setSelectedSection: (section: string) => set(() => ({ selectedSection: section }))
}))
