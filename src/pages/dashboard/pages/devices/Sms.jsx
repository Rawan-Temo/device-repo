import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import EditDialog from "./sms/EditSmsDialog";
import AddDialog from "./sms/AddSmsDialog";
import { Context } from "../../../../context/context";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";
import { useParams } from "react-router";
import LiveClock from "./LiveClock";
import { useDevice } from "../../../../context/DeviceContext";
import Loading from "../../../../components/loader/Loading";

const Sms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [smsToEdit, setSmsToEdit] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [wsLoading, setWsLoading] = useState(false);

  const context = useContext(Context);
  const language = context?.selectedLang;
  const { socketRef } = useContext(WebSocketContext);
  const { id: deviceId } = useParams();
  const [openMessageContent, setOpenMessageContent] = useState(null);
  const { state, dispatch } = useDevice();

  const messageList = useMemo(
    () => state?.messageList || [],
    [state?.messageList]
  );

  const sendSmsWS = useCallback(
    ({ action, phone, message, id, message_type, date }) => {
      if (!socketRef?.current) return;
      setWsLoading(true);
      const msg = {
        token: localStorage.getItem("token"),
        uuid: deviceId,
        sms_operation: true,
        action,
      };
      if (phone) msg.phone = phone;
      if (message) msg.message = message;
      if (id) msg.sms_id = id;
      if (message_type) msg.message_type = message_type;
      if (date) msg.date = date;

      sendWebSocketMessage(socketRef.current, msg);
    },
    [socketRef, deviceId]
  );

  useEffect(() => {
    setWsLoading(true);
    sendSmsWS({ action: "get" });
  }, [deviceId, sendSmsWS]);

  useEffect(() => {
    setWsLoading(false);
    if (typeof messageList === "string") {
      setFilteredMessages([]);
    } else if (messageList.length > 0) {
      setFilteredMessages(
        messageList.filter(
          (sms) =>
            sms.Message &&
            sms.Message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredMessages([]);
    }
  }, [messageList, searchTerm]);

  const handleAddNew = (newSms) => {
    sendSmsWS({
      action: "add",
      phone: newSms.PhoneNumber,
      message: newSms.Message,
    });
    setAddDialogOpen(false);
  };

  const handleEditSave = (updatedSms) => {
    sendSmsWS({
      action: "update",
      id: updatedSms.ID,
      phone: updatedSms.PhoneNumber,
      message: updatedSms.Message,
      message_type: updatedSms.Type, // or "sent"
      date: updatedSms.Date, // or "sent"
    });
    //     "token": "your_jwt_token",
    // "uuid": "device_uuid",
    // "sms_operation": true,
    // "action": "send",  // "get", "add", "update", "delete"
    // "phone": "123456",
    // "message": "Hello!",
    // "message_type": "inbox",  // or "sent"
    // "date": "2025-05-25T10:00:00"
    setEditDialogOpen(false);
    setSmsToEdit(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      sendSmsWS({ action: "delete", id });
    }
  };

  const openMessage = (message) => {
    setOpenMessageContent(message);
  };
  return (
    <div className="tab-content">
      {loading && <Loading />}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {wsLoading && <Loading />}
      {openMessageContent && (
        <div
          className="message-popup-overlay"
          onClick={() => setOpenMessageContent(null)}
        >
          <div className="message-popup" onClick={(e) => e.stopPropagation()}>
            <h3>{language?.devices?.message_details}</h3>
            <p>{openMessageContent}</p>
            <button onClick={() => setOpenMessageContent(null)}>
              {language?.devices?.close}
            </button>
          </div>
        </div>
      )}
      <div className="table-header">
        <button
          className="reload-button"
          onClick={() => sendSmsWS({ action: "get" })}
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
                <th>{language?.devices?.message}</th>
                <th>{language?.devices?.date}</th>
                <th>{language?.devices?.operation}</th>
              </tr>
            </thead>
            <tbody>
              {typeof messageList === "string" ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {messageList}
                  </td>
                </tr>
              ) : filteredMessages.length > 0 ? (
                filteredMessages.map((sms) => (
                  <tr key={sms.ID}>
                    <td>{sms.ID}</td>
                    <td>{sms.PhoneNumber}</td>
                    <td
                      onClick={() => openMessage(sms.Message)}
                      style={{ cursor: "pointer" }}
                    >
                      {sms.Message}
                    </td>
                    <td>{sms.Date}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          className="edit-button"
                          onClick={() => {
                            setSmsToEdit(sms);
                            setEditDialogOpen(true);
                          }}
                        >
                          {language?.devices?.edit}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(sms.ID)}
                        >
                          {language?.devices?.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
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
        message={smsToEdit}
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

export default Sms;
