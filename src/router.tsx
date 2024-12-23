import { createHashRouter, createRoutesFromElements, Outlet, Route } from "react-router-dom";
import { MenuBar } from "./components/menu-bar";
import { Chapters } from "./pages/project/chapters";
import Home from "./pages/home";
import { Editor } from "./pages/project/editor";

export const router = createHashRouter(
  createRoutesFromElements(
    <>
      <Route path="/" Component={Home} />
      <Route path="/project/" element={
        <div className="flex">
          <MenuBar />
          <Outlet />
        </div>
        }
      >
        <Route path="/project/:id/chapters" Component={Chapters} />
        <Route path="/project/editor/:id" Component={Editor} />
      </Route>
    </>

  )
  );