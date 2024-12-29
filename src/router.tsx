import { createHashRouter, createRoutesFromElements, Outlet, Route } from "react-router-dom";
import { Chapters } from "./pages/project/chapters";
import Home from "./pages/home";
import { Editor } from "./pages/project/editor";
import { Characters } from "./pages/project/characters";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";
import { Places } from "./pages/project/places";
import { Notes } from "./pages/project/notes";
import { CharacterPage } from "./pages/project/character";
import { IconArrowLeft, IconBrandTabler, IconSettings, IconUserBolt } from "@tabler/icons-react";
import { SectionSidebar } from "./components/section-sidebar";
import { SectionTab } from "./components/section-tab";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { ChapterEditor } from "./components/editor/chapter-editor";


export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" Component={Home} />
      <Route path="/project/" element={
        <div className="flex">
          <SectionSidebar />
          <ResizablePanelGroup direction="horizontal">
            <ResizablePanel defaultSize={25}>
              <SectionTab />
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={75}>
              <Outlet />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div> 
        }
      >
        <Route path="/project/chapter/:id" Component={ChapterEditor} />
        <Route path="/project/note" Component={Editor} />

        <Route path="/project/scenes" Component={Places} />

        <Route path="/project/stats" Component={Notes} />
      </Route>
    </>

  )
  );