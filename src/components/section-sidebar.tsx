import { Album, AlignLeft, ChartLine, Library, StickyNote } from "lucide-react"
import { OptionsSwitcher } from "./options-switcher"
import { useSelectedSection } from "@/states/selected-section-state"

const sections = [
  {
    path: 'chapters',
    icon: Library
  },
  {
    path: 'notes',
    icon: StickyNote
  },
  {
    path: 'scenes',
    icon: Album
  },
  {
    path: 'stats',
    icon: ChartLine
  },

]

export function SectionSidebar() {
  const setSelectedSection = useSelectedSection(state => state.setSelectedSection)
  const selectedSection = useSelectedSection(state => state.selectedSection)

  return (
    <section className="border-r px-3 py-4 bg- h-screen">
      <section className="flex flex-col items-center gap-4">
        {sections.map(item => {
          return (
            <div key={item.path} onClick={() => setSelectedSection(item.path)} className={`p-3 rounded-lg cursor-pointer  ${selectedSection === item.path ? 'bg-primary text-background hover:text-background' : 'text-muted-foreground hover:text-primary'}`}>
              <item.icon strokeWidth={'2px'} className="size-6" />
            </div>
          )
        })}
      </section>
    </section>
  )
}