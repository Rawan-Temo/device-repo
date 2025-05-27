import { useContext, useEffect, useState } from "react";
import "./Link.css";
import {
  getAllGroups,
  getAllUsers,
  getDevices,
  linkDevicetoGroup,
  // unlinkDeviceFromUser,
} from "../../../../apiService";

import { Context } from "../../../../context/context";

function LinkDeviceToUser() {
  const [groups, setGroups] = useState([]);
  const [devices, setDevices] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [selectedDeviceId, setSelectedDeviceId] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const context = useContext(Context);
  const language = context?.selectedLang;
  useEffect(() => {
    fetchUsers();
    fetchDevices();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getAllGroups();
      setGroups(response);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchDevices = async () => {
    try {
      const response = await getDevices();
      setDevices(response);
    } catch (error) {
      console.error("Error fetching devices:", error);
    }
  };

  const handleAssignUser = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedDeviceId) {
      setMessage("Please select both a user and a device.");
      return;
    }
    setLoading(true);
    try {
      await linkDevicetoGroup(selectedDeviceId, selectedUserId);
      setMessage("Device successfully assigned to user.");
      fetchDevices(); // Optionally refresh device list
    } catch (error) {
      setMessage("Failed to assign device to user.");
      console.error("Error assigning device:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlink = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !selectedDeviceId) {
      setMessage("Please select both a user and a device.");
      return;
    }
    setLoading(true);
    try {
      // await unlinkDeviceFromUser(selectedDeviceId, selectedUserId);
      setMessage("Device successfully unlinked from user.");
      fetchDevices(); // Optionally refresh device list
    } catch (error) {
      setMessage("Failed to unlink device from user.");
      console.error("Error unlinking device:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Link Devices to groups</h2>

      {message && <p className="message">{message}</p>}

      <form className="no-flex" onSubmit={handleAssignUser}>
        <div className="form-group">
          <label>{language?.users?.Select_user}</label>
          <select
            value={selectedUserId || ""}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="">-- {language?.users?.Select_user} --</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>{language?.users?.Select_device}</label>

          <select
            value={selectedDeviceId || ""}
            onChange={(e) => {
             
              setSelectedDeviceId(e.target.value);
            }}
          >
            <option value="">-- {language?.users?.Select_device} --</option>
            {devices.map((device) => (
              <option key={device.id} value={device.uuid}>
                {device.name}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={handleAssignUser}
            className="btn"
            type="submit"
            disabled={loading}
          >
            {loading
              ? language?.users?.assigning
              : language?.users?.assign_to_user}
          </button>
          <button
            onClick={handleUnlink}
            className="remove-btn"
            disabled={loading}
            type="button"
          >
            remove user from device
          </button>
        </div>
      </form>
    </div>
  );
}

export default LinkDeviceToUser;
