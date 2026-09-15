import { Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import { useUserContext } from "@context/UserContext";

import SignInForm from "@pages/auth/SignInForm";
import SignUpForm from "@pages/auth/SignUpForm";
import ResetPasswordForm from "@pages/auth/ResetPasswordForm";
import ForgotPasswordForm from "@pages/auth/ForgotPasswordForm";
import ChangePasswordForm from "@pages/auth/ChangePasswordForm";
import Home from "@pages/Home";
import Search from "@pages/Search";
import UserSetting from "@pages/UserSetting";
import About from "@pages/About";
import CreateTravelPlan from "@pages/CreateTravelPlan";
import ViewTravelPlan from "@pages/ViewTravelPlan";
import NotFound from "@pages/NotFound";

import AppLayout from "@layout/AppLayout";
import AuthLayout from "@layout/AuthLayout";
import Spinner from "@components/common/Spinner";

import PageMeta from "@components/common/PageMeta";

function PrivateRoute() {
  const location = useLocation();
  const { isAuthenticated } = useUserContext();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" replace state={{ from: location }} />
  );
}

function PublicRoute() {
  const location = useLocation();
  const { isAuthenticated } = useUserContext();

  const fromLocation = location.state?.from;

  const redirectPath = fromLocation
    ? `${fromLocation.pathname}${fromLocation.search}${fromLocation.hash}`
    : "/home";

  return isAuthenticated ? <Navigate to={redirectPath} replace /> : <Outlet />;
}

function App() {
  const { isAuthenticated, isAuthLoading, providerId, theme } =
    useUserContext();

  return (
    <>
      <PageMeta
        title="TravelForge AI Travel Planner"
        description="Manage your travel planner in one place"
      />
      {isAuthLoading ? (
        <div
          className={`min-h-screen w-full flex items-center justify-center ${
            theme === "dark" ? "bg-gray-900" : "bg-white"
          }`}
        >
          <Spinner />
        </div>
      ) : (
        <Routes>
          <Route
            index
            element={
              <Navigate to={isAuthenticated ? "/home" : "/sign-in"} replace />
            }
          />
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path="sign-in" element={<SignInForm />} />
              <Route path="sign-up" element={<SignUpForm />} />
              <Route path="forgot-password" element={<ForgotPasswordForm />} />
              <Route path="reset-password" element={<ResetPasswordForm />} />
            </Route>
          </Route>
          <Route element={<PrivateRoute />}>
            <Route element={<AppLayout />}>
              <Route path="home" element={<Home />} />
              <Route path="setting" element={<UserSetting />} />
              <Route path="about" element={<About />} />
              <Route path="create-travel-plan" element={<CreateTravelPlan />} />
              <Route path="search" element={<Search />} />
              <Route path="view-travel-plan/:id" element={<ViewTravelPlan />} />
            </Route>
            {providerId !== "google" && (
              <Route element={<AuthLayout />}>
                <Route
                  path="change-password"
                  element={<ChangePasswordForm />}
                />
              </Route>
            )}
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
