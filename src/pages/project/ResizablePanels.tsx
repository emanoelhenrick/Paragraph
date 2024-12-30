import { SectionSidebar } from "@/components/section-sidebar";
import { SectionTab } from "@/components/section-tab";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";

import { ImperativePanelHandle, Panel } from "react-resizable-panels";
import { Outlet } from "react-router-dom";

export function ResizablePanels() {
  const [isOpen, setIsOpen] = useState(true)
  const ref = useRef<ImperativePanelHandle>(null)

  useEffect(() => {
    if (!isOpen) return ref.current?.expand
    return ref.current?.collapse 
  }, [isOpen])

  return (
    <>
      <SectionSidebar setIsOpen={setIsOpen} />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel ref={ref} collapsible minSize={10} defaultSize={25}>
          <SectionTab />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel minSize={25} defaultSize={75}>
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </>
  )
}