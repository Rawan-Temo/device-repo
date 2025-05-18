import { useState, useEffect, useContext } from "react";
import EditDialog from "./contacts/EditContactDialog";
import AddDialog from "./contacts/AddContactDialog";
import { Context } from "../../../../context/context";
import LiveClock from "./LiveClock";

const Contacts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [contactToEdit, setContactToEdit] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);

  const context = useContext(Context);
  const language = context?.selectedLang;

  // // Fetch contacts from API
  // const handleReload = async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await getContacts(deviceId);
  //     if (response) {
  //       setContactList(response.contactList);
  //     } else {
  //       setError("You don't have permission.");
  //     }
  //   } catch (error) {
  //     setError("Failed to fetch contacts. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // // Initial fetch
  // useEffect(() => {
  //   handleReload();
  // }, []);

  // // Filter contacts based on search term
  // useEffect(() => {
  //   const filtered = contactList.filter((contact) =>
  //     contact.Name.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  //   setFilteredContacts(filtered);
  // }, [searchTerm, contactList]);

  // const toggleExpand = () => setExpanded(!expanded);

  // const handleEdit = (id) => {
  //   const contact = contactList.find((c) => c.ID === id);
  //   if (contact) {
  //     setContactToEdit(contact);
  //     setEditDialogOpen(true);
  //   }
  // };

  // const handleEditSave = async (updatedContact) => {
  //   try {
  //     if (!deviceStatusOnline) return setError("Device is offline.");
  //     setLoading(true);
  //     const response = await updateContact(
  //       deviceId,
  //       updatedContact.ID,
  //       updatedContact.Name,
  //       updatedContact.Phone
  //     );
  //     if (response) setTimeout(() => handleReload(), 5000);
  //     setEditDialogOpen(false);
  //     setContactToEdit(null);
  //   } catch (error) {
  //     setError("Failed to update contact. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleSaveNew = async (newContact) => {
  //   try {
  //     if (!deviceStatusOnline) return setError("Device is offline.");
  //     setLoading(true);
  //     const response = await addContact(
  //       deviceId,
  //       newContact.Name,
  //       newContact.Phone
  //     );
  //     if (response) setTimeout(() => handleReload(), 5000);
  //     setAddDialogOpen(false);
  //   } catch (error) {
  //     setError("Failed to add contact. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDelete = (id) => {
  //   if (!deviceStatusOnline) return setError("Device is offline.");
  //   if (window.confirm("Are you sure you want to delete this contact?")) {
  //     setContactList((prev) => prev.filter((c) => c.ID !== id));
  //   }
  // };

  // const handleAddNew = () => setAddDialogOpen(true);

  return (
    <div className="tab-content">
      {loading && <div>{language?.devices?.loading || "Loading..."}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

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
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact) => (
                  <tr>
                    <td>{contact.ID}</td>
                    <td>{contact.Name}</td>
                    <td>{contact.Phone}</td>
                    <td>{contact.AddedDate}</td>
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

export default Contacts;
