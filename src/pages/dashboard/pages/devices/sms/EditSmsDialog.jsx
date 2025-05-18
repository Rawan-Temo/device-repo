import { useContext, useEffect, useState } from "react";
import "./EditSmsDialog.css";
import { Context } from "../../../../../context/context";

const EditDialog = ({ isOpen, message, onClose, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [messageBody, setMessageBody] = useState();
  const [messageDate, setMessageDate] = useState();

  useEffect(() => {
    setPhoneNumber(message?.PhoneNumber || "");
    setMessageBody(message?.Message || "");
    setMessageDate(message?.Date || "");
  }, [message?.PhoneNumber, message?.Message, message?.Date]);

  const handleSave = () => {
    onSave({
      ...message,
      PhoneNumber: phoneNumber,
      Message: messageBody,
      Date: messageDate,
    });
  };
  const context = useContext(Context);

  const language = context?.selectedLang;
  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3> {language?.devices?.edit_message}</h3>
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
