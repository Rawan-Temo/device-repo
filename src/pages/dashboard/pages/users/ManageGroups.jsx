import React, { useState, useEffect, useContext } from "react";
import "./Manage.css";

import { Context } from "../../../../context/context";
import { deleteGroup, getAllGroups, getDevicesByGroup, removeUserFromGroup } from "../../../../apiService";

function ManageGroups() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [editingGroup, setEditingGroup] = useState(null);
  const [selectedGroupUsers, setSelectedGroupUsers] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);
  const context = useContext(Context);
  const language = context?.selectedLang;
  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await getAllGroups();
      console.log("Fetched groups:", response);
      setGroups(response);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!groupName.trim()) {
  //     alert("Group name is required!");
  //     return;
  //   }
  //   try {
  //     if (editingGroup) {
  //       await updateGroup(editingGroup.id, groupName);
  //     } else {
  //       await createGroup(groupName);
  //     }
  //     setGroupName("");
  //     setEditingGroup(null);
  //     fetchGroups();
  //   } catch (error) {
  //     console.error("Error saving group:", error);
  //   }
  // };

  // const handleEdit = (group) => {
  //   setEditingGroup(group);
  //   setGroupName(group.name);
  // };

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
      <h2 className="title"> {language?.users?.manage_groups}</h2>

      <form className="group-form">
        <input
          type="text"
          placeholder={language?.users?.enter_groupName}
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          required
        />
        <button className="btn">
          {editingGroup
            ? language?.users?.update_group
            : language?.users?.create_group}
        </button>
        {editingGroup && (
          <button
            type="button"
            className="cancel"
            onClick={() => setEditingGroup(null)}
          >
            {language?.devices?.cancel}
          </button>
        )}
      </form>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th> {language?.users?.id}</th>
              <th> {language?.users?.group_name}</th>
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
                    <td>
                      <div className="action-buttons-container">
                        <button
                          // onClick={() => handleEdit(group)}
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
                  {language?.users?.no_groups_found}
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
