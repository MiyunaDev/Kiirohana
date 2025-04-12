import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import {
  createHashRouter,
  RouterProvider,
} from "react-router";
import { Toaster } from 'react-hot-toast';

const router = createHashRouter([
  {
    path: "/",
    Component: App,
  },
]);

createRoot(document.getElementById('root')!).render(
  <>
    <Toaster />
    <StrictMode>
    <RouterProvider router={router} />,
    </StrictMode>
  </>
)
