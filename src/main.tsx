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
import ExtensionList from './pages/Extension/List.tsx';
import Latest from './pages/Extension/Latest.tsx';

import Settings from './pages/Settings/Settings.tsx';
import ServicesSetting from './pages/Settings/ServicesSetting.tsx';

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
            path: "browse", children: [
              { index: true, Component: ExtensionList },
              {
                path: ":extensionId", children: [
                  { path: "latest", Component: Latest }
                ]
              }
            ]
          },
          { path: "settings", children: [
            {
              index: true,
              Component: Settings
            },
            {
              path:"services",
              Component: ServicesSetting
            }
          ] },
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
      }
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
