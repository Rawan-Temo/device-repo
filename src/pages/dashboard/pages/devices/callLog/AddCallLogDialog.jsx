import { useContext, useState } from "react";
import "./AddCallLogDialog.css";
import { Context } from "../../../../../context/context";

const AddDialog = ({ isOpen, onClose, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callType, setCallType] = useState("");
  const [callDate, setCallDate] = useState("");
  const [callDuration, setCallDuration] = useState("");

  const [error, setError] = useState(null);

  const handleSave = () => {
    if (!phoneNumber.trim() || !callDuration.trim()) {
      setError("Phone number and Duration are required.");
      return;
    }

    const newCallLog = {
      PhoneNumber: phoneNumber,
      Type: callType,
      Date: callDate,
      Duration: callDuration,
    };
    onSave(newCallLog);
    setPhoneNumber("");
    setCallDuration("");
    setCallDate("");
    setCallType("");
    setError(null);
    onClose();
  };
  const context = useContext(Context);
  const language = context?.selectedLang;
  if (!isOpen) return null;

  return (
    <div className="dialog-overlay">
      <div className="dialog">
        <h2>{language?.devices?.add_new_call_log}</h2>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <div className="form-group">
          <label>{language?.devices?.phoneNumber}</label>
          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.call_duration}</label>
          <input
            type="number"
            value={callDuration}
            onChange={(e) => setCallDuration(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.date}</label>
          <input
            type="datetime-local"
            value={callDate}
            onChange={(e) =>
              setCallDate(e.target.value.replace("T", " ") + ":00")
            }
          />
        </div>
        <div className="form-group">
          <label>{language?.devices?.type}</label>
          <select
            value={callType}
            onChange={(e) => setCallType(e.target.value)}
            className="form-control"
          >
            <option value="" disabled>
              {language?.devices?.select_type}
            </option>
            <option value="1"> {language?.devices?.incoming}</option>
            <option value="2"> {language?.devices?.outgoing}</option>
            <option value="3"> {language?.devices?.missed}</option>
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
