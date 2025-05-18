import { useState, useEffect } from "react";
import "./AddCallerNameDialog.css";

const AddCallelrNameDialog = ({
  isOpen,
  selectedPermission,
  onClose,
  onSave,
}) => {
  const [per, setPer] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!name.trim()) {
      setError("Name or Phone are required.");
      return;
    }


    const newRequest = {
      permission: selectedPermission,
      callerName: name,
    };

    onSave(newRequest);
    setPer("");
    setName("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>Add Caller Name Or Phone Number</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="dialog-actions">
          <button onClick={onClose} className="btn">
            Cancel
          </button>
          <button onClick={handleSave} className="btn">
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCallelrNameDialog;
