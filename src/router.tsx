import { createHashRouter, createRoutesFromElements, Outlet, Route } from "react-router-dom";
import Home from "./pages/home";
import { Editor } from "./pages/project/editor";
import { Places } from "./pages/project/places";
import { Notes } from "./pages/project/notes";
import { SectionSidebar } from "./components/section-sidebar";
import { SectionTab } from "./components/section-tab";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./components/ui/resizable";
import { ChapterEditor } from "./components/editor/chapter-editor";
import { ResizablePanels } from "./pages/project/ResizablePanels";


export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" Component={Home} />
      <Route path="/project/" element={
        <div className="flex">
          <ResizablePanels />
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