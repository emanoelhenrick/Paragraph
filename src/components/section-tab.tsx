import { ChaptersSection } from "./sections/chapters-section"
import { NotesSection } from "./sections/notes-section"
import { useSelectedSection } from "@/states/selected-section-state"

export function SectionTab() {
  const section = useSelectedSection(state => state.selectedSection)

  if (section === 'chapters') return <ChaptersSection />
  if (section === 'notes') return <NotesSection />
  return <ChaptersSection />
}