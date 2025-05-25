import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import ParticalBackground from "../components/particles/ParticalBackground";
import { login } from "../apiService"; // Import the login function from your API module
import { Context } from "../context/context";
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Redirect user after login
  const { setUserInfo, userInfo } = useContext(Context); // Import the context if needed
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    try {
      const response = await login(username, password); // Call login function
      console.log("Login response:", response); // Debugging log
      console.log("Login response:", response.access); // Debugging log

      if (response.access) {
        localStorage.setItem("token", response.access); // Store JWT
        setUserInfo(response.access); // Save user info (optional)
      }
      console.log("User info after login:", userInfo); // Debugging log
      navigate("/"); // Redirect after successful login
    } catch (err) {
      setError(err); // Show error message
    }
  };

  return (
    <div className="login-background">
      <ParticalBackground />

      <div className="login-container">
        <h2>Login</h2>
        <div className="profile-log">
          <div className="icon-background">
            <i className="fa-solid fa-user"></i>
          </div>
        </div>
        {/* {error && <p className="error-message">{error}</p>} */}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn width-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
