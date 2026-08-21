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

import Settings from './pages/Settings/Settings.tsx';
import ServicesSetting from './pages/Settings/ServicesSetting.tsx';
import NotFound from './pages/Error/NotFound.tsx';
import { ErrorBoundary } from './pages/Error/ErrorBoundary';

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
    ]
  },
  {
    path: "*",
    Component: NotFound
  }
]);

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster />
    <StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </StrictMode>
  </>,
)