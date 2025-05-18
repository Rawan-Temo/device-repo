import { useState, useEffect, useContext } from "react";
import { useDevice } from "./DeviceContext";
import DownloadsDoalog from "./autoDownload/DownloadsDialog";
import { Context } from "../../../../context/context";

const AutoDownloadTasks = ({ isOpen, folderPath, onClose, onSave }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [filteredTabs, setFilteredTabs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isDownloadingDialogOpen, setIsDownloadingDialogOpen] = useState(false);

  const { deviceId } = useDevice();
  const { autodownloadtasks, setAutoDownloadTasks } = useDevice();
  const context = useContext(Context);
  const language = context?.selectedLang;
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setFilteredTabs(
      autodownloadtasks.filter((log) =>
        log.path.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, autodownloadtasks]);

  // const handleReload = async (id) => {
  //   try {
  //     setLoading(true);
  //     const response = await getAutoDownloadTasks(id);
  //     if (response !== null) {
  //       setAutoDownloadTasks(response);
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error while requesting autoDownload Tasks:", error);
  //   }
  // };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // const handleRequest = async (id) => {
  //   try {
  //     if (window.confirm("Are you sure you want to Stop this process?")) {
  //       const response = await cancelAutoDownloadTask(id);
  //       if (response) {
  //         if (response) {
  //           setTimeout(() => {
  //             handleReload(deviceId);
  //           }, 3000);
  //         }
  //       }
  //     } else {
  //       console.error(`Failed to request cancellation`);
  //       setLoading(false);
  //     }
  //   } catch (error) {
  //     console.error("Error while requesting cancellation:", error);
  //   }
  // };

  const handleOpenDownloads = () => {
    setIsDownloadingDialogOpen(true);
  };

  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="tab-content dialog width-800">
        {loading && <div>{language?.devices?.loading}</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="table-header">
          <button /* onClick={() => handleReload(deviceId)}*/ className="btn">
            <i className="fa-solid fa-sync-alt"></i>
          </button>

          <input
            type="text"
            className="search-field"
            placeholder={language?.devices?.search_in_tabs}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="date-timer flex">
            <p>{currentTime}</p>
            <button onClick={toggleExpand} className="btn">
              <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
            </button>
            <button onClick={onClose} className="btn">
              <i className="fa-solid fa-close"></i>
            </button>
          </div>
        </div>
        {expanded && (
          <div className="table">
            <table className="">
              <thead>
                <tr>
                  <th>{language?.devices?.path}</th>
                  <th>{language?.devices?.interval}</th>
                  <th>{language?.devices?.interval_type}</th>
                  <th>{language?.devices?.created}</th>
                  <th>{language?.devices?.schedual}</th>
                  <th>{language?.devices?.operation}</th>
                </tr>
              </thead>
              <tbody>
                {filteredTabs.length > 0 ? (
                  filteredTabs.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.path}</td>
                        <td>{item.interval}</td>
                        <td>{item.intervalType}</td>
                        <td>{item.createdDate}</td>
                        <td>{item.schedualUpdate}</td>
                        <td>
                          <button
                            /* onClick={() => handleRequest(item.id)}*/
                            className="delete-button"
                          >
                            {language?.devices?.stop}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      {language?.devices?.no_task_found}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        <DownloadsDoalog
          isOpen={isDownloadingDialogOpen}
          id={deviceId}
          onClose={() => setIsDownloadingDialogOpen(false)}
        />
      </div>
    </div>
  );
};

export default AutoDownloadTasks;
