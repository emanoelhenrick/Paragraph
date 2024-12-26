"use client"

import * as React from "react"
import { AlignLeft, BookOpen, Check, ChevronsUpDown, Download, FolderOpen, GalleryVerticalEnd, Settings } from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const options = [
  {
    value: 'open project',
    icon: FolderOpen,
    action: () => console.log('open project')
  },
  {
    value: 'export project',
    icon: Download,
    action: () => console.log('export')
  },
  {
    value: 'settings',
    icon: Settings,
    action: () => console.log('settings')
  }
]

export function OptionsSwitcher() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-background">
              <AlignLeft className="size-4" />
              </div>
              <div className="flex flex-col gap-0.5 leading-none">
                <span className="font-semibold">Paragraph</span>
                <span className="line-clamp-1 text-xs text-muted-foreground">Dune</span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] p-1"
            align="start"
          >
            {options.map((op) => (
              <DropdownMenuItem
                key={op.value}
                onSelect={op.action}
                className="cursor-pointer rounded-sm text-xs text-muted-foreground"
              >
                {op.value}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
