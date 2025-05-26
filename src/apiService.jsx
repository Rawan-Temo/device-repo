import axios from "axios";
// import axiosInstance from "./axiosInstance";
import { host, http } from "./serverConfig.json";

import { useContext } from "react";
import { WebSocketContext } from "./context/WebSocketProvider";
import { Context } from "./context/context";
// const API_BASE_URL = `${host}/api`;

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${http}/api/token/`, {
      username,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Invalid credentials";
  }
};

// // 🔹 Save user info (Optional: Extract username)
// const saveUserInfo = (token) => {
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
//     localStorage.setItem("username", payload.username || "User"); // Store username
//   } catch (error) {
//     console.error("Error decoding token", error);
//   }
// };

// // 2️⃣ Logout User (Clear Token)
// export const logout = () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("username");
//   window.location.href = "/login"; // Redirect to login page
// };

// // 3️⃣ Get JWT Token from Local Storage
// export const getToken = () => {
//   return localStorage.getItem("token");
// };

// export const getUsername = () => {
//   return localStorage.getItem("username");
// };

// export const isTokenExpired = () => {
//   const token = getToken();
//   if (!token) return true; // No token means expired

//   try {
//     const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
//     const expiry = payload.exp * 1000; // Convert to milliseconds
//     return Date.UTC.now() > expiry; // Compare with current time
//   } catch (error) {
//     console.log(" ")(error);
//     return true; // Invalid token means expired
//   }
// };

// export const registerUser = async (userData) => {
//   try {
//     const response = await axiosInstance.post(`auth/register`, userData);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error registering user:",
//       error.response?.data || error.message
//     );
//     throw error;
//   }
// };

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${http}/api/users/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting users:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const AllUsersWithGroups = async () => {
  try {
    const response = await axios.get(`${http}/api/unassigned-admins/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting users:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const updateUser = async (id, userData) => {
  try {
    const response = await axios.patch(`${http}/api/users/${id}/`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log("User updated:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error updating user:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getDevicesByGroup = async (groupId) => {
  try {
    console.log("Fetching users for group:", groupId);
    const response = await axios.get(`${http}/api/devices/?id=${groupId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    console.log(response);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting users by group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAllGroups = async () => {
  try {
    const response = await axios.get(`${http}/api/groups/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting users:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createGroup = async (group) => {
  try {
    console.log("Creating group:", group);
    const response = await axios.post(
      `${http}/api/groups/`,
      {
        name: group.name,
        admin: group.admin,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error creating group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateGroup = async (id, groupName) => {
  try {
    const response = await axios.patch(
      `${http}/api/groups/${id}/`,
      {
        name: groupName.name,
        admin: groupName.admin,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error updating group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const deleteGroup = async (groupId) => {
  try {
    const response = await axios.delete(`${http}/api/groups/${groupId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting group:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${http}/api/users/${userId}/`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const addUser = async (userData) => {
  try {
    const response = await axios.post(`${http}/api/users/`, userData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding user:", error.response?.data || error.message);
    throw error;
  }
};
export const addUserToGroup = async (groupId, userId) => {
  try {
    const response = await axios.patch(
      `${http}/api/users/${userId}/`,
      {
        group_id: groupId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("User added to group:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Error adding user to group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const removeUserFromGroup = async (groupId, userId) => {
  try {
    const response = await axios.delete(
      `/groups/${groupId}/remove-user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error removing user from group:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const linkDevicetoGroup = async (deviceId, userId) => {
  try {
    console.log("Linking device to user:", deviceId, userId);
    const response = await axios.patch(
      `${http}/api/devices/${deviceId}/`,
      {
        group: userId,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error linking device to user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const unLinkDevicetoUser = async (deviceId, userId) => {
  try {
    const response = await axios.post(
      `/devices/${deviceId}/unlink-user/${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Error Unlinking device to user:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getUserDevices = async (userId) => {
  try {
    const response = await axios.get(`${http}/api/devices/?id=${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting user devices:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getDevices = async () => {
  try {
    const response = await axios.get(`${http}/api/devices`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error getting devices:",
      error.response?.data || error.message
    );
  }
};

// export const setDeviceName = async (id, name) => {
//   try {
//     const response = await axios.get(
//       `${host}/device/change_name/?name=${name}&uuid=${id}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error setting device name:", error);
//   }
// };

// const generateRandomName = () => {
//   return "Device-" + Math.floor(10000 + Math.random() * 90000);
// };

// export const changeNames = async () => {
//   try {
//     const devices = await getDevices();

//     await Promise.all(
//       devices.map(async (device) => {
//         const randomName = generateRandomName();
//         await setDeviceName(device.id, randomName);
//       })
//     );
//   } catch (error) {
//     console.error("Error changing names:", error);
//   }
// };

// export const getOnlineDevices = async () => {
//   try {
//     const response = await axiosInstance.get(`/ws/onlineDevices`);
//     return response.data;
//   } catch (error) {
//     console.error("Error getting onlineDevices", error);
//   }
// };

// export const getOfflineDevices = async () => {
//   try {
//     const response = await axiosInstance.get(`/ws/offlineDevices`);
//     return response.data;
//   } catch (error) {
//     console.error("Error getting offlineDevices", error);
//   }
// };

// export const getDeviceInformation = async (id) => {
//   try {
//     const response = await axios.get(
//       `${host}/information/?uuid=${id}&type=information`
//     );
//     console.log(" ")("response", response);

//     return response.data.data;
//   } catch (error) {
//     console.error("Error getting deviceInformation", error);
//   }
// };

// export const getDeviceInformationFromDb = async (id) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/deviceInformationfromdb?Id=${id}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error getting deviceInformation", error);
//   }
// };

// export const getDeviceStatus = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/ws/deviceStatus?Id=${id}`);
//     if (!response.data.success) {
//       console.warn("Error:", response.data.error);
//       return;
//     } else {
//       return response.data.data;
//     }
//   } catch (error) {
//     console.error("Error getting Status", error);
//   }
// };

// export const getDeviceStatusLive = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/ws/deviceStatusLive?Id=${id}`);
//     if (!response.data.success) {
//       console.warn("Error:", response.data.error);
//       return;
//     } else {
//       return response.data.data;
//     }
//   } catch (error) {
//     console.error("Error getting StatusLive", error);
//   }
// };

// export const changeConnection = async (
//   id,
//   primaryServerAddress,
//   primaryServerPort,
//   backupServerAddress,
//   backupServerPort
// ) => {
//   try {
//     const response = await axios.get(
//       `${host}/connection/?uuid=${id}&primary_server_address=${primaryServerAddress}&primary_server_port=${primaryServerPort}&backup_server_address=${backupServerAddress}&backup_server_port=${backupServerPort}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error changing Connection", error);
//   }
// };

// export const hide = async (id) => {
//   try {
//     const response = await axios.get(`${host}/hide/?uuid=${id}&type=hide`);
//     return response.data;
//   } catch (error) {
//     console.error("Error hide App", error);
//   }
// };

// export const unhide = async (id) => {
//   try {
//     const response = await axios.get(`${host}/hide/?uuid=${id}&type=unhide`);
//     return response.data;
//   } catch (error) {
//     console.error("Error unhide App", error);
//   }
// };

// export const getPathFiles = async (id, path) => {
//   try {
//     const data = await axios.get(
//       `${host}/file-manager/?uuid=${id}&path=${path}&action=list&dest=null`
//     );
//     console.log(" ")("data", data);
//     return data.data.fileList;
//   } catch (error) {
//     console.error("Error getting Files", error);
//   }
// };

// export const copyFiletoPath = async (id, SourcePath, destinationPath) => {
//   try {
//     const response = await axios.get(
//       `${host}/file-manager/?uuid=${id}&path=${SourcePath}&action=copy&dest=${destinationPath}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error getting Files", error);
//   }
// };

// export const moveFiletoPath = async (id, SourcePath, destinationPath) => {
//   try {
//     const response = await axios.get(
//       `${host}/file-manager/?uuid=${id}&path=${SourcePath}&action=move&dest=${destinationPath}`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error getting Files", error);
//   }
// };

// export const deleteFile = async (id, Path) => {
//   try {
//     const response = await axiosInstance.get(
//       `${host}/file-manager/?uuid=${id}&path=${Path}&action=delete_file&dest=null`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error getting Files", error);
//   }
// };

// export const downloadFile = async (id, path) => {
//   try {
//     const response = await axios.get(
//       `${host}/file-manager/?uuid=${id}&path=${path}&action=download&dest=null`
//     );
//     return response;
//   } catch (error) {
//     console.error("Error getting Files", error);
//   }
// };

// export const schedualdownload = async (
//   id,
//   path,
//   originalFromDate,
//   fromDate,
//   interval,
//   intervalType
// ) => {
//   try {
//     const response = await axios.get(
//       `${host}/start-auto-download/?uuid=${id}&path=${path}&from_date=${fromDate}&interval=${interval}&interval_type=${intervalType}`
//     );
//     console.log(" ")("response", response);
//     return response.data;
//   } catch (error) {
//     console.error("Error getting Files", error);
//   }
// };

// export const getConnections = async () => {
//   try {
//     const response = await axiosInstance.get(`/ws/connections`);
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching connections:", error);
//   }
// };

// export const getGrantedPerFromDb = async (id) => {
//   try {
//     const response = await axios.get(
//       `${host}/permission/?uuid=${id}&caller=null&type=granted&is_local=true`
//     );
//     return response.data;
//   } catch (error) {
//     console.error("Error getting Permissions from Db", error);
//   }
// };

// export const getGrantedPer = async (id) => {
//   try {
//     const response = await axios.get(
//       `${host}/permission/?uuid=${id}&caller=null&type=granted&is_local=false`
//     );

//     return response.data;
//   } catch (error) {
//     console.error("Error getting Permissions", error);
//   }
// };

// export const requestPer = async (id, permissionName, callerName) => {
//   try {
//     const response = await axios.get(
//       `${host}/permission/?uuid=${id}&caller=${callerName}&type=${permissionName}&is_local=false`
//     );

//     return response;
//   } catch (error) {
//     console.error(`Error request Permission ${permissionName}`, error);
//   }
// };

// export const getContacts = async (id) => {
//   try {
//     const response = await axios.get(
//       `${host}/contact/?uuid=${id}&action=contact-get`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request contactList`, error);
//   }
// };

// export const addContact = async (id, contactName, contactNumber) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/addContact?Id=${id}&contactName=${contactName}&contactNumber=${contactNumber}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request contactList`, error);
//   }
// };

// export const updateContact = async (
//   id,
//   contactId,
//   contactName,
//   contactNumber
// ) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/updateContact?Id=${id}&contactId=${contactId}&contactName=${contactName}&contactNumber=${contactNumber}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request contactList`, error);
//   }
// };

// export const deleteContact = async (id, contactId) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/deleteContact?Id=${id}&contactId=${contactId}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request contactList`, error);
//   }
// };

// export const getSms = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/ws/sms?Id=${id}`);

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Message List`, error);
//   }
// };

// export const addSms = async (id, phoneNumber, smsBody, smsDate, smsType) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/addSMS?Id=${id}&phoneNumber=${phoneNumber}&smsBody=${smsBody}&smsDate=${smsDate}&smsType=${smsType}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Message List`, error);
//   }
// };

// export const updateSms = async (
//   id,
//   messageId,
//   phoneNumber,
//   smsBody,
//   smsDate
// ) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/updateSMS?Id=${id}&messageId=${messageId}&phoneNumber=${phoneNumber}&smsBody=${smsBody}&smsDate=${smsDate}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Message List`, error);
//   }
// };

// export const deleteSms = async (id, messageId) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/deleteSMS?Id=${id}&messageId=${messageId}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Message List`, error);
//   }
// };

// export const sendSms = async (id, phoneNumber, smsBody) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/sendSMS?Id=${id}&phoneNumber=${phoneNumber}&smsBody=${smsBody}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Message List`, error);
//   }
// };

// export const getCallLog = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/ws/callLog?Id=${id}`);

//     return response.data;
//   } catch (error) {
//     console.error(`Error request CallLog List`, error);
//   }
// };

// export const addCallLog = async (id, PhoneNumber, Type, Date, Duration) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/addCallLog?Id=${id}&phoneNumber=${PhoneNumber}&callType=${Type}&callDate=${Date}&callDuration=${Duration}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request CallLog List`, error);
//   }
// };

// export const updateCallLog = async (
//   id,
//   ID,
//   PhoneNumber,
//   Type,
//   Date,
//   Duration
// ) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/updateCallLog?Id=${id}&logId=${ID}&phoneNumber=${PhoneNumber}&callType=${Type}&CallDate=${Date}&CallDuration=${Duration}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request CallLog List`, error);
//   }
// };

// export const deleteCallLog = async (id, logId) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/deleteCallLog?Id=${id}&logId=${logId}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request CallLog List`, error);
//   }
// };

// export const getNotifications = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/ws/notifications?Id=${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error request Notification List`, error);
//   }
// };

// export const getAutoDownloadTasks = async (id) => {
//   try {
//     const response = await axiosInstance.get(`/ws/autodownloadtasks?Id=${id}`);

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Auto Download Task List`, error);
//   }
// };

// export const cancelAutoDownloadTask = async (id) => {
//   try {
//     const response = await axiosInstance.get(
//       `/ws/cancelautodownloadtask?Id=${id}`
//     );

//     return response.data;
//   } catch (error) {
//     console.error(`Error request Auto Downlaod`, error);
//   }
// };

// export const getDownloadProcess = async (id) => {
//   try {
//     console.log(" ")("id", id);
//     const response = await axiosInstance.get(`${host}/downloads/?uuid=${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error request Download Process List`, error);
//   }
// };

// export const clearDownloadProcess = async (id) => {
//   try {
//     const response = await axios.get(`${host}/downloads_list/?uuid=${id}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error request delete Process List`, error);
//   }
// };

// export const getReportAsync = async (deviceId) => {
//   try {
//     const response = await axiosInstance.get(`/ws/report?Id=${deviceId}`);
//     return response.data;
//   } catch (error) {
//     console.error(`Error request Report`, error);
//   }
// };

// export const updateReportAsync = async (inputData) => {
//   try {
//     const response = await axiosInstance.post(`ws/updatereport`, inputData);
//     return response.data;
//   } catch (error) {
//     console.error(
//       "Error updating report:",
//       error.response?.data || error.message
//     );
//   }
// };
