import MapScreen from "../pages/map/MapScreen";
// import LoginPage from "../pages/auth/loginPage";
// import SignupPage from "../pages/auth/signupPage";
import MainLayout from "../layouts/MainLayout";

interface AppRoute {
  path: string;
  element: JSX.Element;
  layout?: React.ComponentType<{ children: React.ReactNode }>;
}

export const appRoutes: AppRoute[] = [
  {
    path: "/map",
    element: <MapScreen />,
    layout: MainLayout,
  },
  // {
  //   path: "/login",
  //   element: <LoginPage />,
  // },
  // {
  //   path: "/signup",
  //   element: <SignupPage />,
  // },
];
