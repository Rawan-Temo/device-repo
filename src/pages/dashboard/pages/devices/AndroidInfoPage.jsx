import { useState, useEffect, useCallback, useContext } from "react";
import "./AndroidInfoPage.css";

import ChangeConnectionDialog from "./androidInfo/ChangeConnectionDialog";
import ChangeDeviceNameDialog from "./androidInfo/ChangeDeviceNameDialog";
import { Context } from "../../../../context/context";
import { useParams } from "react-router";

const AndroidInfoPage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isChangeConnectionDialogOpen, setChangeConnectionDialogOpen] =
    useState(false);
  const [isChangeNameDialogOpen, setChangeNameDialogOpen] = useState(false);
  const [deviceInfo, setDeviceInfo] = useState(null);
  const deviceId = useParams().id;


  // const fetchDeviceInfo = useCallback(async () => {
  //   if (!deviceId) return;

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getDeviceInformation(deviceId);
  //     if (!data) return;
  //     setDeviceInfo(data);
  //   } catch (error) {
  //     console.error("Failed to fetch device info:", error);
  //     setError("Failed to load device information. Please try again.");
  //     setDeviceInfo(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [deviceId, deviceInfo, setDeviceInfo]);

  // const fetchDeviceInfoFromDb = useCallback(async () => {
  //   if (!deviceId) return;
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const data = await getDeviceInformationFromDb(deviceId);

  //     setDeviceInfo(data);
  //   } catch (error) {
  //     console.error("Failed to fetch device info:", error);
  //     setError("Failed to load device information. Please try again.");
  //     setDeviceInfo(null);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [deviceId, deviceInfo, setDeviceInfo]);

  // useEffect(() => {
  //   fetchDeviceInfo();
  // }, []);

  // const handleReload = async () => {
  //   setDeviceInfo(null);
  //   await fetchDeviceInfoFromDb();
  // };

  // const handleHideApp = async () => {
  //   if (window.confirm("Are you sure you want to hide the app?")) {
  //     try {
  //       await hide(deviceId);
  //     } catch (error) {
  //       console.error("Failed to hide app:", error);
  //     }
  //   }
  // };

  // const handleUnhideApp = async () => {
  //   if (!deviceStatusOnline) {
  //     setError("device is offline.");
  //     setLoading(false);
  //     return;
  //   }
  //   if (window.confirm("Are you sure you want to unhide the app?")) {
  //     try {
  //       await unhide(deviceId);
  //     } catch (error) {
  //       console.error("Failed to unhide app:", error);
  //     }
  //   }
  // };

  // const handleChangeConnection = () => {
  //   setChangeConnectionDialogOpen(true);
  // };

  // const handleChangeName = () => {
  //   setChangeNameDialogOpen(true);
  // };

  // const handleRequest = async (newRequest) => {
  //   try {
  //     if (!deviceStatusOnline) {
  //       setError("device is offline.");
  //       setLoading(false);
  //       return;
  //     }
  //     setLoading(true);
  //     await changeConnection(
  //       deviceId,
  //       newRequest.primaryIP,
  //       newRequest.primaryPort,
  //       newRequest.backupIP,
  //       newRequest.backupPort
  //     );
  //   } catch (error) {
  //     console.error("Error while changing connection:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const changeName = async (newName) => {
  //   try {
  //     setLoading(true);
  //     await setDeviceName(deviceId, newName);
  //     await fetchDeviceInfo();
  //   } catch (error) {
  //     console.error("Error while changing device name:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const context = useContext(Context);
  const language = context?.selectedLang;

  return (
    <div className="container">
      <h1 className="title"> {language?.devices?.android_device_info}</h1>

      {loading ? (
        <p className="loading">{language?.devices?.loading}</p>
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
      {/* 
      <button className="button btn" onClick={handleReload} disabled={loading}>
        {loading ? language?.devices?.reloading : language?.devices?.reload}
      </button> */}
      <button className="btn" /*  onClick={handleChangeName}*/>
        {language?.devices?.change_name}
      </button>

      <div className="buttonRow">
        <button className="btn hide" /*onClick={handleHideApp}*/>
          {language?.devices?.hide_app}
        </button>
        <button className="btn unhide" /*onClick={handleUnhideApp}*/>
          {language?.devices?.unhide_app}
        </button>
        <button className="btn change" /*onClick={handleChangeConnection}*/>
          {language?.devices?.change_connction}
        </button>
      </div>

      <ChangeConnectionDialog
        isOpen={isChangeConnectionDialogOpen}
        onClose={() => setChangeConnectionDialogOpen(false)}
        /* onSave={handleRequest}*/
      />

      <ChangeDeviceNameDialog
        isOpen={isChangeNameDialogOpen}
        currentName={""}
        onClose={() => setChangeNameDialogOpen(false)}
        /*  onSave={changeName}*/
      />
    </div>
  );
};

export default AndroidInfoPage;
