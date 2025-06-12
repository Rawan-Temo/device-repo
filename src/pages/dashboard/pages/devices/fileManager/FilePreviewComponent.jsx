import { useContext, useEffect, useState } from "react";
import { WebSocketContext } from "../../../../../context/WebSocketProvider";
import { useParams } from "react-router";

const getMimeType = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const mimeTypes = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    mp4: "video/mp4",
    webm: "video/webm",
    ogg: "video/ogg",
  };
  return mimeTypes[ext] || "";
};

const FilePreviewComponent = ({ file, isOpen, onClose }) => {
  const { socketRef } = useContext(WebSocketContext);
  const { id } = useParams();

  const [content, setContent] = useState("");
  const [base64Content, setBase64Content] = useState("");
  const [loading, setLoading] = useState(false);

  const isImage = file?.name.match(/\.(jpg|jpeg|png|gif|bmp|svg)$/i);
  const isVideo = file?.name.match(/\.(mp4|webm|ogg)$/i);

  useEffect(() => {
    if (!file || !isOpen) return;

    setContent("");
    setBase64Content("");
    setLoading(true);

    const socket = socketRef?.current;
    if (!socket || socket.readyState !== 1) {
      console.error("WebSocket not connected.");
      return;
    }

    const messagePayload = {
      token: localStorage.getItem("token"),
      uuid: id,
      file_operation: true,
      action: "review",
      path: file.path,
      dest: file.path,
    };

    console.log("Requesting file chunks for:", messagePayload);
    socket.send(JSON.stringify(messagePayload));

    const handleChunk = (e) => {
      try {
        const message = JSON.parse(e.data);
        if (
          message.type === "reviewFile" &&
          message.data.reviewFile.deviceUUID === id &&
          message.data.reviewFile.name === file.path
        ) {
          const { chunk, done } = message.data.reviewFile;

          if (isImage || isVideo) {
           setBase64Content((prev) => (prev || "") + (chunk || ""));
          } else {
            try {
              const decoded = atob(chunk);
              setContent((prev) => prev + decoded);
            } catch (decodeErr) {
              console.error("Base64 decode error:", decodeErr);
            }
          }

          if (done) {
            setLoading(false);
          }
        }
      } catch (parseErr) {
        console.error("Failed to parse WebSocket message:", parseErr);
      }
    };

    socket.addEventListener("message", handleChunk);

    return () => {
      socket.removeEventListener("message", handleChunk);
      setLoading(false);
    };
  }, [file, isOpen, id]);

  if (!isOpen || !file) return null;

  return (
    <div className="file-preview-overlay">
      <div className="file-preview-modal">
        <button onClick={onClose} className="file-preview-close">
          ×
        </button>
        <h3>{file.name}</h3>

        {console.log(base64Content)}
        {isImage ? (
          base64Content ? (
            <img
              src={`data:${getMimeType(file.name)};base64,${base64Content}`}
              alt={file.name}
              className="preview-media"
            />
          ) : loading ? (
            <div>Loading image preview...</div>
          ) : (
            <div>No image preview available.</div>
          )
        ) : isVideo ? (
          base64Content ? (
            <video controls className="preview-media">
              <source
                src={`data:${getMimeType(file.name)};base64,${base64Content}`}
              />
              Your browser does not support video playback.
            </video>
          ) : loading ? (
            <div>Loading video preview...</div>
          ) : (
            <div>No video preview available.</div>
          )
        ) : (
          <>
            {loading && <div>Loading text preview...</div>}
            <pre className="file-preview-text">{content}</pre>
          </>
        )}
      </div>
    </div>
  );
};

export default FilePreviewComponent;
