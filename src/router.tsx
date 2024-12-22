import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Project from "./pages/Project";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/project",
    element: <Project />,
  },
]);