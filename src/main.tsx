import { createRoot } from "react-dom/client";
import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
// import App from "./App.tsx";
// import NotFoundStudy from "./components/NotFoundStudy.tsx";
const App = lazy(() => import("./App.tsx"));
const NotFoundStudy = lazy(() => import("./components/NotFoundStudy.tsx"));

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
    <Suspense fallback={<div>Cargando estudio...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </>
);
