import { createHashRouter, createRoutesFromElements, Route } from "react-router-dom";
import Home from "./pages/home";
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
      </Route>
    </>
  )
  );