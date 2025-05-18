import { useState, useEffect, useContext } from "react";
import EditDialog from "./sms/EditSmsDialog";
import AddDialog from "./sms/AddSmsDialog";
import { Context } from "../../../../context/context";

const Sms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [filteredMessages, setFilteredMessages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [smsToEdit, setSmsToEdit] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const context = useContext(Context);

  const language = context?.selectedLang;
  // // Update current time every second
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleString());
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  // // Filter Messages based on the search term
  // useEffect(() => {
  //   if (!searchTerm) {
  //     setFilteredMessages(messageList);
  //   } else {
  //     setFilteredMessages(
  //       messageList.filter((message) =>
  //         message.Message.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // }, [searchTerm, messageList]);

  // // Fetch Messages from API
  // const handleReload = async () => {
  //   try {
  //     setError("");
  //     setLoading(true);
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     const response = await getSms(deviceId);
  //     if (response) {
  //       setMessageList(response);
  //     } else {
  //       setError("you dont have permission.");
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setError("Failed to fetch messages. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // // Toggle table expansion
  // const toggleExpand = () => {
  //   setExpanded(!expanded);
  // };

  // // Open edit dialog for the selected Message
  // const handleEdit = (id) => {
  //   const message = messageList.find((c) => c.ID === id);
  //   if (message) {
  //     setSmsToEdit(message);
  //     setEditDialogOpen(true);
  //   }
  // };

  // // Save updated contact data
  // const handleEditSave = async (updatedMessage) => {
  //   try {
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     setLoading(true);
  //     const response = await updateSms(
  //       deviceId,
  //       updatedMessage.ID,
  //       updatedMessage.PhoneNumber,
  //       updatedMessage.Message,
  //       updatedMessage.Date
  //     );
  //     if (response) {
  //       setTimeout(() => {
  //         handleReload();
  //       }, 5000);
  //     }
  //     setEditDialogOpen(false);
  //     setSmsToEdit(null);
  //   } catch (error) {
  //     setError("Failed to update message. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // const handleSaveNew = async (newMessage) => {
  //   try {
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     setLoading(true);
  //     const response = await addSms(
  //       deviceId,
  //       newMessage.PhoneNumber,
  //       newMessage.Message,
  //       newMessage.Date,
  //       newMessage.Type
  //     );
  //     if (response) {
  //       setTimeout(() => {
  //         handleReload();
  //       }, 5000);
  //     }
  //     setAddDialogOpen(false);
  //   } catch (error) {
  //     setError("Failed to update sms. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // // Delete sms from the list
  // const handleDelete = (id) => {
  //   if (!deviceStatusOnline) {
  //     setError("device is offline.");
  //     setLoading(false);
  //     return;
  //   }
  //   if (window.confirm("Are you sure you want to delete this message?")) {
  //     const response = deleteSms(deviceId, id);
  //     if (response) {
  //       setMessageList((prev) => prev.filter((c) => c.ID !== id));
  //       setTimeout(() => {
  //         handleReload();
  //       }, 5000);
  //     }
  //   }
  // };
  // // Open add dialog
  // const handleAddNew = () => {
  //   setAddDialogOpen(true);
  // };

  return (
    <div className="tab-content">
      {/* Display loading or error message */}
      {loading && <div>{language?.devices?.loading}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {/* Header with search and reload */}
      <div className="table-header">
        <button className="reload-button">
          <i className="fa-solid fa-sync-alt"></i>
        </button>
        <button className="reload-button">{language?.devices?.add_new}</button>
        <input
          type="text"
          className="search-field"
          placeholder={language?.devices?.search_in_tabs}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="date-timer flex">
          <p>{currentTime}</p>
          <button className="expand-button">
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      </div>

      {/* Display messages in a table */}
      {expanded && (
        <div className="table">
          <table className="">
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
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <tr key={message.ID}>
                    <td>{message.ID}</td>
                    <td>{message.PhoneNumber}</td>
                    <td>{message.Message}</td>
                    <td>{message.Date}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          // onClick={() => handleEdit(message.ID)}
                          className="edit-button"
                        >
                          {language?.devices?.edit}
                        </button>
                        <button
                          // onClick={() => handleDelete(message.ID)}
                          className="delete-button"
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

      {/* Edit Dialog */}
      <EditDialog
        isOpen={isEditDialogOpen}
        contact={smsToEdit}
        onClose={() => setEditDialogOpen(false)}
        // onSave={handleEditSave}
      />
      <AddDialog
        isOpen={isAddDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        // onSave={handleSaveNew}
      />
    </div>
  );
};

export default Sms;
