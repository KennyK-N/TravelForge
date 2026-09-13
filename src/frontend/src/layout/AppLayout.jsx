import Alert from "@components/ui/Alert";
import Header from "@components/header/Header.jsx";
import SideBarLayout from "@layout/SideBarLayout";

import { Outlet } from "react-router-dom";

export default function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white">
      <Alert />
      <SideBarLayout />
      <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto bg-white dark:bg-gray-900">
        <Header />
        <main className="h-full ml-10 sm:ml-27 md:ml-25 lg:ml-22 pt-[8.4em] pr-10 bg-white dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
