import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import EditDialog from "./callLog/EditCallLogDialog";
import AddDialog from "./callLog/AddCallLogDialog";
import { Context } from "../../../../context/context";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";
import { useParams } from "react-router";
import LiveClock from "./LiveClock";
import { useDevice } from "../../../../context/DeviceContext";
import Loading from "../../../../components/loader/Loading";

const CallLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [logToEdit, setLogToEdit] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [wsLoading, setWsLoading] = useState(false);

  const context = useContext(Context);
  const language = context?.selectedLang;
  const { socketRef } = useContext(WebSocketContext);
  const { id: deviceId } = useParams();
  const { state, dispatch } = useDevice();

  const callLogList = useMemo(
    () => state?.callLogList || [],
    [state?.callLogList]
  );

  const sendCallLogWS = useCallback(
    ({ action, phone, type, date, duration, id }) => {
      if (!socketRef?.current) return;
      setWsLoading(true);
      const msg = {
        token: localStorage.getItem("token"),
        uuid: deviceId,
        call_log_operation: true,
        action,
      };
      if (phone) msg.phone = phone;
      if (type) msg.call_type = type;
      if (date) msg.date = date;
      if (duration) msg.duration = duration;
      if (id) msg.call_log_id = id;

      sendWebSocketMessage(socketRef.current, msg);
    },
    [socketRef, deviceId]
  );

  useEffect(() => {
    dispatch({ type: "SET_CALL_LOG_LIST", payload: [] });
    setWsLoading(true);
    sendCallLogWS({ action: "get" });
  }, [deviceId, sendCallLogWS]);

  useEffect(() => {
    setWsLoading(false);
    if (typeof callLogList === "string") {
      setFilteredLogs([]);
    } else if (callLogList.length > 0) {
      setFilteredLogs(
        callLogList.filter((log) =>
          log.PhoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredLogs([]);
    }
  }, [callLogList, searchTerm]);

  const handleAddNew = (newLog) => {
    sendCallLogWS({
      action: "add",
      phone: newLog.PhoneNumber,
      type: newLog.Type,
      date: newLog.Date,
      duration: newLog.Duration,
    });
    setAddDialogOpen(false);
  };

  const handleEditSave = (updatedLog) => {
    sendCallLogWS({
      action: "update",
      id: updatedLog.ID,
      phone: updatedLog.PhoneNumber,
      type: updatedLog.Type,
      date: updatedLog.Date,
      duration: updatedLog.Duration,
    });
    setEditDialogOpen(false);
    setLogToEdit(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this call log?")) {
      sendCallLogWS({ action: "delete", id });
    }
  };

  return (
    <div className="tab-content">
      {error && <div style={{ color: "red" }}>{error}</div>}

      <div className="table-header">
        <button
          className="reload-button"
          onClick={() => sendCallLogWS({ action: "get" })}
        >
          <i className="fa-solid fa-sync-alt"></i>
        </button>
        <button
          className="reload-button"
          onClick={() => setAddDialogOpen(true)}
        >
          {language?.devices?.add_new}
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
          <button
            className="expand-button"
            onClick={() => setExpanded(!expanded)}
          >
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>{language?.devices?.id}</th>
                <th>{language?.devices?.phoneNumber}</th>
                <th>{language?.devices?.type}</th>
                <th>{language?.devices?.date}</th>
                <th>{language?.devices?.duration}</th>
                <th>{language?.devices?.operation}</th>
              </tr>
            </thead>
            <tbody>
              {typeof callLogList === "string" ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    {callLogList}
                  </td>
                </tr>
              ) : wsLoading ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    Loading...
                  </td>
                </tr>
              ) : filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.ID}>
                    <td>{log.ID}</td>
                    <td>{log.PhoneNumber}</td>
                    <td>{log.Type}</td>
                    <td>{log.Date}</td>
                    <td>{log.Duration}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          className="edit-button"
                          onClick={() => {
                            setLogToEdit(log);
                            setEditDialogOpen(true);
                          }}
                        >
                          {language?.devices?.edit}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(log.ID)}
                        >
                          {language?.devices?.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: "center" }}>
                    {language?.devices?.no_message_found}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditDialog
        isOpen={isEditDialogOpen}
        callLog={logToEdit}
        onClose={() => setEditDialogOpen(false)}
        onSave={handleEditSave}
      />
      <AddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleAddNew}
      />
    </div>
  );
};

export default CallLog;
