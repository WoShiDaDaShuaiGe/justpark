// src/routes/index.tsx
import type { ReactNode } from "react";
import MapScreen from "../pages/map/MapScreen";
import AboutPage from "../pages/about/AboutPage";
import MainLayout from "../layouts/MainLayout";
import NotFoundPage from "../pages/notfound/NotFoundPage";
import { MapControlsProvider } from "../context/MapControlsContext";

interface AppRoute {
  path: string;
  element: ReactNode; // Changed from JSX.Element to ReactNode
  layout?: React.ComponentType<{ children: ReactNode }>;
}

// eslint-disable-next-line react-refresh/only-export-components
const MainLayoutWithContext: React.ComponentType<{
  children: ReactNode;
}> = ({ children }) => (
  <MapControlsProvider>
    <MainLayout>{children}</MainLayout>
  </MapControlsProvider>
);

export const appRoutes: AppRoute[] = [
  {
    path: "/",
    element: <MapScreen />,
    layout: MainLayoutWithContext,
  },
  {
    path: "/about",
    element: <AboutPage />,
    layout: MainLayout,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
];
