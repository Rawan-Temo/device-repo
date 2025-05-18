import { useState, useEffect, useContext } from "react";

import EditDialog from "./callLog/EditCallLogDialog";
import AddDialog from "./callLog/AddCallLogDialog";
import { Context } from "../../../../context/context";

const CallLog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleString());
  const [filteredCallLog, setFilteredCallLog] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [callLogToEdit, setCallLogToEdit] = useState(null);
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

  // // Filter CallLog based on the search term
  // useEffect(() => {
  //   if (!searchTerm) {
  //     setFilteredCallLog(callLogList);
  //   } else {
  //     setFilteredCallLog(
  //       callLogList.filter((calllog) =>
  //         calllog.PhoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  //       )
  //     );
  //   }
  // }, [searchTerm, callLogList]);

  // // Fetch CallLog from API
  // const handleReload = async () => {
  //   try {
  //     setError("");
  //     setLoading(true);
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     const response = await getCallLog(deviceId);
  //     if (response) {
  //       setCallLogList(response);
  //     } else {
  //       setError("you dont have permission.");
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     setError("Failed to fetch CallLog. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // // Toggle table expansion
  // const toggleExpand = () => {
  //   setExpanded(!expanded);
  // };

  // // Open edit dialog for the selected CallLog
  // const handleEdit = (id) => {
  //   const calllog = callLogList.find((c) => c.ID === id);
  //   if (calllog) {
  //     setCallLogToEdit(calllog);
  //     if (callLogToEdit) setEditDialogOpen(true);
  //   }
  // };

  // // Save updated contact data
  // const handleEditSave = async (updatedCallLog) => {
  //   try {
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     setLoading(true);
  //     const response = await updateCallLog(
  //       deviceId,
  //       updatedCallLog.ID,
  //       updatedCallLog.PhoneNumber,
  //       updatedCallLog.Type,
  //       updatedCallLog.Date,
  //       updatedCallLog.Duration
  //     );
  //     if (response) {
  //       setTimeout(() => {
  //         handleReload();
  //       }, 5000);
  //     }
  //     setEditDialogOpen(false);
  //     setCallLogToEdit(null);
  //   } catch (error) {
  //     setError("Failed to update Call Log. Please try again.");
  //   } finally {
  //     setLoading(false);
  //     setCallLogToEdit(null);
  //   }
  // };

  // const handleSaveNew = async (newCallLog) => {
  //   try {
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     setLoading(true);
  //     const response = await addCallLog(
  //       deviceId,
  //       newCallLog.PhoneNumber,
  //       newCallLog.Type,
  //       newCallLog.Date,
  //       newCallLog.Duration
  //     );

  //     if (response) {
  //       setTimeout(() => {
  //         handleReload();
  //       }, 5000);
  //     }
  //     setAddDialogOpen(false);
  //   } catch (error) {
  //     setError("Failed to update Call Log. Please try again.");
  //     setLoading(false);
  //   }
  // };

  // // Delete call log from the list
  // const handleDelete = (id) => {
  //   if (!deviceStatusOnline) {
  //     setError("device is offline.");
  //     setLoading(false);
  //     return;
  //   }
  //   if (window.confirm("Are you sure you want to delete this call log?")) {
  //     const response = deleteCallLog(deviceId, id);
  //     if (response) {
  //       setCallLogList((prev) => prev.filter((c) => c.ID !== id));
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
      {loading && <div>Loading...</div>}
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

      {/* Display call log in a table */}
      {expanded && (
        <div className="table">
          <table className="">
            <thead>
              <tr>
                <th>{language?.devices?.id}</th>
                <th>{language?.devices?.PhoneNumber}</th>
                <th>{language?.devices?.type}</th>
                <th>{language?.devices?.date}</th>
                <th>{language?.devices?.call_duration}</th>
                <th>{language?.devices?.operation}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCallLog.length > 0 ? (
                filteredCallLog.map((calllog) => (
                  <tr key={calllog.ID}>
                    <td>{calllog.ID}</td>
                    <td>{calllog.PhoneNumber}</td>
                    <td>{calllog.Type}</td>
                    <td>{calllog.Date}</td>
                    <td>{calllog.Duration}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button className="edit-button">
                          {language?.devices?.edit}
                        </button>
                        <button className="delete-button">
                          {language?.devices?.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    {language?.devices?.no_call_found}
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
        callLog={callLogToEdit}
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

export default CallLog;
