import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "pages/Login";
import Home from "pages/Home";
import Auth from "pages/Auth";
import Following from "pages/Following";
import Tgoals from "pages/TGoals/TGoals";
import UpdateTgoals from "pages/TGoals/UpdateTGoals";
import CreateTgoals from "pages/TGoals/CreateTGoals";
import STgoals from "pages/SharedTGoals/STGoals";
import SUpdateTgoals from "pages/SharedTGoals/SUpdateTGoals";
import SCreateTgoals from "pages/SharedTGoals/SCreateTGoals";
import Settings from "pages/Setting";
import My from "pages/My";
import CalendarPage from "pages/CalendarPage";
import CalendarSetting from "pages/CalendarSetting";
import CalendarProfile from "pages/CalendarProfile";
import Lounge from "pages/Lounge";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RecoilRoot } from "recoil";
import CalendarUsers from "pages/Calendar/CalendarUsers";
import DiaryPage from "pages/DiaryPage";
import FollowingDiary from "pages/FollowingDiary";
import SearchUser from "pages/SearchUser";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/home", element: <Home /> },
  { path: "/diary", element: <DiaryPage /> },
  { path: "/diary/write", element: <DiaryPage /> },
  { path: "/diary/edit/:diaryId", element: <DiaryPage /> },
  { path: "/auth", element: <Auth /> },
  { path: "/tgoal", element: <Tgoals /> },
  { path: "/update-tgoal/:id", element: <UpdateTgoals /> },
  { path: "/create-tgoal", element: <CreateTgoals /> },
  { path: "/setting", element: <Settings /> },
  { path: "/my", element: <My /> },
  { path: "/following/:id", element: <Following /> },
  { path: "/following/:id/diary", element: <FollowingDiary /> },
  { path: "/lounge", element: <Lounge /> },
  { path: "/calendar/:calendar_id", element: <CalendarPage /> },
  { path: "/calendar/:calendar_id/setting", element: <CalendarSetting /> },
  {
    path: "/calendar/:calendar_id/setting/profile",
    element: <CalendarProfile />,
  },
  { path: "/calendar/:calendar_id/s-tgoal", element: <STgoals /> },
  {
    path: "/calendar/:calendar_id/s-update-tgoal/:id",
    element: <SUpdateTgoals />,
  },
  { path: "/calendar/:calendar_id/s-create-tgoal", element: <SCreateTgoals /> },
  { path: "/calendar/:calendar_id/setting/users", element: <CalendarUsers /> },
  { path: "/search/:id", element:<SearchUser/>}
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
