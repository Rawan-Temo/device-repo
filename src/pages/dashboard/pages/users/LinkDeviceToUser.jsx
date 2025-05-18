import { useContext, useEffect, useState } from "react";
import "./Link.css";

import { Context } from "../../../../context/context";

function LinkDeviceToUser() {
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [selectedDeviceId, setSelectedDeviceId] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const context = useContext(Context);
  const language = context?.selectedLang;
  // useEffect(() => {
  //   fetchUsers();
  //   fetchDevices();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await getAllUsers();
  //     setUsers(response);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // const fetchDevices = async () => {
  //   try {
  //     const response = await getDevices();
  //     setDevices(response);
  //   } catch (error) {
  //     console.error("Error fetching devices:", error);
  //   }
  // };

  // const handleAssignUser = async () => {
  //   if (!selectedUserId || !selectedDeviceId) {
  //     setMessage("Please select both a user and a group.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await linkDevicetoUser(selectedDeviceId, selectedUserId);

  //     setMessage("User successfully assigned to group.");
  //   } catch (error) {
  //     setMessage("Failed to assign user to group.");
  //     console.error("Error assigning user:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleUnlink = async () => {
  //   if (!selectedUserId || !selectedDeviceId) {
  //     setMessage("Please select both a user and a group.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await removeUserFromGroup(selectedDeviceId.id, selectedUserId.id);

  //     setMessage("User successfully Unlinked.");
  //   } catch (error) {
  //     setMessage("Failed to Unlink device and user.");
  //     console.error("Error Unlink:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="container">
      <h2>{language?.users?.link_devices_to_users}</h2>

      {message && <p className="message">{message}</p>}

      <div className="form-group">
        <label>{language?.users?.Select_user}</label>
        <select
          value={selectedUserId}
          onChange={(e) => setSelectedUserId(e.target.value)}
        >
          <option value="">-- {language?.users?.Select_user} --</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.email} ({user.roles.join(", ")})
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>{language?.users?.Select_device}</label>
        <select
          value={selectedDeviceId}
          onChange={(e) => setSelectedDeviceId(e.target.value)}
        >
          <option value="">-- {language?.users?.Select_device} --</option>
          {devices.map((device) => (
            <option key={device.id} value={device.id}>
              {device.name}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="btn" disabled={loading}>
          {loading
            ? language?.users?.assigning
            : language?.users?.assign_to_user}
        </button>
      </div>
    </div>
  );
}

export default LinkDeviceToUser;
