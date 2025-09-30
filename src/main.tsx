import { enableMapSet } from "immer";
enableMapSet();
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { RouteErrorBoundary } from '@/components/RouteErrorBoundary';
import '@/index.css';
// Layouts and Pages
import { MainLayout } from '@/components/layouts/MainLayout';
import { ProtectedRoute } from '@/components/layouts/ProtectedRoute';
import { LoginPage } from '@/pages/LoginPage';
import { HomePage } from '@/pages/HomePage';
import { UsersPage } from '@/pages/users/UsersPage';
import { DefinitionsPage } from '@/pages/definitions/DefinitionsPage';
import { SdcTrackingPage } from '@/pages/sdc-tracking/SdcTrackingPage';
const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/",
    element: <ProtectedRoute />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "users", element: <UsersPage /> },
          {
            path: "definitions/sponsors",
            element: <DefinitionsPage entityType="sponsors" />,
          },
          {
            path: "definitions/centers",
            element: <DefinitionsPage entityType="centers" />,
          },
          {
            path: "definitions/researchers",
            element: <DefinitionsPage entityType="researchers" />,
          },
          {
            path: "definitions/project-codes",
            element: <DefinitionsPage entityType="project-codes" />,
          },
          {
            path: "definitions/work-performed",
            element: <DefinitionsPage entityType="work-performed" />,
          },
          {
            path: "definitions/sdc-tracking",
            element: <SdcTrackingPage />,
          },
        ],
      },
    ],
  },
]);
// Do not touch this code
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  </StrictMode>,
);