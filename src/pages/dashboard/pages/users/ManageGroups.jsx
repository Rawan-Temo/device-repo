import React, { useState, useEffect, useContext } from "react";
import "./Manage.css";

import { Context } from "../../../../context/context";
import {
  getAllGroups,
  createGroup,
  deleteGroup,
  getDevicesByGroup,
  removeUserFromGroup,
  AllUsersWithGroups,
  updateGroup,
} from "../../../../apiService";
import Loading from "../../../../components/loader/Loading";

function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState();
  const [showEditGroup, setShowEditGroup] = useState(false);
  const [editedGroupAdmin, setEditedGroupAdmin] = useState();
  const [editAdmin, setEditAdmin] = useState();
  const [mainLoading, setMainLoading] = useState(false);
  const context = useContext(Context);
  const language = context?.selectedLang;
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setMainLoading(true);
    try {
      const response = await getAllGroups();
      setGroups(response);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
    setMainLoading(false);
  };

  const openCreateGroupPopup = async () => {
    setShowCreateGroup(true);
    try {
      const users = await AllUsersWithGroups();


      setAllUsers(users);
    } catch (error) {
      setAllUsers([]);
    }
  };

  const closeCreateGroupPopup = () => {
    setShowCreateGroup(false);
    setGroupName("");
    setSelectedUser();
  };

  const handleUserSelect = (e) => {
    const value = e.target.value;
    setSelectedUser(value);
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Group name is required!");
      return;
    }
    if (!selectedUser) {
      alert("Please select at least one user for the group.");
      return;
    }
    try {
      await createGroup({ name: groupName, admin: selectedUser });
      setGroupName("");
      setSelectedUser();
      setShowCreateGroup(false);
      fetchGroups();
    } catch (error) {
      alert(error.response?.data?.admin[0]);
    }
  };

  const handleEdit = async (group) => {
    setEditingGroup(group);
    setGroupName(group.name);

    setEditAdmin(group.admin || "");
    setEditedGroupAdmin(group.admin_name || "");
    setShowEditGroup(true);
    try {
      const users = await AllUsersWithGroups();
      setAllUsers(users);
    } catch (error) {
      setAllUsers([]);
    }
  };

  const closeEditGroupPopup = () => {
    setShowEditGroup(false);
    setEditingGroup(null);
    setGroupName("");
    setEditAdmin("");
  };

  const handleEditGroupSave = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      alert("Group name is required!");
      return;
    }
    if (!editAdmin) {
      alert("Please select an admin for the group.");
      return;
    }
    try {
      await updateGroup(editingGroup.id, { name: groupName, admin: editAdmin });
      setShowEditGroup(false);
      setEditingGroup(null);
      setGroupName("");
      setEditAdmin("");
      fetchGroups();
    } catch (error) {
      alert("Error updating group.");
    }
  };

  const handleDelete = async (groupId) => {
    if (!window.confirm("Are you sure you want to delete this group?")) return;
    try {
      await deleteGroup(groupId);
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  const toggleUserList = async (groupId) => {
    // If already open, close it and clear the user list
    if (selectedGroupUsers[groupId]) {
      setSelectedGroupUsers({});
      return;
    }
    setLoadingUsers(true);
    // Clear all user lists before fetching new one
    setSelectedGroupUsers({});
    try {
      const users = await getDevicesByGroup(groupId);
      setSelectedGroupUsers({ [groupId]: users });
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoadingUsers(false);
  };

  const handleRemoveUser = async (userId, groupId) => {
    if (!window.confirm("Are you sure you want to remove this user?")) return;
    try {
      await removeUserFromGroup(groupId, userId);
      toggleUserList(groupId);
      fetchGroups();
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  return (
    <div className="tabel-container">
      {mainLoading && <Loading />}
      <div className="flex center gap">
        <h2 className="title"> {language?.users?.manage_groups}</h2>
        <button className="btn" onClick={openCreateGroupPopup}>
          {language?.users?.create_group}
        </button>
      </div>
      {showCreateGroup && (
        <div className="edit add-user-form">
          <form className="edit-user-form" onSubmit={handleCreateGroup}>
            <h2>{language?.users?.create_group}</h2>
            <div>
              <label>Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Select Users</label>
              <div className="selecte">

                <select
                  name="admin"
                  value={selectedUser || ""}
                  onChange={(e) => {
                    setSelectedUser(e.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Select a user
                  </option>
                  {allUsers.length === 0 ? (
                    <option disabled>No users found.</option>
                  ) : (
                    allUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))
                  )}
                </select>
              </div>
            </div>
            <div className="edit-user-actions">
              <button type="submit" className="btn">
                Create
              </button>
              <button
                type="button"
                className="btn cancel"
                onClick={closeCreateGroupPopup}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {showEditGroup && (
        <div className="edit add-user-form">
          <form className="edit-user-form" onSubmit={handleEditGroupSave}>
            <h2>Edit Group</h2>
            <div>
              <label>Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Select Admin</label>
              <div className="selecte">
                <select
                  name="admin"
                  value={editAdmin || ""}
                  onChange={(e) => setEditAdmin(e.target.value)}
                >
                  <option value={editingGroup.admin}>
                    {editingGroup.admin_name} (current)
                  </option>

                  {allUsers
                    .filter((user) => user.id !== editingGroup.admin)
                    .map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="edit-user-actions">
              <button type="submit" className="btn">
                Save
              </button>
              <button
                type="button"
                className="btn cancel"
                onClick={closeEditGroupPopup}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table">
        <table>
          <thead>
            <tr>
              <th> {language?.users?.id}</th>
              <th> {language?.users?.group_name}</th>
              <th> admin</th>
              <th>{language?.users?.Operations}</th>
            </tr>
          </thead>
          <tbody>
            {groups.length > 0 ? (
              groups.map((group) => (
                <React.Fragment key={group.id}>
                  <tr>
                    <td>{group.id}</td>
                    <td>{group.name}</td>
                    <td>{group.admin_name}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          onClick={() => handleEdit(group)}
                          className="edit-button"
                        >
                          {language?.users?.Edit}
                        </button>
                        <button
                          onClick={() => handleDelete(group.id)}
                          className="delete-button"
                        >
                          {language?.users?.delete}
                        </button>
                        <button
                          onClick={() => toggleUserList(group.id)}
                          disabled={group.userCount === 0}
                          className="view-users-button btn"
                        >
                          {selectedGroupUsers[group.id]
                            ? "hide devices"
                            : "view devices"}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* Users List Inside Group */}
                  {selectedGroupUsers[group.id] && (
                    <tr className="user-list-row">
                      <td colSpan="4">
                        <div className="user-list">
                          {loadingUsers ? (
                            <p>{language?.devices?.loading}</p>
                          ) : selectedGroupUsers[group.id].length > 0 ? (
                            <ul>
                              {selectedGroupUsers[group.id].map((user) => (
                                <li key={user.id}>
                                  {user.name} ({user.email})
                                  <button
                                    onClick={() =>
                                      handleRemoveUser(user.id, group.id)
                                    }
                                    className="delete-button"
                                  >
                                    {language?.devices?.delete}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p> {language?.users?.no_users}</p>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  {language?.users?.no_groups_found} or there are no unlinked
                  users.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageGroups;
