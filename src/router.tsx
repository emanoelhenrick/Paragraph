import { createHashRouter, createRoutesFromElements, Outlet, Route } from "react-router-dom";
import { MenuBar } from "./components/menu-bar";
import { Chapters } from "./pages/project/chapters";
import Home from "./pages/home";
import { Editor } from "./pages/project/editor";
import { Characters } from "./pages/project/char";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/app-sidebar";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" Component={Home} />
      <Route path="/project/" element={
        <SidebarProvider>
          <AppSidebar />
          <Outlet />
        </SidebarProvider>
        
        }
      >
        <Route path="/project/chapters" Component={Chapters} />
        <Route path="/project/char" Component={Characters} />
        <Route path="/project/editor/:id" Component={Editor} />
      </Route>
    </>

  )
  );