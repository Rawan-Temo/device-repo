import { useContext, useEffect, useState } from "react";
import { Context } from "../../../context/context";
import { host, http } from "../../../serverConfig.json";
import axios from "axios";
import Loading from "../../../components/loader/Loading";

function Overview() {
  const [loading, setLoading] = useState(true);
  const [allDevices, setAllDevices] = useState([]);
  const [activeDevices, setActiveDevices] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const context = useContext(Context);
  const language = context?.selectedLang;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${http}/devices`);
        const dowload = await axios.get(`${http}/downloads/all`);

        setDownloads(dowload.data);
        const devices = response.data;
        console.log("Downloads:", devices);
        setAllDevices(devices);
        const activeDevice = devices.filter(
          (device) => device.is_connected === true
        );
        setActiveDevices(activeDevice);
        setLoading(false);
      } catch (error) {
        console.error("Error while fetching devices:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="main-content-2 relative pad-40">
      <div className="overview">
        <h2>{language?.overview?.overview}</h2>
        <div className="overview-content">
          <div className="overview-item">
            <i className="fa-solid fa-laptop"></i>
            <h3>{language?.overview?.devices_total}</h3>
            <p>{allDevices?.length}</p>
          </div>
          <div className="overview-item">
            <i className="fa-solid fa-wifi"></i>
            <h3>{language?.overview?.active_now}</h3>
            <p>{activeDevices?.length}</p>
          </div>
          <div className="overview-item">
            <i className="fa-solid fa-download"></i>
            <h3>{language?.overview?.download}</h3>
            <p>0</p>
          </div>
        </div>

        <h2>download</h2>
        <div className="overview-content">
          <div className="overview-item">
            <i className="fa-solid fa-laptop"></i>
            <h3>download task</h3>
            <p>0</p>
          </div>
          <div className="overview-item">
            <i className="fa-solid fa-wifi"></i>
            <h3>downloaded</h3>
            <p>{downloads?.total_downloads}</p>
          </div>
          <div className="overview-item">
            <i className="fa-solid fa-download"></i>
            <h3>in progress</h3>
            <p>{downloads?.in_progress}</p>
          </div>
        </div>

        <h2>{language?.overview?.server}</h2>
        <div className="overview-content">
          <div className="overview-item">
            <i className="fa-solid fa-laptop"></i>
            <h3>{language?.overview?.devices_total}</h3>
            <p>0</p>
          </div>
          <div className="overview-item">
            <i className="fa-solid fa-wifi"></i>
            <h3>{language?.overview?.active_now}</h3>
            <p>0</p>
          </div>
          <div className="overview-item">
            <i className="fa-solid fa-download"></i>
            <h3>{language?.overview?.download}</h3>
            <p>0</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Overview;
