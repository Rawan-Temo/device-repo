import { useEffect } from "react";
import { NavLink, useLocation } from "react-router";

function Sidebar() {
  const location = useLocation();
  useEffect(() => {
    const sideBar = document.querySelector(".sidebar");
    sideBar?.classList.remove("active-sidebar");
  }, [location.pathname]);
  return (
    <div className="sidebar ">
      <ul className="sidebar-icons">
        <li title="Overview">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-tab" : ""}`
            }
          >
            <i className="fa-solid fa-house"></i>
          </NavLink>
        </li>
        <li title="Devices">
          <NavLink
            to="/devices"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-tab" : ""}`
            }
          >
            <i className="fa-solid fa-desktop"></i>
          </NavLink>
        </li>
        <li title="Users">
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-tab" : ""}`
            }
          >
            <i className="fa-solid fa-users"></i>
          </NavLink>
        </li>
        <li title="Settings">
          <NavLink
            to="/settings"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-tab" : ""}`
            }
          >
            <i className="fa-solid fa-gear"></i>
          </NavLink>
        </li>
        <li title="Logs">
          <NavLink
            to="/logs"
            className={({ isActive }) =>
              `nav-link ${isActive ? "active-tab" : ""}`
            }
          >
            <i className="fa-solid fa-file-invoice"></i>
          </NavLink>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
