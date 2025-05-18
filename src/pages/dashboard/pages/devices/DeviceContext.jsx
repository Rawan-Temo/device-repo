import { createContext, useContext, useState, useMemo, useEffect } from "react";

// Create DeviceContext
const DeviceContext = createContext();

// Create a Provider component
export const DeviceProvider = ({ children }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [deviceName, setDeviceName] = useState(null);
  const [deviceStatusOnline, setDeviceStatusOnline] = useState(false);
  const [fileList, setFiles] = useState([
    { name: "sdcard", isDirectory: true, path: "/sdcard" },
  ]);

  const [contactList, setContactList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [callLogList, setCallLogList] = useState([]);
  const [grantedPermissions, setGrantedPermissions] = useState([]);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const [autodownloadtasks, setAutoDownloadTasks] = useState([]);
  const [notificationList, setNotificationList] = useState([]);

  // ✅ Reset state when deviceId changes
  useEffect(() => {
    if (deviceId) {
      setFiles([{ name: "sdcard", isDirectory: true, path: "/sdcard" }]);
      setContactList([]);
      setMessageList([]);
      setCallLogList([]);
      setGrantedPermissions([]);
      setDeviceInfo(null);
      setAutoDownloadTasks([]);
      setNotificationList([]);
    }
  }, [deviceId]);
  // ✅ useMemo to optimize context value
  const contextValue = useMemo(
    () => ({
      deviceId,
      setDeviceId,
      deviceName,
      setDeviceName,
      deviceStatusOnline,
      setDeviceStatusOnline,
      fileList,
      setFiles,
      contactList,
      setContactList,
      messageList,
      setMessageList,
      callLogList,
      setCallLogList,
      grantedPermissions,
      setGrantedPermissions,
      deviceInfo,
      setDeviceInfo,
      autodownloadtasks,
      setAutoDownloadTasks,
      notificationList,
      setNotificationList,
    }),
    [
      deviceId,
      deviceName,
      deviceStatusOnline,
      fileList,
      contactList,
      messageList,
      callLogList,
      grantedPermissions,
      deviceInfo,
      autodownloadtasks,
      notificationList,
    ]
  );

  return (
    <DeviceContext.Provider value={contextValue}>
      {children}
    </DeviceContext.Provider>
  );
};

// Custom hook for convenience
export const useDevice = () => useContext(DeviceContext);
