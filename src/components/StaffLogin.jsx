import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing icons for show/hide

function StaffLogin() {
  const [values, setValues] = useState({
    email: '',
    password: ''
  });
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    // Check if there's a saved email in localStorage when the component mounts
    const savedEmail = localStorage.getItem('staffEmail');
    if (savedEmail) {
      setValues(prevValues => ({ ...prevValues, email: savedEmail }));
      setRememberMe(true); // Pre-select "Remember Me" if email is found
    }
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!agree) {
      setError("You must agree to the Terms and Conditions before submitting.");
      return;
    }

    setError(""); // Clear any previous error

    axios.post('http://localhost:5000/staff/staff_login', values)
      .then(result => {
        if (result.data.loginStatus) {
          // Save email in localStorage if "Remember Me" is checked
          if (rememberMe) {
            localStorage.setItem('staffEmail', values.email);
          } else {
            localStorage.removeItem('staffEmail');
          }

          navigate('/staff_detail/' + result.data.id);
        } else {
          setError(result.data.Error || "Login failed");
        }
      })
      .catch(err => {
        console.error('Login error:', err);
        setError("An error occurred during login.");
      });
  };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
      <div className='p-3 rounded w-25 border loginForm'>
        <h2>Login Page</h2>

        {error && <div className="text-danger mb-3">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className='mb-3'>
            <label htmlFor="email"><strong>Email:</strong></label>
            <input
              type="email"
              name="email"
              autoComplete="off"
              placeholder="Enter Email"
              value={values.email}
              onChange={(e) => setValues({ ...values, email: e.target.value })}
              className='form-control rounded-0'
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
                value={values.password}
                onChange={(e) => setValues({ ...values, password: e.target.value })}
                className='form-control rounded-0'
              />
              <div
                className="input-group-append"
                onClick={() => setShowPassword(!showPassword)}
                style={{ cursor: 'pointer' }}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </div>
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
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="rememberMeCheck"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label className="form-check-label" htmlFor="rememberMeCheck">
              Remember Me
            </label>
          </div>

          <button
            type="submit"
            className='btn btn-success w-100 rounded-0'
            disabled={!agree || !values.email || !values.password} // Disable if fields are empty or terms not agreed
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffLogin;
