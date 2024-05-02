import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "pages/Login";
import Home from "pages/Home";
import Auth from "pages/Auth";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/auth", element: <Auth /> },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
