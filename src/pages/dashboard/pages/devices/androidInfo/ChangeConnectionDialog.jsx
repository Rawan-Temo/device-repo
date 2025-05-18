import { useContext, useState } from "react";
import "./ChangeConnectionDialog.css";
import { Context } from "../../../../../context/context";

const ChangeConnectionDialog = ({ isOpen, onClose, onSave }) => {
  const [pIP, setPIP] = useState("");
  const [pPort, setPPort] = useState("");
  const [bIP, setBIP] = useState("");
  const [bPort, setBPort] = useState("");
  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!pPort.trim()) {
      setError("Name or Phone are required.");
      return;
    }

    const newRequest = {
      primaryIP: pIP,
      primaryPort: pPort,
      backupIP: bIP,
      backupPort: bPort,
    };

    onSave(newRequest);
    setPIP("");
    setPPort("");
    setBIP("");
    setBPort("");
    setError(null);
    onClose();
  };
  const context = useContext(Context);
  const language = context?.selectedLang;

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2> {language?.devices?.change_connction_properties}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="form-group">
          <label>{language?.devices?.primary_domain}</label>
          <input type="text" onChange={(e) => setPIP(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{language?.devices?.primary_port}</label>
          <input type="number" onChange={(e) => setPPort(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{language?.devices?.backup_domain}</label>
          <input type="text" onChange={(e) => setBIP(e.target.value)} />
        </div>
        <div className="form-group">
          <label>{language?.devices?.backup_port}</label>
          <input type="number" onChange={(e) => setBPort(e.target.value)} />
        </div>
        <div className="dialog-actions">
          <button onClick={onClose} className="btn">
            {language?.devices?.cancel}
          </button>
          <button onClick={handleSave} className="btn">
            {language?.devices?.continue}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeConnectionDialog;
