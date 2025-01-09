import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import logo from "../assets/kaso_white_transparant.png";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const simulateProgress = () => {
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        navigate("/dashboard"); // Redirect once progress completes
      }
    }, 170); // Adjust speed of animation
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setProgress(0);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = response.data;

      localStorage.setItem("token", token); // Store the token in localStorage
      localStorage.setItem("user", JSON.stringify(user));

      // Simulate progress bar and navigate to dashboard
      simulateProgress();
    } catch (error) {
      setLoading(false);
      if (error.response && error.response.status === 401) {
        setError("Invalid credentials");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="login-container">
      <img src={logo} alt="Kaso" className="logo" />
      <h2>Admin Login</h2>
      <form onSubmit={handleLogin} className="login-form">
        {error && <div className="error-message">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>

      {loading && (
        <div className="loading-overlay">
          <div className="progress-container">
            <CircularProgressbar
              value={progress}
              text={`${progress}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#ff2727",
                textColor: "#ff2727",
                trailColor: "#ddd",
              })}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
