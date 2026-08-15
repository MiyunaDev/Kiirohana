import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./index.css"

import {
  createHashRouter,
  RouterProvider,
} from "react-router";
import { Toaster } from 'react-hot-toast';

import App from './App.tsx'
import AppLayout from './components/layout/AppLayout.tsx';
import { AppearanceProvider } from './contexts/AppearanceContext.tsx';

const router = createHashRouter([
  {
    path: "/",
    Component: AppLayout,
    children: [
      { index: true, Component: App },
      {
        path: "onboarding", children: [
        ]
      },
      {
        path: "auth", children: [
        ]
      },
    ]
  }
]);

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster />
    <StrictMode>
      <AppearanceProvider>
        <RouterProvider router={router} />
      </AppearanceProvider>
    </StrictMode>
  </>,
)
