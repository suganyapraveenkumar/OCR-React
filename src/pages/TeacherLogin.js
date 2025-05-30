import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function TeacherLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^[0-9]+$/.test(userId)) {
      setError("User ID must be a valid number.");
      return;
    }

    if (!password) {
      setError("Password cannot be empty.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          password,
          role: "teacher",
        }),
      });

      const result = await response.json();

      if (response.ok && result.isValid) {
        if (result.role === "teacher") {
          navigate("/teacher-home", {
            state: { userId, role: result.role },
          });
        } else {
          setError("This is not a teacher account.");
        }
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <section className="login-page">
      <div className="container">
        <div className="login-container">
          <div className="circle circle-one"></div>
          <div className="form-container">
            <img
              src="https://raw.githubusercontent.com/hicodersofficial/glassmorphism-login-form/master/assets/illustration.png"
              alt="illustration"
              className="illustration"
            />
            <h1 className="opacity">Teacher Login</h1>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                placeholder="USERNAME"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <input
                type="password"
                placeholder="PASSWORD"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button type="submit" className="opacity">SUBMIT</button>
              {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
            </form>
          </div>
          <div className="circle circle-two"></div>
        </div>
      </div>
    </section>
  );
}
