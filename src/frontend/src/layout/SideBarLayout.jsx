import { NavLink } from "react-router-dom";
import { Home, Info, Map, Search, Settings } from "lucide-react";

import Sidebar from "@components/sidebar/SideBar";
import SideBarItem from "@components/sidebar/SideBarItem";

export default function SideBarLayout() {
  return (
    <>
      <Sidebar>
        {/*children */}
        <NavLink to="/home">
          {({ isActive }) => (
            <SideBarItem
              icon={<Home size={20} />}
              text="Home"
              active={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/search">
          {({ isActive }) => (
            <SideBarItem
              icon={<Search size={20} />}
              text="Search"
              active={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/create-travel-plan">
          {({ isActive }) => (
            <SideBarItem
              icon={<Map size={20} />}
              text="Create Travel Plan"
              active={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/setting">
          {({ isActive }) => (
            <SideBarItem
              icon={<Settings size={20} />}
              text="Settings"
              active={isActive}
            />
          )}
        </NavLink>
        <NavLink to="/about">
          {({ isActive }) => (
            <SideBarItem
              icon={<Info size={20} />}
              text="About"
              active={isActive}
            />
          )}
        </NavLink>
      </Sidebar>
    </>
  );
}
