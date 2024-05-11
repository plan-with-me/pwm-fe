import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "pages/Login";
import Home from "pages/Home";
import Auth from "pages/Auth";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/auth", element: <Auth /> },
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
