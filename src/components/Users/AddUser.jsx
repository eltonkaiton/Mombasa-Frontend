import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddUser = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    const formData = {
      full_name: fullName.trim(),
      email: email.trim(),
      password,
      phone: phone.trim(),
    };

    try {
      const response = await axios.post('https://mombasa-backend.onrender.com/admin/add_user', formData);
      if (response.data.Status) {
        alert('User added successfully!');
        navigate('/dashboard/users/active');
      } else {
        setError(response.data.Error || 'Failed to add user.');
      }
    } catch (err) {
      console.error('Error adding user:', err);
      setError('Server error while adding user.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded border shadow w-50">
        <h3 className="text-center mb-3">Add User</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label"><strong>Full Name</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label"><strong>Email</strong></label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
            />
          </div>

          <div className="col-12">
            <label className="form-label"><strong>Phone</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter phone (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label"><strong>Password</strong></label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-primary w-100">
              Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
