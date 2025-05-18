import { useState, useEffect, useContext } from "react";
import { Context } from "../../../../context/context";

const Notification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [filteredNotification, setFilteredNotification] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const context = useContext(Context);
  const language = context?.selectedLang;
  // // Update current time every second
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleString());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // // Filter Notifications based on the search term
  // useEffect(() => {
  //   if (!searchTerm) {
  //     setFilteredNotification(notificationList);
  //   } else {
  //     setFilteredNotification(
  //       notificationList.filter((notification) =>
  //         notification.text.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // }, [searchTerm, notificationList]);

  // // Fetch Notification from API
  // const handleReload = async () => {
  //   try {
  //     setError("");
  //     setLoading(true);
  //     const response = await getNotifications(deviceId);
  //     if (response) {
  //       setNotificationList(response);
  //     } else {
  //       setError("you dont have permission.");
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setError("Failed to fetch Notifications. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // Toggle table expansion
  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="tab-content">
      {/* Display loading or error message */}
      {loading && <div> {language?.devices?.loading}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Header with search and reload */}
      <div className="table-header">
        <button className="reload-button">
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
          <button onClick={toggleExpand} className="expand-button">
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      </div>

      {/* Table */}
      {expanded && (
        <div className="table">
          <table className="">
            <thead>
              <tr>
                <th>{language?.devices?.app_name}</th>
                <th>{language?.devices?.title}</th>
                <th>{language?.devices?.text}</th>
              </tr>
            </thead>
            <tbody>
              {filteredNotification.length > 0 ? (
                filteredNotification.map((notification) => (
                  <tr key={notification.id}>
                    <td>{notification.appName}</td>
                    <td>{notification.title}</td>
                    <td>{notification.text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {language?.devices?.no_notification_found}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Notification;
