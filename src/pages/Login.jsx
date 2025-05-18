import { useState } from "react";
import { useNavigate } from "react-router";
import ParticalBackground from "../components/particles/ParticalBackground";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Redirect user after login

  const handleLogin = async (e) => {
    // e.preventDefault();
    // setError(""); // Clear previous errors
    // try {
    //   await login(email, password); // Call login function
    //   navigate("/"); // Redirect after successful login
    // } catch (err) {
    //   setError(err); // Show error message
    // }
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
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
