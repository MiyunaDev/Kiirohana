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
import Settings from './pages/Settings/Settings.tsx';
import History from './pages/History/History.tsx';

const router = createHashRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: App },
      {
        path: "app", Component: NavigativeLayout, children: [
          { path: "library", Component: Library },
          { path: "settings", Component: Settings },
          { path: "history", Component: History }
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
