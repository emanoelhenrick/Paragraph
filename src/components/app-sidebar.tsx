import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Home, Library, Map, PanelLeft, Settings, StickyNote, UserPen } from "lucide-react"
import { useLocation, useNavigate } from "react-router-dom"
import { OptionsSwitcher } from "./options-switcher"

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
 
export function AppSidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { toggleSidebar } = useSidebar()

  return (
    <Sidebar variant="sidebar" collapsible="icon" >
      <SidebarHeader>
        <OptionsSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div onClick={() => navigate(item.url)} className={`text-muted-foreground text-sm gap-4 cursor-pointer ${location.pathname.includes(item.title.toLowerCase()) && 'bg-secondary'}`}>
                      <item.icon />
                      <span>{item.title}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
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
      </SidebarFooter>
    </Sidebar>
  )
}