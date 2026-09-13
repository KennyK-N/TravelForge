/* eslint-disable react-refresh/only-export-components */

import { useContext, useState, createContext, useEffect } from "react";

const sideBarContext = createContext();
const MOBILE_BREAKPOINT = 648;

export function useSidebarContext() {
  const context = useContext(sideBarContext);

  if (!context) {
    throw new Error("useSidebarContext must be used within sideBarProvider");
  }

  return context;
}

export function SideBarProvider({ children }) {
  const [expanded, setExpanded] = useState(
    !(window.innerWidth < MOBILE_BREAKPOINT),
  );

  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_BREAKPOINT,
  );

  function toggleSidebar() {
    setExpanded((prev) => !prev);
  }

  function closeSidebar() {
    setExpanded(false);
  }

  function openSideBar() {
    setExpanded(true);
  }

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);

    const onChange = (e) => {
      setIsMobile(e.matches);
      e.matches ? closeSidebar() : openSideBar();
    };

    mql.addEventListener("change", onChange);

    return () => {
      mql.removeEventListener("change", onChange);
    };
  }, []);

  return (
    <sideBarContext.Provider
      value={{ expanded, toggleSidebar, closeSidebar, isMobile }}
    >
      {children}
    </sideBarContext.Provider>
  );
}
