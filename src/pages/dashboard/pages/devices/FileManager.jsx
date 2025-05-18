import { useContext, useEffect, useState } from "react";
import { FileManager as FileManager2 } from "@cubone/react-file-manager";
import "@cubone/react-file-manager/dist/style.css";
import AutoDownloadTasks from "./AutoDownloadTasks";

import AddAutoDownload from "./fileManager/AddAutoDownload";
import DownloadsDialog from "./autoDownload/DownloadsDialog";
import { Context } from "../../../../context/context";
import { useLocation, useParams } from "react-router";

const FileManager = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { id: deviceId } = useParams();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isDownloadListOpen, setDownloadListOpen] = useState(false);
  const [isDownloadingDialogOpen, setIsDownloadingDialogOpen] = useState(false);
  const [folderPath, setFolderPath] = useState("");

  const [loadedPaths, setLoadedPaths] = useState(new Set());
  const context = useContext(Context);
  const language = context?.selectedLang;
  // const handleOpen = async (file, forceRefresh = false) => {

  //   setFolderPath(file.path);

  //   try {
  //     setError("");
  //     setLoading(true);

  //     const fileDetails = await getPathFiles(deviceId, file.path);

  //     if (!Array.isArray(fileDetails)) {
  //       console.warn("fileDetails is not an array:", fileDetails);
  //       setError("Invalid file data received.");
  //       return;
  //     }

  //     setFiles((prevFiles) => {
  //       const newPath = file.path;
  //       const cleaned = prevFiles.filter(
  //         (f) => !f.path.startsWith(newPath + "/")
  //       );
  //       return [...cleaned, ...fileDetails];
  //     });

  //     setLoadedPaths((prevPaths) => new Set([...prevPaths, file.path]));
  //   } catch (error) {
  //     console.error("Error fetching data:", error);
  //     setError("Failed to fetch data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleRefresh = async () => {
  //   setFiles([{ name: "sdcard", isDirectory: true, path: "/sdcard" }]);
  //   setLoadedPaths(new Set());
  //   await handleOpen({ path: "/sdcard" }, true);
  // };
  // const location = useLocation();

  // useEffect(() => {
  //   setFiles([{ name: "sdcard", isDirectory: true, path: "/sdcard" }]); // clear file list when route changes
  // }, [location.pathname]);
  // const handlePaste = async (files, destinationFolder, operationType) => {
  //   try {
  //     setError("");
  //     setLoading(true);

  //     // Check if the destination folder is valid

  //     if (operationType === "copy") {
  //       await Promise.all(
  //         files.map(async (file) => {

  //           await copyFiletoPath(deviceId, file.path, destinationFolder.path);
  //         })
  //       );
  //     } else if (operationType === "move") {
  //       await Promise.all(
  //         files.map(async (file) => {

  //           await moveFiletoPath(deviceId, file.path, destinationFolder.path);
  //         })
  //       );
  //     }

  //     await handleOpen(destinationFolder, true);
  //     // Refresh destination folder after copy/move
  //   } catch (error) {
  //     console.error("Error pasting files:", error);
  //     setError("Failed to paste files.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDelete = async (files) => {
  //   try {
  //     setError("");
  //     setLoading(true);

  //     await Promise.all(
  //       files.map(async (file) => {
  //         try {

  //           await deleteFile(deviceId, file.path);

  //           // Remove from UI state
  //           setFiles((prevFiles) =>
  //             prevFiles.filter((f) => f.path !== file.path)
  //           );
  //         } catch (error) {
  //           console.error(`Error deleting ${file.path}:`, error);
  //         }
  //       })
  //     );
  //   } catch (error) {
  //     console.error("Error deleting files:", error);
  //     setError("Failed to delete files.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleDownload = async (files) => {

  //   try {
  //     setError("");
  //     setLoading(true);

  //     // Filter out directories first
  //     const downloadableFiles = files.filter((file) => !file.isDirectory);

  //     if (downloadableFiles.length === 0) {
  //       setError(
  //         "Please select at least one file to download. Folders are not allowed."
  //       );
  //       return;
  //     }

  //     for (const file of downloadableFiles) {

  //       await downloadFile(deviceId, file.path, file.name);
  //     }
  //   } catch (error) {
  //     console.error("Error downloading data:", error);
  //     setError("Failed to download data.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const handleOpenAutoDownload = () => {
  //   setAddDialogOpen(true);
  // };

  // const handleOpenDownloads = () => {
  //   setIsDownloadingDialogOpen(true);
  // };

  // const handleAddAutoDownload = async (newAutoDownload) => {
  //   try {
  //     setLoading(true);

  //     const response = await schedualdownload(
  //       deviceId,
  //       newAutoDownload.path,
  //       newAutoDownload.originalFromDate,
  //       newAutoDownload.fromDate,
  //       newAutoDownload.interval,
  //       newAutoDownload.intervalType
  //     );

  //     if (response) {
  //       setLoading(false);
  //     }
  //     setAddDialogOpen(false);
  //   } catch (error) {
  //     setError("Failed to Schedual Download. Please try again.");
  //     setLoading(false);
  //   }
  // };
  // const handleDownloadList = async () => {
  //   setDownloadListOpen(true);
  // };

  return (
    <div className="tab-content">
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div className="action-buttons-container">
        <button className="btn">
          <i className="fa-solid fa-robot"></i>
        </button>
        <button className="btn">
          <i className="fa-solid fa-file-arrow-down"></i>
        </button>
        <button className="btn">
          <i className="fa-solid fa-list-check"></i>
        </button>
      </div>
      <div className="dark-mode">
        <FileManager2
          primaryColor="#007bff"
          enableFilePreview={false}
          // files={fileList}
          // onFileOpen={(s) => {
          //   handleOpen(s);
          // }}
          // onRefresh={() => {
          //   handleRefresh();
          // }}
          // onPaste={(files, destinationFolder, operationType) => {
          //   handlePaste(files, destinationFolder, operationType);
          // }}
          // onDelete={(file) => {
          //   handleDelete(file);
          // }}
          // onDownload={(file) => {
          //   handleDownload(file);
          // }}
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
        // onSave={handleAddAutoDownload}
      />

      <DownloadsDialog
        isOpen={isDownloadingDialogOpen}
        id={deviceId}
        onClose={() => setIsDownloadingDialogOpen(false)}
      />
    </div>
  );
};

export default FileManager;
