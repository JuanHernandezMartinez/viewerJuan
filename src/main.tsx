import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundStudy from "./components/NotFoundStudy.tsx";

const router = createBrowserRouter([
  {
    path: "/viewer/:studyUID",
    element: <App />,
  },
  {
    path: "*",
    element: <NotFoundStudy />,
  },
  {
    path: "/notfound",
    element: <NotFoundStudy />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <>
    <RouterProvider router={router} />
  </>
);
