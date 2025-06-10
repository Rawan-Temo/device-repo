import { useContext, useEffect, useState } from "react";
import { FileManager as FileManager2 } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import AutoDownloadTasks from "./AutoDownloadTasks";
import AddAutoDownload from "./fileManager/AddAutoDownload";
import DownloadsDialog from "./autoDownload/DownloadsDialog";
import { Context } from "../../../../context/context";
import { useParams } from "react-router";
import {
  sendWebSocketMessage,
  WebSocketContext,
} from "../../../../context/WebSocketProvider";
import { useDevice } from "../../../../context/DeviceContext";

const FileManager = () => {
  const [error, setError] = useState(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isDownloadListOpen, setDownloadListOpen] = useState(false);
  const [isDownloadingDialogOpen, setIsDownloadingDialogOpen] = useState(false);
  const [folderPath, setFolderPath] = useState("/sdcard");
  const [loading, setLoading] = useState(true);
  const [fileList, setFiles] = useState([
    { name: "sdcard", isDirectory: true, path: "/sdcard" },
  ]);
  const context = useContext(Context);
  const language = context?.selectedLang;

  const { state, dispatch } = useDevice();
  const { socketRef } = useContext(WebSocketContext);

  const sendWsMessage = (message) => {
    if (socketRef.current && socketRef.current.readyState === 1) {
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.error("WebSocket is not connected");
    }
  };

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
    sendWS({
      token: localStorage.getItem("token"),
      uuid: id,
      file_operation: true,
      action: "list", // "move", "copy", "delete_file", "delete_folder", "download"
      path: "/sdcard/",
    });
    // Wait 2 seconds, then refresh the page
    const timeout = setTimeout(() => {
      handleRefresh();
    }, 100);
    return () => clearTimeout(timeout);
  }, [id, folderPath]);

  useEffect(() => {
    // Wait for fileList to arrive before showing file manager
    if (
      state.fileList &&
      Array.isArray(state.fileList) &&
      state.fileList.length > 0
    ) {
      const fileDetails = state?.fileList;
      setFiles((prevFiles) => [
        ...prevFiles.filter(
          (f) => !fileDetails.some((newFile) => newFile.path === f.path)
        ),
        ...fileDetails,
      ]);
      setLoading(false);
    }
    // Do not set loading to true if fileList is empty, just leave as is
  }, [state.fileList]);

  const handleOpen = (file, forceRefresh = false) => {
    setFolderPath(file.path);

    if (socketRef?.current && socketRef.current.readyState === 1) {
      socketRef.current.send(
        JSON.stringify({
          token: localStorage.getItem("token"),
          uuid: id,
          file_operation: true,
          action: "list",
          path: file.path,
          dest: file.path, // if needed
        })
      );
    } else {
      console.error("WebSocket not ready.");
    }
  };
  const copyFile = (socketRef, deviceId, sourcePath, destPath) => {
    sendWS({
      token: localStorage.getItem("token"),
      uuid: deviceId,
      file_operation: true,
      action: "copy",
      path: sourcePath,
      dest: destPath,
    });
    setTimeout(() => {
      handleRefresh();
    }, 2000); // Wait a short time for backend to process
  };
  const moveFile = (socketRef, deviceId, sourcePath, destPath) => {
    sendWS({
      token: localStorage.getItem("token"),
      uuid: deviceId,
      file_operation: true,
      action: "move",
      path: sourcePath,
      dest: destPath,
    });
    setTimeout(() => {
      handleRefresh();
    }, 2000); // Wait a short time for backend to process
  };
  const deletePath = (socketRef, deviceId, files) => {
    files.forEach((file) => {
      sendWS({
        token: localStorage.getItem("token"),
        uuid: deviceId,
        file_operation: true,
        action: file.isFolder ? "delete_folder" : "delete_file",
        path: file.path,
      });
    });
    // After sending delete, request the updated file list
    setTimeout(() => {
      handleRefresh();
    }, 2000); // Wait a short time for backend to process
  };
  const downloadFile = (socketRef, deviceId, filePath) => {
    sendWS({
      token: localStorage.getItem("token"),
      uuid: deviceId,
      file_operation: true,
      action: "download",
      path: filePath,
    });
  };
  const scheduleDownload = (
    socketRef,
    deviceId,
    path,
    originalFromDate,
    fromDate,
    interval,
    intervalType
  ) => {
    sendWS({
      token: localStorage.getItem("token"),
      uuid: deviceId,
      auto_download: true,
      path,
      originalFromDate,
      fromDate,
      interval,
      intervalType,
    });
  };
  const handleRefresh = async () => {
    setFiles([{ name: "sdcard", isDirectory: true, path: "/sdcard" }]);
    await handleOpen({ path: folderPath }, true);
  };

  return (
    <div className="tab-content">
      {loading ? (
        <div style={{ padding: 40, textAlign: "center" }}>
          <span>Loading files...</span>
        </div>
      ) : (
        <>
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div className="action-buttons-container">
            <button className="btn" onClick={() => setAddDialogOpen(true)}>
              <i className="fa-solid fa-robot"></i>
            </button>
            <button
              className="btn"
              onClick={() => setIsDownloadingDialogOpen(true)}
            >
              <i className="fa-solid fa-file-arrow-down"></i>
            </button>
            <button className="btn" onClick={() => setDownloadListOpen(true)}>
              <i className="fa-solid fa-list-check"></i>
            </button>
          </div>
          <div className="dark-mode">
            <FileManager2
              primaryColor="#007bff"
              enableFilePreview={false}
              files={fileList}
              onFileOpen={(s) => {
                handleOpen(s);
              }}
              onRefresh={() => {
                handleRefresh();
              }}
              onDelete={(files) => {
                // Use WebSocket to delete file or folder
                deletePath(socketRef, id, files);
              }}
              onPaste={(files, destinationFolder, operationType) => {
                // Enable copy and move via WebSocket
                if (operationType === "copy") {
                  files.forEach((file) =>
                    copyFile(socketRef, id, file.path, destinationFolder.path)
                  );
                } else if (operationType === "move") {
                  files.forEach((file) =>
                    moveFile(socketRef, id, file.path, destinationFolder.path)
                  );
                }
              }}
              onDownload={(files) => {
                // Enable download via WebSocket
                files.forEach((file) => downloadFile(socketRef, id, file.path));
              }}
            />
          </div>
          <AutoDownloadTasks
            isOpen={isDownloadListOpen}
            onClose={() => setDownloadListOpen(false)}
          />
          <AddAutoDownload
            isOpen={isAddDialogOpen}
            folderPath={folderPath}
            onClose={() => setAddDialogOpen(false)}
          />
          <DownloadsDialog
            isOpen={isDownloadingDialogOpen}
            id={id}
            onClose={() => setIsDownloadingDialogOpen(false)}
          />
        </>
      )}
    </div>
  );
};

export default FileManager;
