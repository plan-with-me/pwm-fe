import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Reset } from "styled-reset";
import Login from "pages/Login";
import Home from "pages/Home";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
]);

function App() {
  return (
    <>
      <Reset />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
