import { useContext, useEffect, useState } from "react";
import "./EditCallLogDialog.css";
import { Context } from "../../../../../context/context";

const EditDialog = ({ isOpen, callLog, onClose, onSave }) => {
  const [phoneNumber, setPhoneNumber] = useState();
  const [callType, setCallType] = useState();
  const [callDate, setCallDate] = useState();
  const [callDuration, setCallDuration] = useState();

  useEffect(() => {
    setPhoneNumber(callLog?.PhoneNumber || "");
    setCallType(callLog?.Type || "");
    setCallDate(callLog?.Date || "");
    setCallDuration(callLog?.Duration || "");
  }, [callLog?.PhoneNumber, callLog?.Type, callLog?.Date, callLog?.Duration]);

  const handleSave = () => {
    onSave({
      ...callLog,
      PhoneNumber: phoneNumber,
      Type: callType,
      Date: callDate,
      Duration: callDuration,
    });
  };
  const context = useContext(Context);
  const language = context?.selectedLang;

  if (!isOpen) return null;
  return (
    <div className="dialog-overlay">
      <div className="dialog-content">
        <h3> {language?.devices?.edit_call_log}</h3>
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
            <option value="2">{language?.devices?.outgoing}</option>
            <option value="3">{language?.devices?.missed}</option>
          </select>
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
