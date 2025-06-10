import { useState, useEffect, useContext, useMemo, useCallback } from "react";
import EditDialog from "./contacts/EditContactDialog";
import AddDialog from "./contacts/AddContactDialog";
import { Context } from "../../../../context/context";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";
import { useParams } from "react-router";
import LiveClock from "./LiveClock";
import { useDevice } from "../../../../context/DeviceContext";
import Loading from "../../../../components/loader/Loading";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [wsLoading, setWsLoading] = useState(false);

  const context = useContext(Context);
  const language = context?.selectedLang;
  const { socketRef } = useContext(WebSocketContext);
  const { id: deviceId } = useParams();

  // Listen for contact-list updates from global state
  const { state, dispatch } = useDevice();

  const contactList = useMemo(
    () => state?.contactList || [],
    [state?.contactList]
  );
  const sendContactWS = useCallback(
    ({ action, name, phone, id }) => {
      if (!socketRef?.current) return;
      setWsLoading(true);
      const msg = {
        token: localStorage.getItem("token"),
        uuid: deviceId,
        contact_operation: true,
        action,
      };
      if (name) msg.name = name;
      if (phone) msg.phone = phone;
      if (id) msg.id = id;
      sendWebSocketMessage(socketRef.current, msg);
    },
    [socketRef, deviceId]
  );

  // Initial fetch
  useEffect(() => {
    setWsLoading(true);
    sendContactWS({ action: "get" });
  }, [deviceId, sendContactWS]);

  // When contactList or searchTerm updates, stop loading and filter
  useEffect(() => {
    setWsLoading(false);
    // If contactList is a string (e.g. permission error), show no contacts
    if (typeof contactList === "string") {
      setFilteredContacts([]);
    } else if (contactList.length > 0) {
      setFilteredContacts(
        contactList.filter(
          (contact) =>
            contact.Name &&
            contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredContacts([]);
    }
  }, [contactList, searchTerm]);

  const handleAddNew = (newContact) => {
    sendContactWS({
      action: "add",
      name: newContact.Name,
      phone: newContact.Phone,
    });
    setAddDialogOpen(false);
  };

  const handleEditSave = (updatedContact) => {
    sendContactWS({
      action: "update",
      id: updatedContact.ID,
      name: updatedContact.Name,
      phone: updatedContact.Phone,
    });
    setEditDialogOpen(false);
    setContactToEdit(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      sendContactWS({ action: "delete", id });
    }
  };

  return (
    <div className="tab-content">
      {loading && (
        <div>
          <Loading />
        </div>
      )}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {wsLoading && (
        <div>
          <Loading />
        </div>
      )}

      <div className="table-header">
        <button
          className="reload-button"
          onClick={() => sendContactWS({ action: "get" })}
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
          <button className="expand-button">
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
                <th>{language?.devices?.name}</th>
                <th>{language?.devices?.phone}</th>
                <th>{language?.devices?.added_date}</th>
                <th>{language?.devices?.operation}</th>
              </tr>
            </thead>

            <tbody>
              {typeof contactList === "string" ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {contactList}
                  </td>
                </tr>
              ) : filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr>
                    <td>{contact.ID}</td>
                    <td>{contact.Name}</td>
                    <td>{contact.Phone}</td>
                    <td>{contact.AddedDate}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          className="edit-button"
                          onClick={() => {
                            setContactToEdit(contact);
                            setEditDialogOpen(true);
                          }}
                        >
                          {language?.devices?.edit}
                        </button>
                        <button
                          className="delete-button"
                          onClick={() => handleDelete(contact.ID)}
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
                    {language?.devices?.no_contact_found}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <EditDialog
        isOpen={isEditDialogOpen}
        contact={contactToEdit}
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

export default Contacts;
