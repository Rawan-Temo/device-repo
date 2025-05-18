import * as React from "react";
import { useState, useEffect } from "react";
import "./Manage.css";

import { useContext } from "react";
import { Context } from "../../../../context/context";

function ManageUsers() {
  const [users, setUsers] = useState([]);

  const [selectedUserDevices, setSelectedUserDevices] = useState({});
  const [loadingUsers, setLoadingDevices] = useState(false);
  const context = useContext(Context);
  const language = context?.selectedLang;
  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await getAllUsers();
  //     setUsers(response);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // const handleEdit = (user) => {};

  // const handleDelete = async (userId) => {};

  // const toggleUserList = async (userId) => {
  //   if (selectedUserDevices[userId]) {
  //     setSelectedUserDevices((prev) => ({ ...prev, [userId]: null }));
  //   } else {
  //     setLoadingDevices(true);
  //     try {
  //       const devices = await getUserDevices(userId);
  //       setSelectedUserDevices((prev) => ({ ...prev, [userId]: devices }));
  //     } catch (error) {
  //       console.error("Error fetching devices:", error);
  //     }
  //     setLoadingDevices(false);
  //   }
  // };

  // const handleUnlinkDevice = async (deviceId, userId) => {
  //   if (!window.confirm("Are you sure you want to Unlink this device?")) return;
  //   try {
  //     await unLinkDevicetoUser(deviceId, userId);
  //     toggleUserList(userId);
  //     fetchUsers();
  //   } catch (error) {
  //     console.error("Error unlink Device:", error);
  //   }
  // };

  return (
    <div className="tabel-container">
      <h2 className="title"> {language?.users?.manage_users}</h2>

      <div className="table">
        <table>
          <thead>
            <tr>
              <th>{language?.users?.id}</th>
              <th>{language?.users?.email}</th>
              <th>{language?.users?.operations}</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <React.Fragment key={user.id}>
                  <tr>
                    <td>{user.id}</td>
                    <td>{user.email}</td>
                    <td>
                      <div className="action-buttons-container">
                        <button
                          // onClick={() => handleEdit(user)}
                          className="edit-button"
                        >
                          {language?.users?.edit}
                        </button>
                        <button
                          // onClick={() => handleDelete(user.id)}
                          className="delete-button"
                        >
                          {language?.users?.delete}
                        </button>
                        <button
                          // onClick={() => toggleUserList(user.id)}
                          disabled={user.userCount === 0}
                          className="view-users-button btn"
                        >
                          {selectedUserDevices[user.id]
                            ? language?.users?.hide_devices
                            : language?.users?.veiw_devices}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* device List Linked To User */}
                  {selectedUserDevices[user.id] && (
                    <tr className="user-list-row">
                      <td colSpan="4">
                        <div className="user-list">
                          {loadingUsers ? (
                            <p>{language?.devices?.loading}</p>
                          ) : selectedUserDevices[user.id].length > 0 ? (
                            <ul>
                              {selectedUserDevices[user.id].map((device) => (
                                <li key={device.id}>
                                  {language?.devices?.device_name}
                                  {device.name}, UUID:({device.UUID})
                                  <button
                                    // onClick={() =>
                                    //   handleUnlinkDevice(device.id, user.id)
                                    // }
                                    className="delete-button"
                                  >
                                    {language?.users?.delete}
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
