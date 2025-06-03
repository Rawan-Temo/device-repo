import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { format } from "date-fns";
import "../css/Sidebar.css";
import "./device.css";
import { Context } from "../../../../context/context";
import { useDevice } from "../../../../context/DeviceContext";
import { WebSocketContext } from "../../../../context/WebSocketProvider";

const iconMap = [
  { permission: "all_file_access", icon: "fa-folder-open" },
  { permission: "battery_optimize", icon: "fa-battery-full" },
  { permission: "notification", icon: "fa-bell" },
  { permission: "auto_display_in_background", icon: "fa-display" },
  { permission: "contact", icon: "fa-address-book" },
  { permission: "sms", icon: "fa-comment-sms" },
  { permission: "call_log", icon: "fa-phone-volume" },
  { permission: "microphone", icon: "fa-microphone" },
  { permission: "location", icon: "fa-location-dot" },
  { permission: "notification_access", icon: "fa-check-double" },
];

const DeviceList = ({ activeTab }) => {
  const context = useContext(Context);
  const language = context?.selectedLang;
  const [loading, setLoading] = useState(true);
  const { state } = useDevice();
  const { socketRef } = useContext(WebSocketContext);

  // Use myDevices from global state
  const myDevices = state?.myDevices || [];

  // Split devices into active and offline
  const activeDevices = myDevices.filter((device) => device.is_connected);

  const offlineDevices = myDevices.filter((device) => !device.is_connected);

  useEffect(() => {
    setLoading(false);
  }, [myDevices]);

  const sendWsMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === 1) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  const devicesToShow = activeTab === "online" ? activeDevices : offlineDevices;

  if (loading) return <p className="loading">Loading...</p>;

  return (
    <>
      {devicesToShow.map((device) => (
        <NavLink
          to={`/devices/${device.uuid}`}
          key={device.uuid}
          className="chat-card"
        >
          <i className="fa-solid fa-mobile-screen"></i>
          <div className="chat-info">
            <h3 className="chat-name">{device.name}</h3>
            <h3 className="chat-name">{device.last_seen}</h3>
          </div>
          <div className="granted-permissions icons">
            {iconMap.map(({ permission, icon }) =>
              device.granted_permission?.[permission] ? (
                <i
                  key={permission}
                  className={`fa-solid ${icon} active-icon`}
                  title={permission}
                ></i>
              ) : null
            )}
          </div>
        </NavLink>
      ))}
    </>
  );
};

function Devices() {
  const [activeTab, setActiveTab] = useState("online");
  const location = useLocation();
  const { selectedLang: language } = useContext(Context);

  useEffect(() => {
    const deviceBar = document.querySelector(".mini-sidebar-device-d");
    if (deviceBar) {
      if (location.pathname === "/devices") {
        deviceBar.classList.add("mini-sidebar-device-d-active");
      } else {
        deviceBar.classList.remove("mini-sidebar-device-d-active");
      }
    }
  }, [location.pathname]);

  return (
    <main className="main-content">
      <div className="devices-container-d">
        <div className="sidebar-device-d">
          <div className="tabs">
            <div
              className={`tab ${activeTab === "online" ? "active" : ""}`}
              onClick={() => setActiveTab("online")}
            >
              {language?.devices?.online}
            </div>
            <div
              className={`tab ${activeTab === "offline" ? "active" : ""}`}
              onClick={() => setActiveTab("offline")}
            >
              {language?.devices?.offline}
            </div>
          </div>
          <DeviceList activeTab={activeTab} />
        </div>

        {/* Optional mini-sidebar duplicate removed for clarity */}

        <div className="device-content-d">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default Devices;
