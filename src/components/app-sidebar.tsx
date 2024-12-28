import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { ChevronDown, Home, Library, Map, PanelLeft, Plus, Settings, StickyNote, UserPen } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { OptionsSwitcher } from "./options-switcher"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { useState } from "react"
import { Input } from "./ui/input"
import { randomUUID } from "crypto"

const projectItems = [
  {
    title: "Chapters",
    url: "/project/chapters",
    icon: Library,
  },
  {
    title: "Characters",
    url: "/project/characters",
    icon: UserPen,
  },
  {
    title: "Places",
    url: "/project/places",
    icon: Map,
  },
  {
    title: "Notes",
    url: "/project/notes",
    icon: StickyNote,
  }
]

const foldersData = [
  {
    folderId: 'chapters',
    data: [
      {
        title: 'When the history begins'
      },
      {
        title: 'When the prota dies'
      },
      {
        title: 'And returns'
      }
    ]
  },
  {
    folderId: 'notes',
    data: [
      {
        title: 'leto atreides'
      },
      {
        title: 'paul atreides'
      },
      {
        title: 'jessica atreides'
      }
    ]
  }
]

const defaultFolders = [
  {
    title: 'Chapters',
    url: '/project/editor/',
    id: 'chapters',
    icon: Library
  },
  {
    title: 'Notes',
    url: '/project/notes/',
    id: 'notes',
    icon: StickyNote
  }
]
 
export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar } = useSidebar()

  const [folderName, setFolderName] = useState('')
  const [folders, setFolders] = useState(defaultFolders)

  function addNewFolder() {
    const newFolder = {
      title: folderName,
      url: `/project/custom/`,
      id: (Math.random() * 1000).toString()
    }
    setFolders(prev => [...prev, newFolder])
    setFolderName('')
  }

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <OptionsSwitcher />
      </SidebarHeader>
      <SidebarContent>

        {folders.map(folder => {
          const folderData = foldersData.find(f => f.folderId === folder.id)
          return (
              <SidebarMenu className="py-0 px-2">
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton className="flex justify-between">
                            <div className={`text-muted-foreground flex items-center text-xs gap-2 cursor-pointer`}>
                              {folder.icon ? <folder.icon className="size-3.5 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground transition-transform group-data-[state=open]/collapsible:rotate-180" />}
                              <span>{folder.title}</span>
                            </div>
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                      {folderData ? folderData.data.map((item, index) => (
                        <SidebarMenuSubItem key={index}>
                          <SidebarMenuButton asChild onClick={() => navigate(folder.url + index)}>
                            <div className={`text-muted-foreground text-xs gap-4 cursor-pointer`}>
                              <span>{item.title}</span>
                            </div>
                          </SidebarMenuButton>
                        </SidebarMenuSubItem>
                      )) : <span className="text-xs text-muted-foreground text-center">Nothing here</span>}
                      </SidebarMenuSub>
                    </CollapsibleContent>

                    <SidebarMenuBadge className="text-muted-foreground">{folderData ? folderData.data.length : '0'}</SidebarMenuBadge>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>

            )
          })}

      </SidebarContent>
      <SidebarFooter>
      <SidebarMenu className="gap-2">
          <SidebarMenuItem>
              <SidebarMenuButton asChild className="w-fit">
                <div onClick={toggleSidebar} className="text-muted-foreground gap-4 cursor-pointer w-fit">
                  <PanelLeft />
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>

        <form onSubmit={addNewFolder}>
          <SidebarMenu>
            <SidebarMenuItem>
              <Input value={folderName} onChange={v => setFolderName(v.currentTarget.value)} className="text-xs" placeholder="New folder..." />
            </SidebarMenuItem>
          </SidebarMenu>
        </form>
      </SidebarFooter>
    </Sidebar>
  )
}