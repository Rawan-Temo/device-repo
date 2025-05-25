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
} from "../../../../apiService";

function ManageUsers() {
  const [users, setUsers] = useState([]);
  // Track which users' device lists are open
  const [openUserDeviceLists, setOpenUserDeviceLists] = useState({});
  const [selectedUserDevices, setSelectedUserDevices] = useState({});
  const [loadingUsers, setLoadingDevices] = useState(false);
  const context = useContext(Context);
  const language = context?.selectedLang;
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleEdit = (user) => {};

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
      console.log("Devices for user:", userId, devices);
      setSelectedUserDevices({ [userId]: devices });
      setOpenUserDeviceLists({ [userId]: true });
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
    setLoadingDevices(false);
  };
  const handleUnlinkDevice = async (deviceId, userId) => {
    if (!window.confirm("Are you sure you want to Unlink this device?")) return;
    try {
      await unLinkDevicetoUser(deviceId, userId);
      toggleUserList(userId); // Refresh device list
      fetchUsers();
    } catch (error) {
      console.error("Error unlink Device:", error);
    }
  };
  console.log("Users:", users);

  return (
    <div className="tabel-container">
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
