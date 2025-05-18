import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import "./user.css";
import { Context } from "../../../../context/context";

const AddUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    conf_password: "",
    group: "",
    role: "",
    permissions: [],
    devices: [],
  });
  const context = useContext(Context);
  const language = context?.selectedLang;
  const [passwordError, setPasswordError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "password") {
      setPasswordError(validatePassword(value));
    }

    setUserData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const uppercase = /[A-Z]/;
    const lowercase = /[a-z]/;
    const number = /[0-9]/;
    const specialChar = /[!@#$%^&*]/;

    if (!minLength.test(password))
      return language?.users?.password_must_B8chars;
    if (!uppercase.test(password)) return language?.users?.password_must_1Upper;
    if (!lowercase.test(password)) return language?.users?.password_must_1Lower;
    if (!number.test(password)) return language?.users?.password_must_1Number;
    if (!specialChar.test(password))
      return language?.users?.password_must_1Special;

    return ""; // No errors
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const handleDropdownSelect = (e, type) => {
    const selectedValue = e.target.textContent.trim();
    setUserData((prevState) => ({
      ...prevState,
      [type]: selectedValue,
    }));
    const inpElement = e.target.closest(".selecte").querySelector(".inp");
    inpElement.classList.remove("active");
  };

  return (
    <div className="add-user-form">
      <h2>{language?.users?.add_user}</h2>
      <form>
        {/* User Information */}
        <div className="form-group-user two-divs">
          <div>
            <label htmlFor="email">{language?.users?.email}</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleInputChange}
              placeholder={language?.users?.email_placeholder}
              required
            />
          </div>

          <div>
            <label htmlFor="password">{language?.users?.password}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleInputChange}
              placeholder={language?.users?.password_placeholder}
              required
            />
            {passwordError && <p className="error-text">{passwordError}</p>}
          </div>
          <div>
            <label htmlFor="conf_password">
              {language?.users?.confirm_password}
            </label>
            <input
              type="password"
              name="conf_password"
              value={userData.conf_password}
              onChange={handleInputChange}
              placeholder={language?.users?.confirm_password_palceholder}
              required
            />
          </div>

          <div className="selecte">
            <label>Role:</label>
            <div onClick={handleClick} className="inp">
              {userData.role || language?.users?.select_role}
            </div>
            <article>
              <h2 onClick={(e) => handleDropdownSelect(e, "role")}>
                {language?.users?.admin}
              </h2>
              <h2 onClick={(e) => handleDropdownSelect(e, "role")}>
                {language?.users?.user}
              </h2>
            </article>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="width-100 btn"
          disabled={passwordError !== ""}
        >
          {language?.users?.add_user}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
