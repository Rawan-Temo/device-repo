import { useContext, useEffect, useState } from "react";
import "./EditContactDialog.css";
import { Context } from "../../../../../context/context";

const EditDialog = ({ isOpen, contact, onClose, onSave }) => {
  const [name, setName] = useState();
  const [phone, setPhone] = useState();

  useEffect(() => {
    setName(contact?.Name || "");
    setPhone(contact?.Phone || "");
  }, [contact?.Name, contact?.Phone]);

  const handleSave = () => {
    onSave({ ...contact, Name: name, Phone: phone });
  };
  const context = useContext(Context);
  const language = context?.selectedLang;
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3>{language?.devices?.edit_contact}</h3>
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
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="dialog-buttons">
          <button onClick={onClose} className="reload-button">
            {language?.devices?.cancel}
          </button>
          <button onClick={handleSave} className="reload-button">
            {language?.devices?.save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditDialog;
