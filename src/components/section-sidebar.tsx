import { Album, ChartLine, ChartPie, Library, StickyNote } from "lucide-react"
import { OptionsSwitcher } from "./options-switcher"
import { useSelectedSection } from "@/states/selected-section-state"
import { IconAlignBoxLeftBottom, IconAlignBoxLeftTopFilled, IconBoxMultipleFilled, IconChartAreaFilled, IconFileFilled, IconGraphFilled, IconNote, IconQuoteFilled, IconStack2Filled, IconStackFilled, IconTimeline } from '@tabler/icons-react';

const sections = [
  {
    path: 'chapters',
    icon: IconAlignBoxLeftTopFilled
  },
  {
    path: 'notes',
    icon: IconQuoteFilled
  },
  {
    path: 'scenes',
    icon: IconStackFilled
  },
  {
    path: 'stats',
    icon: IconTimeline
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
            <div key={item.path} onClick={() => setSelectedSection(item.path)} className={`p-2 rounded-lg cursor-pointer  ${selectedSection === item.path ? 'bg-primary text-background hover:text-background' : 'text-muted-foreground hover:text-primary'}`}>
              <item.icon  className="size-6" />
            </div>
          )
        })}
      </section>
    </section>
  )
}