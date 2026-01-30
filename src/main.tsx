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
import ComicReader from './pages/Comic/Reader.tsx';
import NovelReader from './pages/Novel/Reader.tsx';

import Settings from './pages/Settings/Settings.tsx';
import ServicesSetting from './pages/Settings/ServicesSetting.tsx';

// ------------------- Shinobu
import ShinobuList from "./pages/Shinobu/List.tsx"
// import ShinobuChat from "./pages/Shinobu/Chat/ChatPage.tsx"
import ShinobuNavigativeLayout from './layout/Shinobu/NavigativeLayout.tsx';

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
        path: "shinobu",
        children: [
          {
            path: "app", Component: ShinobuNavigativeLayout, children: [
              { index: true, Component: ShinobuList },
            ]
          }
        ]
      },
    ]
  },
]);

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster />
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  </>,
)
