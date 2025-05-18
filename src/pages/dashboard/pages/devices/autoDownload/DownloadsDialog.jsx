import { useContext, useEffect, useState } from "react";
import "./DownloadsDialog.css";
import { use } from "react";

import { set } from "date-fns";
import { Context } from "../../../../../context/context";

const DownloadsDoalog = ({ isOpen, id, onClose }) => {
  const [downloadsList, SetDownloadsList] = useState([]);
  const [filteredTabs, setFilteredTabs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const context = useContext(Context);
  const language = context?.selectedLang;

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
          <button  className="reload-button">
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
                </tr>
              </thead>
              <tbody>
                {downloadsList?.length > 0 ? (
                  downloadsList.map((item) => {
                    return (
                      <tr key={item.id}>
                        <td>{item.file_name}</td>
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
                                width: `${item.progress}%`,
                                backgroundColor:
                                  item.progress === 100 ? "#4caf50" : "#2196f3",
                                height: "10px",
                                borderRadius: "5px",
                                transition: "width 0.5s ease",
                              }}
                            ></div>
                          </div>
                        </td>
                        <td>
                          {item.progress === 100
                            ? 100
                            : Math.round(item.progress)}
                          %
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
