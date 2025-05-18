import { useContext, useEffect, useState } from "react";
import "./Link.css";

import { Context } from "../../../../context/context";

function LinkUserToGroups() {
  const [users, setUsers] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState();
  const [selectedGroupId, setSelectedGroupId] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const context = useContext(Context);
  const language = context?.selectedLang;
  // useEffect(() => {
  //   fetchUsers();
  //   fetchGroups();
  // }, []);

  // const fetchUsers = async () => {
  //   try {
  //     const response = await getAllUsers();
  //     setUsers(response);
  //   } catch (error) {
  //     console.error("Error fetching users:", error);
  //   }
  // };

  // const fetchGroups = async () => {
  //   try {
  //     const response = await getAllGroups();
  //     setGroups(response);
  //   } catch (error) {
  //     console.error("Error fetching groups:", error);
  //   }
  // };

  // const handleAssignUser = async () => {
  //   if (!selectedUserId || !selectedGroupId) {
  //     setMessage("Please select both a user and a group.");
  //     return;
  //   }
  //   setLoading(true);
  //   try {
  //     await addUserToGroup(selectedGroupId, selectedUserId);

  //     setMessage("User successfully assigned to group.");
  //   } catch (error) {
  //     setMessage("Failed to assign user to group.");
  //     console.error("Error assigning user:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleRemoveUser = async () => {
  //   if (!selectedUserId || !selectedGroupId) {
  //     setMessage("Please select both a user and a group.");
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     await removeUserFromGroup(selectedGroupId.id, selectedUserId.id);

  //     setMessage("User successfully removed from group.");
  //   } catch (error) {
  //     setMessage("Failed to remove user from group.");
  //     console.error("Error removing user:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="container">
      <h2>{language?.users?.link_user_to_group}</h2>

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
        <label>{language?.users?.Select_group}</label>
        <select
          value={selectedGroupId}
          onChange={(e) => setSelectedGroupId(e.target.value)}
        >
          <option value="">-- {language?.users?.Select_group} --</option>
          {groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <div className="button-group">
        <button className="btn" disabled={loading}>
          {loading
            ? language?.users?.assigning
            : language?.users?.assign_to_group}
        </button>
        <button
          // onClick={handleRemoveUser}
          className="remove-btn"
          disabled={loading}
        >
          {loading
            ? language?.users?.removing
            : language?.users?.remove_from_group}
        </button>
      </div>
    </div>
  );
}

export default LinkUserToGroups;
