import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="h-screen box-border bg-white dark:bg-gray-900">
      <div className="flex h-full w-full flex-col items-center justify-center lg:flex-row">
        <Outlet />
      </div>
    </div>
  );
}
