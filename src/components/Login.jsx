import React, { useState } from "react";
import "./styles.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";

const Login = () => {
  const [values, setValues] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!agree) {
      setError("You must agree to the Terms and Conditions.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axios.post(
        "https://mombasa-backend-1.onrender.com/admin/adminlogin",
        values
      );

      const token = res.data?.token;

      if (!token) {
        setError(res.data?.error || "Login failed");
        return;
      }

      // Safe decode (avoids crash if token is invalid)
      let user = null;
      try {
        user = JSON.parse(atob(token.split(".")[1]));
      } catch (err) {
        console.warn("Token decode failed:", err);
      }

      localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));

      // Redirect logic
      const role = user?.role;

      if (role === "admin") {
        navigate("/dashboard");
      } else if (role === "staff") {
        navigate("/staff");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.Error ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 loginPage">
      <div className="p-4 rounded border loginForm w-25">
        <h2 className="mb-3">Login</h2>

        {error && (
          <div className="alert alert-danger py-2">{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              className="form-control rounded-0"
              value={values.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label><strong>Password</strong></label>

            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                className="form-control rounded-0"
                value={values.password}
                onChange={handleChange}
                required
              />

              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i
                  className={`fa ${
                    showPassword ? "fa-eye-slash" : "fa-eye"
                  }`}
                />
              </span>
            </div>

            <div className="mt-1">
              <a
                href="/forgot-password"
                className="text-decoration-none"
                style={{ fontSize: "0.9rem" }}
              >
                Forgot Password?
              </a>
            </div>
          </div>

          {/* TERMS */}
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsCheck"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
            />
            <label className="form-check-label" htmlFor="termsCheck">
              I agree to the{" "}
              <a href="/terms" target="_blank" rel="noreferrer">
                Terms and Conditions
              </a>
            </label>
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="btn btn-success w-100 rounded-0"
            disabled={!agree || loading}
          >
            {loading ? "Logging in..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;