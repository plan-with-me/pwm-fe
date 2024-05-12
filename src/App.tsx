import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "pages/Login";
import Home from "pages/Home";
import Auth from "pages/Auth";
import Tgoals from "pages/TGoals/TGoals";
import UpdateTgoals from "pages/TGoals/UpdateTGoals";
import CreateTgoals from "pages/TGoals/CreateTGoals";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import My from "pages/My";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/auth", element: <Auth /> },
  { path: "/tgoal", element: <Tgoals />},
  { path: "/update-tgoal/:id", element: <UpdateTgoals />},
  { path: "/create-tgoal", element: <CreateTgoals />},
  { path: "/my", element: <My /> },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
          <ReactQueryDevtools />
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}

export default App;
