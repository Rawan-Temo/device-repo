import { NavLink, Outlet } from "react-router"; // Import Navigate for redirection

import "./user.css";
import { useContext } from "react";
import { Context } from "../../../../context/context";

function Users() {
  const context = useContext(Context);
  const language = context?.selectedLang;
  return (
    <div className="main-content pad-40">
      <div className="users-container">
        <div className="tabs-header flex">
          <NavLink
            to="manage-users"
            className={({ isActive }) =>
              isActive ? "tab-button active" : "tab-button"
            }
          >
           {language?.users?.manage_users}
          </NavLink>

          <NavLink
            to="Add-users"
            className={({ isActive }) =>
              isActive ? "tab-button active" : "tab-button"
            }
          >
            {language?.users?.add_user}
          </NavLink>
          <NavLink
            to="manage-groups"
            className={({ isActive }) =>
              isActive ? "tab-button active" : "tab-button"
            }
          >
            {language?.users?.manage_groups}
          </NavLink>
          <NavLink
            to="link-user"
            className={({ isActive }) =>
              isActive ? "tab-button active" : "tab-button"
            }
          >
           {language?.users?.link_user}
          </NavLink>

          <NavLink
            to="link-device"
            className={({ isActive }) =>
              isActive ? "tab-button active" : "tab-button"
            }
          >
            {language?.users?.link_device}
          </NavLink>
        </div>
        <div className="tabs-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Users;
