import { useState, useEffect, useCallback, useContext } from "react";
import "./ReportDevice.css";
import { Context } from "../../../../context/context";

const ReportDevice = () => {
  const [inputData, setInputData] = useState({
    picture: "",
    systemName: "",
    firstName: "",
    surname: "",
    fatherName: "",
    motherName: "",
    placeOfBirth: "",
    dateOfBirth: "",
    gender: "",
    currentResidence: "",
    maritalStatus: "",
    educationalStatus: "",
    financialStatus: "",
    affiliation: "",
    work: "",
    workplace: "",
    job: "",
    phoneNumber: "",
    accounts: "",
    status: "",
    dateOfEntry: "",
    dateOfExit: "",
    group: "",
    user: "",
    note: "",
    report: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // const fetchReport = useCallback(async () => {
  //   if (!deviceId) return;

  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const data = await getReportAsync(deviceId);

  //     setInputData(data);
  //   } catch (error) {
  //     console.error("Failed to fetch report info:", error);
  //     setError("Failed to load report information. Please try again.");
  //     setInputData({});
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [deviceId]);

  // useEffect(() => {
  //   fetchReport();
  // }, [fetchReport]);

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (name.includes("date")) {
  //     // Format the date value to 'yyyy-MM-dd'
  //     const formattedDate = new Date(value).toISOString().split("T")[0];
  //     setInputData((prevState) => ({
  //       ...prevState,
  //       [name]: formattedDate,
  //     }));
  //   } else {
  //     setInputData((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   }
  // };

  // const handleSubmit = async () => {
  //   try {
  //     const response = await updateReportAsync(inputData);
  //     setSuccessMessage("Report updated successfully!");
  //     setError(null);
  //   } catch (error) {
  //     console.error("Failed to update report:", error);
  //     setError("Failed to update the report. Please try again.");
  //   }
  // };
  const context = useContext(Context);
  const language = context?.selectedLang;
  if (loading) return <p>Loading report data...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="report-container">
      <h2 className="report-title"> {language?.devices?.user_report}</h2>

      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}

      <div className="report-form">
        <div className="form-grid">
          <div className="form-group">
            <label>{language?.devices?.picture_url}</label>
            <input
              type="text"
              name="picture"
              value={inputData.picture || ""}
              // onChange={handleChange}
              placeholder={language?.devices?.picture_url_placeholder}
            />
          </div>

          {[
            language?.devices?.system_name,
            language?.devices?.first_name,
            language?.devices?.sur_name,
            language?.devices?.father_name,
            language?.devices?.mother_name,
            language?.devices?.place_ofBirth,
            language?.devices?.cuurent_residence,
            language?.devices?.affiliation,
            language?.devices?.work,
            language?.devices?.workpalce,
            language?.devices?.job,
            language?.devices?.phoneNumber,
            language?.devices?.accounts,
            language?.devices?.group,
            language?.devices?.user,
            language?.devices?.note,
          ].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, " $1")}: </label>
              <input
                type="text"
                name={field}
                value={inputData[field] || ""}
                // onChange={handleChange}
                placeholder={`${field}`}
              />
            </div>
          ))}

          {[
            language?.devices?.datOfBirth,
            language?.devices?.dateOfEntry,
            language?.devices?.dateOfExit,
          ].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, " $1")}: </label>
              <input
                type="date"
                name={field}
                value={inputData[field] ? inputData[field] : ""}
                // onChange={handleChange}
              />
            </div>
          ))}

          {[
            {
              name: language?.devices?.gender,
              options: [language?.devices?.male, language?.devices?.female],
            },
            {
              name: language?.devices?.status,
              options: [language?.devices?.active, language?.devices?.inactive],
            },
            {
              name: language?.devices?.martial_status,
              options: [
                language?.devices?.single,
                language?.devices?.married,
                language?.devices?.divorced,
                language?.devices?.widowed,
              ],
            },
            {
              name: language?.devices?.educational_status,
              options: [
                language?.devices?.None,
                language?.devices?.Primary,
                language?.devices?.Secondary,
                language?.devices?.University,
                language?.devices?.Postgraduate,
              ],
            },
            {
              name: language?.devices?.financial_status,
              options: [
                language?.devices?.low,
                language?.devices?.meduim,
                language?.devices?.high,
              ],
            },
          ].map(({ name, options }) => (
            <div className="form-group" key={name}>
              <label>{name.replace(/([A-Z])/g, " $1")}: </label>
              <select
                name={name}
                value={inputData[name] || ""}
                // onChange={handleChange}
              >
                <option value="">{name.replace(/([A-Z])/g, " $1")}</option>
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/** Report Section at the Bottom **/}
      <div className="report-textarea">
        <label> {language?.devices?.report} </label>
        <textarea
          name="report"
          value={inputData.report || ""}
          // onChange={handleChange}
          placeholder={language?.devices?.report_placeHolder}
        ></textarea>
      </div>

      {/** Submit Button **/}
      <div className="submit-container">
        <button className="btn">{language?.devices?.submit}</button>
      </div>
    </div>
  );
};

export default ReportDevice;
