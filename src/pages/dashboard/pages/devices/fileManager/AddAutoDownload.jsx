import { useContext, useEffect, useState } from "react";
import "./AddAutoDownload.css";
import { Context } from "../../../../../context/context";

const AddDialog = ({ isOpen, folderPath, onClose, onSave }) => {
  const [path, setPath] = useState();
  const [interval, setInterval] = useState(1);
  const [intervalType, setIntervalType] = useState("Minute");
  const [fromDate, setFromDate] = useState();
  const [error, setError] = useState(null);
  const context = useContext(Context);
  const language = context?.selectedLang;
  useEffect(() => {
    setPath(folderPath);
  }, [folderPath]);

  const handleSave = () => {
    if (!path.trim()) {
      setError("Path is required.");
      return;
    }

    const newTask = {
      path: path,
      interval: parseInt(interval, 10),
      intervalType: intervalType,
      fromDate: fromDate,
      originalFromDate: fromDate,
    };

    onSave(newTask);

    // Reset form fields
    setPath("");
    setInterval(1);
    setIntervalType("Minute");
    setFromDate("");
    setError(null);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{language?.devices?.add_to_auto_download}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}

        <div className="form-group">
          <label>{language?.devices?.path}</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{language?.devices?.refresh_interval}</label>
          <input
            type="number"
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>{language?.devices?.refresh_type}</label>
          <select
            value={intervalType}
            onChange={(e) => setIntervalType(e.target.value)}
          >
            <option value="Minute">{language?.devices?.minute}</option>
            <option value="Hour">{language?.devices?.hour}</option>
            <option value="Day">{language?.devices?.day}</option>
          </select>
        </div>

        <div className="form-group">
          <label>{language?.devices?.from_date}</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>

        <div className="form-group checkbox-group"></div>

        <div className="dialog-actions">
          <button onClick={onClose} className="btn">
            {language?.devices?.cancel}
          </button>
          <button onClick={handleSave} className="btn">
            {language?.devices?.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddDialog;
