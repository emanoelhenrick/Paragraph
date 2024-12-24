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
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { Home, Library, Map, Settings, StickyNote, UserPen } from "lucide-react"
import { useNavigate } from "react-router-dom"

const projectItems = [
  {
    title: "Chapters",
    url: "/project/chapters",
    icon: Library,
  },
  {
    title: "Characters",
    url: "/project/char",
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

const appItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]
 
export function AppSidebar() {
  const navigate = useNavigate()
  const sidebar = useSidebar()

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader className={`${sidebar.open && 'absolute'} w-full`}>
        <SidebarTrigger className={`text-muted-foreground self-end z-20`} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Project</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {projectItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <div onClick={() => navigate(item.url)} className="text-muted-foreground gap-4 cursor-pointer">
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
          {appItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <div onClick={() => navigate(item.url)} className="text-muted-foreground gap-4 cursor-pointer">
                  <item.icon />
                  <span>{item.title}</span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}