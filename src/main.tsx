import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"

import {
  createHashRouter,
  RouterProvider,
} from "react-router";
import { Toaster } from 'react-hot-toast';

import App from './App.tsx'
import AppLayout from './layout/AppLayout.tsx';
import NavigativeLayout from './layout/NavigativeLayout.tsx';
import Library from './pages/Library/Library.tsx';
import History from './pages/History/History.tsx';
import Detail from './pages/Detail/Detail.tsx';
import DetailLayout from './layout/DetailLayout.tsx';
// import NovelReader from './pages/Shinobu/pages/Novel/Reader.tsx';

import Settings from './pages/Settings/Settings.tsx';
import ServicesSetting from './pages/Settings/ServicesSetting.tsx';

// ------------------- Shinobu
import Latest from "./Shinobu/pages/Browse/Latest.tsx"
// import ShinobuChat from "./pages/Shinobu/Chat/ChatPage.tsx"
import ComicReader from './Shinobu/pages/Comic/Reader.tsx';
import UserProfilePage from './Shinobu/pages/Detail/User.tsx';
import InstalledShinobu from './Shinobu/pages/System/Main.tsx';
import ShinobuBootstrap from './Shinobu/pages/System/Bootsrap.tsx';
import ShinobuLogin from './Shinobu/pages/System/Login.tsx';
import { ShinobuProvider } from './contexts/ShinobuContext.tsx';
import ShinobuDetail from './Shinobu/pages/Detail/Media.tsx';
import MainLayout from './Shinobu/layout/Main.layout.tsx';
import Landing from './Shinobu/pages/Landing/Landing.tsx';
import SearchLayout from './Shinobu/layout/Search.layout.tsx';
import Advance from './Shinobu/pages/Browse/Advance.tsx';
import HistoryPage from './Shinobu/pages/History/History.tsx';
import AccountCenterPage from './Shinobu/pages/System/AccountCenter.tsx';
import MainSetting from './Shinobu/Settings/MainSetting.tsx';

const router = createHashRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: App },
      {
        path: "app", Component: NavigativeLayout, children: [
          { path: "library", Component: Library },
          {
            path: "settings", children: [
              {
                index: true,
                Component: Settings
              },
              {
                path: "services",
                Component: ServicesSetting
              }
            ]
          },
          { path: "history", Component: History }
        ]
      },
      {
        path: "detail", Component: DetailLayout, children: [
          { index: true, Component: Detail },
          {
            path: "reader", children: [
              // { path: "comic", Component: ComicReader },
              // { path: "novel", Component: NovelReader },
            ]
          }
        ]
      },
      {
        path: "shinobu", children: [
          { index: true, Component: InstalledShinobu },
          {
            path: ":shinobuid", Component: ShinobuProvider, children: [
              {
                index: true, Component: ShinobuBootstrap
              },
              {
                path: "login", Component: ShinobuLogin
              },
              {
                path: "app", Component: MainLayout, children: [
                  { path: "account-center", Component: AccountCenterPage },
                  { path: "settings", Component: MainSetting },
                  { path: "home", Component: Landing },
                  { path: "history", Component: HistoryPage },
                  {
                    path: "search", Component: SearchLayout, children: [
                      { path: "latest", Component: Latest },
                      { path: "advance", Component: Advance }
                    ]
                  }
                ]
              },
              {
                path: "profile", Component: UserProfilePage
              },
              {
                path: "detail/:mediaId",
                Component: ShinobuDetail,
              },
              // {
              //   path: "reader/novel/:chapterId",
              //   Component: NovelReader,
              // },
              {
                path: "reader/comic/:chapterId",
                Component: ComicReader,
              },
            ]
          }
        ]
      }
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster />
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </>,
)
