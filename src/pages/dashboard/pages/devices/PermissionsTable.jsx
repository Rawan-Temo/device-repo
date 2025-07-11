import { useState, useEffect, useContext, useMemo } from "react";
import { useParams } from "react-router";

import AddCallerNameDialog from "./permissions/AddCallerNameDialog";
import { Context } from "../../../../context/context";
import LiveClock from "./LiveClock";
import { useDevice } from "../../../../context/DeviceContext";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";

const PermissionsTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState(true);
  const [filteredTabs, setFilteredTabs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState([]);
  const [grantedPermissions, setGrantedPermissions] = useState([]);

  const context = useContext(Context);
  const language = context?.selectedLang;

  const { tabId } = useParams();
  const { state, dispatch } = useDevice();
  const { socketRef } = useContext(WebSocketContext);
  // Request file list on device or folder path change

  const { id } = useParams();

  // Helper to send a message at any time
  const sendWS = (data) => {
    if (socketRef?.current) {
      sendWebSocketMessage(socketRef.current, data);
    } else {
      console.warn("WebSocket is not available.", data);
    }
  };
  useEffect(() => {
    const device = state?.myDevices?.find((device) => device.uuid === id);
    const permission = device?.granted_permission || null;

    setGrantedPermissions(permission);
  }, [id, state?.myDevices]);
  // const handleReload = async () => {
  //   try {
  //     setMessage("");
  //     setLoading(true);
  //     const response = await getGrantedPer(deviceId);
  //     if (response !== null) {
  //       setGrantedPermissions(response?.data?.permissions);
  //     }
  //   } catch (error) {
  //     console.error("Error while requesting permission:", error);
  //     setError("Failed to load permissions.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const getInitData = async () => {
  //   try {
  //     setMessage("");
  //     setLoading(true);
  //     const response = await getGrantedPerFromDb(deviceId);
  //     if (response !== null) {
  //       setGrantedPermissions(response?.data?.permissions);
  //     } else {
  //       setGrantedPermissions(null);
  //     }
  //   } catch (error) {
  //     console.error("Error while requesting permission:", error);
  //     setError("Failed to load permissions.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   const loadPermissions = async () => {
  //     if (!grantedPermissions || Object.keys(grantedPermissions).length === 0) {
  //       await handleReload();
  //     }
  //   };
  //   loadPermissions();
  // }, [grantedPermissions]);

  const permissionslist = useMemo(() => {
    try {
      return Object.entries(grantedPermissions).map(([key, value], index) => {
        return {
          id: index + 1,
          name: key,
          status: value ? "granted" : "pending",
        };
      });
    } catch (error) {
      console.log(error);
    }
  }, [grantedPermissions]);
  useEffect(() => {
    setFilteredTabs(
      permissionslist?.filter((log) =>
        log.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, permissionslist]);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleAddCallerName = (perName) => {
    setSelectedPermission(perName);
    setAddDialogOpen(true);
  };

  const handleRequest = async (newRequest) => {
    setMessage(null);
    try {
      // Optionally check device status if needed
      setLoading(true);
      // Send WebSocket message to request permission
      if (socketRef?.current) {
        sendWS({
          token: localStorage.getItem("token"),
          uuid: id,
          permission_operation: true,
          caller: newRequest.callerName,
          type: selectedPermission,
        });
        setMessage(`${newRequest.permission} request sent successfully!`);
      } else {
        setError("WebSocket is not available.");
      }
    } catch (error) {
      console.error("Error while requesting permission:", error);
      setError("Failed to send permission request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {message && <div style={{ color: "green" }}>{message}</div>}
      <div className="table-header">
        <button className="reload-button">
          <i className="fa-solid fa-sync-alt"></i>
        </button>
        <input
          type="text"
          className="search-field"
          placeholder={language?.devices?.search_in_tabs}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="date-timer flex">
          <p>
            <LiveClock />
          </p>
          <button onClick={toggleExpand} className="expand-button">
            <i className="fa-solid fa-up-right-and-down-left-from-center"></i>
          </button>
        </div>
      </div>
      {expanded && (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>{tabId}</th>
                <th>{language?.devices?.name}</th>
                <th>{language?.devices?.status}</th>
                <th>{language?.devices?.operation}</th>
              </tr>
            </thead>
            <tbody>
              {filteredTabs?.length > 0 ? (
                filteredTabs?.map((item) => {
                  const isGranted = item.status === "granted";
                  return (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      <td>{item.name}</td>
                      <td>
                        {isGranted
                          ? language?.devices?.granted
                          : language?.devices?.pending}
                      </td>
                      <td>
                        <button
                          onClick={() => handleAddCallerName(item?.name)}
                          disabled={isGranted}
                          className="action-button"
                        >
                          {isGranted
                            ? language?.devices?.granted
                            : language?.devices?.request}
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    {language?.devices?.no_info_available}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <AddCallerNameDialog
        isOpen={isAddDialogOpen}
        selectedPermission={selectedPermission}
        onClose={() => setAddDialogOpen(false)}
        onSave={handleRequest}
      />
    </div>
  );
};

export default PermissionsTable;
