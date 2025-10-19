import React, { useState } from "react";
import './styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';

const Login = () => {
  const [values, setValues] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!agree) {
      setError("You must agree to the Terms and Conditions before submitting.");
      return;
    }

    setError("");

    try {
      const res = await axios.post('http://localhost:5000/admin/adminlogin', values); // ✅ Adjust if your route has changed

      if (res.data.loginStatus || res.data.token) {
        const { token } = res.data;

        // ✅ Optionally decode the token if needed:
        const user = JSON.parse(atob(token.split('.')[1])); // or use jwt-decode

        // Store token (localStorage or cookie — here using localStorage)
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect based on role (if present in token)
        if (user.role === 'admin') {
          navigate('/dashboard');
        } else if (user.role === 'staff') {
          navigate('/staff');
        } else {
          navigate('/home');
        }
      } else {
        setError(res.data.Error || "Login failed");
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        {error && <div className="text-danger mb-2">{error}</div>}

        <h2>Login Page</h2>
        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className='form-control rounded-0'
              required
            />
          </div>

          <div className='mb-3'>
            <label htmlFor="password"><strong>Password:</strong></label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="off"
                placeholder="Enter Password"
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className='form-control rounded-0'
                required
              />
              <span
                className="input-group-text bg-white"
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
            <div className="mt-1">
              <a href="/forgot-password" className="text-decoration-none text-primary" style={{ fontSize: "0.9rem" }}>
                Forgot Password?
              </a>
            </div>
          </div>

          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="termsCheck"
              checked={agree}
              onChange={() => setAgree(!agree)}
            />
            <label className="form-check-label" htmlFor="termsCheck">
              I agree to the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a>
            </label>
          </div>

          <button
            type="submit"
            className='btn btn-success w-100 rounded-0'
            disabled={!agree}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
