import { useSelectedSection } from "@/states/selected-section-state"
import { IconAlignBoxLeftTopFilled, IconQuoteFilled, IconStackFilled, IconTimeline } from '@tabler/icons-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { CommandMenu } from "./CommandMenu";

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

export function SectionSidebar({ setIsOpen }: { setIsOpen: (value: any) => void}) {
  const setSelectedSection = useSelectedSection(state => state.setSelectedSection)
  const selectedSection = useSelectedSection(state => state.selectedSection)

  function handleButton(path: any) {
    if (path !== selectedSection) {
      setSelectedSection(path)
      return setIsOpen(true)
    }
    setIsOpen((prev: boolean) => !prev)
  }

  return (
    <div>
      <section className=" px-4 border-r py-4 h-screen">
        <section className="flex flex-col items-center gap-4">
          {sections.map(item => {
            return (
              <div key={item.path} onClick={() => handleButton(item.path)} className={`p-2 rounded-lg cursor-pointer  ${selectedSection === item.path ? 'bg-primary text-background hover:text-background' : 'text-muted-foreground hover:text-primary'}`}>
                <item.icon className="size-6" />
              </div>
            )
          })}
        </section>
      </section>
      
      <CommandMenu />
    </div>
    
  )
}