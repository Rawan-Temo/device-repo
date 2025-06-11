import { useContext, useEffect, useState } from "react";
import "./DownloadsDialog.css";
import { use } from "react";

import { set } from "date-fns";
import { Context } from "../../../../../context/context";
import { useDevice } from "../../../../../context/DeviceContext";
import { WebSocketContext } from "../../../../../context/WebSocketProvider";

const DownloadsDoalog = ({ isOpen, id, onClose }) => {
  const [downloadsList, SetDownloadsList] = useState([]);
  const [filteredTabs, setFilteredTabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const context = useContext(Context);
  const language = context?.selectedLang;
  const { state, dispatch } = useDevice();
  const { socketRef } = useContext(WebSocketContext);
  useEffect(() => {
    SetDownloadsList(state?.downloadList.downloads || []);
  }, [state?.downloadList]);

  useEffect(() => {
    // Send a WebSocket message to get the initial downloads list when dialog opens
    console.log("Opening Downloads Dialog for device:", {
      token: localStorage.getItem("token"),
      uuid: id,
      get_download_list: true,
    });
    if (isOpen && socketRef?.current) {
      socketRef.current.send(
        JSON.stringify({
          token: localStorage.getItem("token"),
          uuid: id,
          get_download_list: true,
        })
      );
      console.log("WebSocket message sent to get downloads list.");
    }
  }, [isOpen, id, socketRef]);

  // useEffect(() => {
  //   const autoFetchData = async () => {
  //     if (isOpen) {
  //       fetchData();
  //     }
  //   };

  //   autoFetchData(); // Fetch immediately
  //   const intervalId = setInterval(autoFetchData, 1000); // Refresh every 10s

  //   return () => clearInterval(intervalId);
  // }, [isOpen]);

  // const fetchData = async () => {
  //   setLoading(true);
  //   const data = await getDownloadProcess(id);
  //   SetDownloadsList(data.reverse()); // Reverses the order
  //   setLoading(false);
  // };

  // const handleClear = async () => {
  //   try {
  //     setLoading(true);
  //     const response = await clearDownloadProcess(id);
  //     if (response) {
  //       setTimeout(() => {
  //         fetchData();
  //       }, 3000);
  //     }
  //   } catch (error) {
  //     console.error("Error while requesting clear process:", error);
  //   }
  // };

  if (!isOpen) return null;
  const onStopDownload = (path) => {
    if (socketRef?.current) {
      console.log({
        token: localStorage.getItem("token"),
        uuid: id,
        file_operation: true,
        action: "cancel", // "move", "copy", "delete_file", "delete_folder", "download"
        path: `${path}`,
        dest: `${path}`, // if needed
      });
      socketRef.current.send(
        JSON.stringify({
          token: localStorage.getItem("token"),
          uuid: id,
          file_operation: true,
          action: "cancel", // "move", "copy", "delete_file", "delete_folder", "download"
          path: `${path}`,
          dest: `/sdcard`, // if needed
        })
      );
      console.log("WebSocket message sent to stop download for path:", path);
    } else {
      console.warn("WebSocket is not available.");
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="downloads-dialog">
        <h2>{language?.devices?.download_list}</h2>

        {/* {loading && <div>{language?.devices?.loading}</div>} */}
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="table-header">
          <button className="reload-button">
            <i className="fa-solid fa-sync-alt"></i>
          </button>
          <button className="reload-button">
            <i className="fa-solid fa-broom"></i>
          </button>
          <input
            type="text"
            className="search-field"
            placeholder={language?.devices?.search_in_tabs}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={onClose} className="btn">
            <i className="fa-solid fa-close"></i>
          </button>
        </div>
        <div className="table">
          <div className="table">
            <table className="">
              <thead>
                <tr>
                  <th>file name</th>
                  <th>Progress</th>
                  <th>percenatge</th>
                  <th>total size</th>
                  <th>{language?.devices?.downloaded_date}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {downloadsList?.length > 0 ? (
                  downloadsList.map((item) => {
                    const fileName = item.file_name.split("/").pop();

                    let recivedPercentage =
                      (item.received_size * 100) / item.total_size;
                    return (
                      <tr key={item.id}>
                        <td>{fileName}</td>
                        <td style={{ width: "220px" }}>
                          <div
                            style={{
                              width: "100%",
                              backgroundColor: "#ddd",
                              borderRadius: "5px",
                            }}
                          >
                            <div
                              style={{
                                width: `${
                                  item.progress === -1
                                    ? recivedPercentage
                                    : item.progress
                                }%`,
                                backgroundColor:
                                  item.progress === -1
                                    ? "rgb(127 12 12)"
                                    : item.progress === 100
                                    ? "#4caf50"
                                    : "#2196f3",
                                height: "10px",
                                borderRadius: "5px",
                                transition: "width 0.5s ease",
                              }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          {item.progress === -1
                            ? `cancelled`
                            : item.progress === 100
                            ? 100
                            : Math.round(item.progress)}
                          {!(item.progress === -1) && `%`}
                        </td>
                        <td>
                          {item.total_size >= 1024 * 1024 * 1024
                            ? `${(
                                item.total_size /
                                (1024 * 1024 * 1024)
                              ).toFixed(2)} GB`
                            : `${Math.ceil(
                                item.total_size / (1024 * 1024)
                              )} MB`}
                        </td>
                        <td>{item.created_at}</td>
                        <td>
                          {" "}
                          <button
                            onClick={() => onStopDownload(item.file_name)}
                            className="btn red"
                          >
                            <i className="fa-solid fa-close"></i>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="6" style={{ textAlign: "center" }}>
                      {language?.devices?.no_task_found}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DownloadsDoalog;
