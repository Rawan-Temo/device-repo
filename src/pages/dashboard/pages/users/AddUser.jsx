import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import "./user.css";
import { Context } from "../../../../context/context";
import { addUser } from "../../../../apiService";
import Loading from "../../../../components/loader/Loading";

const AddUser = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "",
    password: "",
    conf_password: "",
    is_superadmin: false,
    role: "",
  });
  const context = useContext(Context);
  const language = context?.selectedLang;
  const [passwordError, setPasswordError] = useState("");
  const [confPasswordError, setConfPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPasswordError(validatePassword(value));
      setUserData((prevState) => ({ ...prevState, [name]: value }));
      // Also check confirm password if already entered
      if (userData.conf_password) {
        setConfPasswordError(
          value !== userData.conf_password ? "Passwords do not match" : ""
        );
      }
      return;
    }
    if (name === "conf_password") {
      setConfPasswordError(
        value !== userData.password ? "Passwords do not match" : ""
      );
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
      return "Password must be at least 8 characters.";
    if (!uppercase.test(password))
      return "Password must contain at least one uppercase letter.";
    if (!lowercase.test(password))
      return "Password must contain at least one lowercase letter.";
    if (!number.test(password))
      return "Password must contain at least one number.";
    if (!specialChar.test(password))
      return "Password must contain at least one special character.";
    return ""; // No errors
  };

  const handleClick = (e) => {
    e.stopPropagation();
    e.target.classList.toggle("active");
  };
  const handleDropdownSelect = (e, type) => {
    const selectedValue =
      e.target.textContent.trim() === language?.users?.admin;
    setUserData((prevState) => ({
      ...prevState,
      is_superadmin: selectedValue,
      role: e.target.textContent.trim(),
    }));
    const inpElement = e.target.closest(".selecte").querySelector(".inp");
    inpElement.classList.remove("active");
  };
  const handleAddUser = async (e) => {
    e.preventDefault();
    if (passwordError || confPasswordError) return;
    if (!userData.username || !userData.password || !userData.conf_password) {
      alert("Please fill all fields.");
      return;
    }
    if (userData.password !== userData.conf_password) {
      setConfPasswordError("Passwords do not match");
      return;
    }
    setIsLoading(true);
    try {
      const submitData = { ...userData };
      delete submitData.conf_password;
      delete submitData.role;
      await addUser(submitData);
      alert("User added successfully.");
      navigate("/users/manage-users");
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Error adding user.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-user-form">
      {isLoading && <Loading />}
      <h2>Add User</h2>
      <form>
        {/* User Information */}
        <div className="form-group-user two-divs">
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleInputChange}
              placeholder="Enter username"
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
            {confPasswordError && (
              <p className="error-text">{confPasswordError}</p>
            )}
          </div>

          <div className="selecte">
            <label>Role:</label>
            <div onClick={handleClick} className="inp">
              {userData.role || language?.users?.select_role}
            </div>
            <article>
              <h2 onClick={(e) => handleDropdownSelect(e, "is_superadmin")}>
                {language?.users?.admin}
              </h2>
              <h2 onClick={(e) => handleDropdownSelect(e, "is_superadmin")}>
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
          onClick={handleAddUser}
        >
          {language?.users?.add_user}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
