import { useContext, useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router";
import { format } from "date-fns";
import "../css/Sidebar.css";
import "./device.css";
import { Context } from "../../../../context/context";
import axios from "axios";
import { host } from "../../../../serverConfig.json";

const DeviceList = ({ activeTab }) => {
  const context = useContext(Context);
  const language = context?.selectedLang;
  const [loading, setLoading] = useState(true);
  const [allDevices, setAllDevices] = useState([]);
  const [activeDevices, setActiveDevices] = useState([]);
  const [offlineDevices, setOfflineDevices] = useState([]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${host}/devices`);
      const devices = response.data;
      setAllDevices(devices);
      setActiveDevices(devices.filter((device) => device.is_connected));
      setOfflineDevices(devices.filter((device) => !device.is_connected));
      setLoading(false);
    } catch (error) {
      console.error("Error while fetching devices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // initial fetch

    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchData(); // refresh every 10 seconds only if tab is active
      }
    }, 10000);

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

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
