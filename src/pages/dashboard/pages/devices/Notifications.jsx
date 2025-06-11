import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import { Context } from "../../../../context/context";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";
import { useParams } from "react-router";
import LiveClock from "./LiveClock";
import { useDevice } from "../../../../context/DeviceContext";
import Loading from "../../../../components/loader/Loading";

const Notification = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [filteredNotification, setFilteredNotification] = useState([]);
  const [wsLoading, setWsLoading] = useState(false);

  const context = useContext(Context);
  const language = context?.selectedLang;
  const { socketRef } = useContext(WebSocketContext);
  const { id: deviceId } = useParams();
  const { state, dispatch } = useDevice();

  const notificationList = useMemo(
    () => state?.notificationList || [],
    [state?.notificationList]
  );

  const sendNotificationWS = useCallback(
    ({ action }) => {
      if (!socketRef?.current) return;
      setWsLoading(true);
      const msg = {
        token: localStorage.getItem("token"),
        uuid: deviceId,
        notification_operation: true,
      };
      sendWebSocketMessage(socketRef.current, msg);
    },
    [socketRef, deviceId]
  );

  useEffect(() => {
    dispatch({ type: "SET_NOTIFICATIONS", payload: [] });
    sendNotificationWS({ action: "get" });
  }, [deviceId, sendNotificationWS]);

  useEffect(() => {
    setWsLoading(false);
    if (typeof notificationList === "string") {
      setFilteredNotification([]);
    } else if (notificationList.length > 0) {
      setFilteredNotification(
        notificationList.filter(
          (notif) =>
            (notif.text &&
              notif.text.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (notif.title &&
              notif.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (notif.appName &&
              notif.appName.toLowerCase().includes(searchTerm.toLowerCase()))
        )
      );
    } else {
      setFilteredNotification([]);
    }
  }, [notificationList, searchTerm]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="tab-content">
      <div className="table-header">
        <button
          className="reload-button"
          onClick={() => sendNotificationWS({ action: "get" })}
        >
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
          <p>
            <LiveClock />
          </p>
          <button onClick={toggleExpand} className="expand-button">
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>{language?.devices?.app_name}</th>
                <th>{language?.devices?.title}</th>
                <th>{language?.devices?.text}</th>
              </tr>
            </thead>
            <tbody>
              {typeof notificationList === "string" ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    {notificationList}
                  </td>
                </tr>
              ) : wsLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredNotification.length > 0 ? (
                filteredNotification.map((notif) => (
                  <tr key={notif.id}>
                    <td>{notif.appName}</td>
                    <td>{notif.title}</td>
                    <td>{notif.text}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center" }}>
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
