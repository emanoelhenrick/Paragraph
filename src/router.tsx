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
        <Route path="/project/editor/:id" Component={Editor} />

        <Route path="/project/characters" Component={Characters} />
        <Route path="/project/characters/:id" Component={CharacterPage} />

        <Route path="/project/places" Component={Places} />

        <Route path="/project/notes" Component={Notes} />
      </Route>
    </>

  )
  );