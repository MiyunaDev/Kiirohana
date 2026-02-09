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
import ComicReader from './pages/Shinobu/pages/Comic/Reader.tsx';
import NovelReader from './pages/Shinobu/pages/Novel/Reader.tsx';

import Settings from './pages/Settings/Settings.tsx';
import ServicesSetting from './pages/Settings/ServicesSetting.tsx';

// ------------------- Shinobu
import Latest from "./pages/Shinobu/pages/Browse/Latest.tsx"
// import ShinobuChat from "./pages/Shinobu/Chat/ChatPage.tsx"
import UserProfilePage from './pages/Shinobu/pages/Detail/User.tsx';
import InstalledShinobu from './pages/Shinobu/pages/System/Main.tsx';
import ShinobuBootstrap from './pages/Shinobu/pages/System/Bootsrap.tsx';
import ShinobuLogin from './pages/Shinobu/pages/System/Login.tsx';
import { ShinobuProvider } from './contexts/ShinobuContext.tsx';
import ShinobuDetail from './pages/Shinobu/pages/Detail/Media.tsx';
import MainLayout from './pages/Shinobu/layout/Main.layout.tsx';
import Landing from './pages/Shinobu/Landing/Landing.tsx';

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
              { path: "comic", Component: ComicReader },
              { path: "novel", Component: NovelReader },
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
                  { index: true, Component: Landing },
                  {
                    path: "search/latest", Component: Latest
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
              {
                path: "reader/novel/:chapterId",
                Component: NovelReader,
              },
              {
                path: "reader/novel/:chapterId",
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
