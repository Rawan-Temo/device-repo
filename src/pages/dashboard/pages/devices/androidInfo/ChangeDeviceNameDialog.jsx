import { useContext, useEffect, useState } from "react";
import "./ChangeConnectionDialog.css";
import { Context } from "../../../../../context/context";

const ChangeDeviceNameDialog = ({ isOpen, currentName, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    setName(currentName);
  }, [currentName]);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    onSave(name);
    setError(null);
    onClose();
  };
  const context = useContext(Context);
  const language = context?.selectedLang;
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2> {language?.devices?.change_device_name}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="form-group">
          <label> {language?.devices?.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="dialog-actions">
          <button onClick={onClose} className="action-button">
            {language?.devices?.cancel}
          </button>
          <button onClick={handleSave} className="action-button">
            {language?.devices?.change_name}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeDeviceNameDialog;
