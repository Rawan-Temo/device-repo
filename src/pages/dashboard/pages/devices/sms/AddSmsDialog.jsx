import { useContext, useState } from "react";
import "./AddSmsDialog.css";
import { Context } from "../../../../../context/context";

const AddDialog = ({ isOpen, onClose, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [messageDate, setMessageDate] = useState("");
  const [messageType, setMessageType] = useState("");

  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!phoneNumber.trim() || !messageBody.trim()) {
      setError("Name and Phone are required.");
      return;
    }

    const newMessage = {
      PhoneNumber: phoneNumber,
      Message: messageBody,
      Date: messageDate,
      Type: messageType,
    };

    onSave(newMessage);
    setPhoneNumber("");
    setMessageBody("");
    setMessageDate("");
    setMessageType("");
    setError(null);
    onClose();
  };
  const context = useContext(Context);

  const language = context?.selectedLang;
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{language?.devices?.add_new_message}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="form-group">
          <label>{language?.devices?.phoneNumber}</label>
          <input
            type="number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.message}</label>
          <input
            type="text"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.date}</label>
          <input
            type="datetime-local"
            value={messageDate}
            onChange={(e) =>
              setMessageDate(e.target.value.replace("T", " ") + ":00")
            }
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.type}</label>
          <select
            value={messageType}
            onChange={(e) => setMessageType(e.target.value)}
            className="form-control"
          >
            <option value="" disabled>
              {language?.devices?.select_type}
            </option>
            <option value="1">{language?.devices?.outgoing}</option>
            <option value="2"> {language?.devices?.incoming}</option>
          </select>
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
