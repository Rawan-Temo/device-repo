import * as React from "react";
import { useState, useEffect } from "react";
import "./Manage.css";

import { useContext } from "react";
import { Context } from "../../../../context/context";
import {
  deleteUser,
  getAllUsers,
  getUserDevices,
  unLinkDevicetoUser,
  updateUser,
  getAllGroups,
} from "../../../../apiService";
import Loading from "../../../../components/loader/Loading";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  // Track which users' device lists are open
  const [openUserDeviceLists, setOpenUserDeviceLists] = useState({});
  const [selectedUserDevices, setSelectedUserDevices] = useState({});
  const [loadingUsers, setLoadingDevices] = useState(false);
  const context = useContext(Context);
  const language = context?.selectedLang;
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: "",
    password: "",
    is_superadmin: false,
    group: "",
  });
  const [editPasswordError, setEditPasswordError] = useState("");
  const [editIsLoading, setEditIsLoading] = useState(false);
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchGroups();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();

      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await getAllGroups();
      console.log("Fetched groups:", response);
      setGroups(response);
    } catch (error) {
      console.error("Error fetching groups:", error);
    }
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*]/;
    if (!password) return "";
    if (!minLength.test(password))
      return "Password must be at least 8 characters.";
    if (!uppercase.test(password))
      return "Password must contain at least one uppercase letter.";
    if (!lowercase.test(password))
      return "Password must contain at least one lowercase letter.";
    if (!number.test(password))
      return "Password must contain at least one number.";
    if (!specialChar.test(password))
      return "Password must contain at least one special character.";
    return "";
  };

  const handleEdit = (user) => {
    setEditUser(user);
    setEditUserData({
      username: user.username,
      password: "",
      is_superadmin: user.is_superadmin || false,
      group: user.group || "",
    });
    setEditPasswordError("");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setEditPasswordError(validatePassword(value));
    }
    setEditUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditUserSave = async (e) => {
    e.preventDefault();
    if (editPasswordError) return;
    setEditIsLoading(true);
    try {
      const updateData = { ...editUserData };
      if (!updateData.password) delete updateData.password;
      await updateUser(editUser.id, updateData);
      setEditUser(null);
      fetchUsers();
    } catch (error) {
      alert("Error updating user.");
    } finally {
      setEditIsLoading(false);
    }
  };

  const handleEditUserCancel = () => {
    setEditUser(null);
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId); // Assuming this unlinks all devices from the user
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const toggleUserList = async (userId) => {
    // If already open, close it and clear the device list
    if (openUserDeviceLists[userId]) {
      setOpenUserDeviceLists({});
      setSelectedUserDevices({});
      return;
    }
    setLoadingDevices(true);
    // Clear all device lists before fetching new one
    setSelectedUserDevices({});
    setOpenUserDeviceLists({});
    try {
      const devices = await getUserDevices(userId);
      setSelectedUserDevices({ [userId]: devices });
      setOpenUserDeviceLists({ [userId]: true });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
    setLoadingDevices(false);
  };

  console.log("Users:", users);

  return (
    <div className="tabel-container">
      <div className="edit ">
        {editUser && (
          <div className="edit-user-popup add-user-form">
            {editIsLoading && <Loading />}
            <form className="edit-user-form" onSubmit={handleEditUserSave}>
              <h3>Edit User</h3>
              <div>
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  value={editUserData.username}
                  onChange={handleEditInputChange}
                  required
                />
              </div>
              <div>
                <label>Password (leave blank to keep unchanged)</label>
                <input
                  type="password"
                  name="password"
                  value={editUserData.password}
                  onChange={handleEditInputChange}
                  placeholder="New password"
                />
                {editPasswordError && (
                  <p className="error-text">{editPasswordError}</p>
                )}
              </div>
              <div className="selecte">
                <label>Role:</label>
                <select
                  name="is_superadmin"
                  value={editUserData.is_superadmin ? "admin" : "user"}
                  onChange={(e) =>
                    setEditUserData((prev) => ({
                      ...prev,
                      is_superadmin: e.target.value === "admin",
                    }))
                  }
                >
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </select>
              </div>
              <div className="selecte">
                <label>Group:</label>
                <select
                  name="group"
                  value={editUserData.group || ""}
                  onChange={(e) =>
                    setEditUserData((prev) => ({
                      ...prev,
                      group: e.target.value,
                    }))
                  }
                >
                  <option value="">None</option>
                  {groups.map((group) => (
                    <option key={group.id} value={group.id}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="edit-user-actions">
                <button
                  type="submit"
                  className="btn"
                  disabled={editPasswordError !== ""}
                >
                  Save
                </button>
                <button
                  type="button"
                  className="btn cancel"
                  onClick={handleEditUserCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
      <h2 className="title"> {language?.users?.manage_users}</h2>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>{language?.users?.id}</th>
              <th>username</th>
              <th>group</th>
              <th>is super admin</th>
              <th>{language?.users?.operations}</th>
            </tr>
          </thead>
          <tbody>
            {users?.length > 0 ? (
              users?.map((user) => (
                <React.Fragment key={user.id}>
                  <tr>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>
                      {user.group ? <span>{user.group}</span> : <span>-</span>}
                    </td>
                    <td>{user.is_superadmin ? "Yes" : "No"}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          onClick={() => handleEdit(user)}
                          className="edit-button"
                        >
                          {language?.users?.edit}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="delete-button"
                        >
                          {language?.users?.delete}
                        </button>
                      </div>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  {language?.users?.no_users_found}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageUsers;
