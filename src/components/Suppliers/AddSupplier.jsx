import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddSupplier() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: '', // ✅ Add password to form state
  });

  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/admin/suppliers', form); // ✅ Send password
      navigate('/dashboard/suppliers');
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to add supplier");
    }
  };

  return (
    <div className="container mt-4">
      <h4>Add Supplier</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name *</label>
          <input
            name="name"
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Phone *</label>
          <input
            name="phone"
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Address</label>
          <textarea
            name="address"
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Password *</label>
          <input
            name="password"
            type="password"
            className="form-control"
            required
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-success">Save</button>
      </form>
    </div>
  );
}

export default AddSupplier;
