import { useContext, useState } from "react";
import "./AddContactDialog.css";
import { Context } from "../../../../../context/context";

const AddDialog = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);
  const context = useContext(Context);
  const language = context?.selectedLang;
  const handleSave = () => {
    if (!name.trim() || !phone.trim()) {
      setError("Name and Phone are required.");
      return;
    }

    const newContact = {
      Name: name,
      Phone: phone,
      AddedDate: new Date().toLocaleString(),
    };

    onSave(newContact);
    setName("");
    setPhone("");
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{language?.devices?.add_new_contact}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="form-group">
          <label>{language?.devices?.name}</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.phoneNumber}</label>
          <input
            type="number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
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
