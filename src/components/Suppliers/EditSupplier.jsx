import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EditSupplier() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    status: 'active',
    password: '', // Optional: only update if filled
  });

  useEffect(() => {
    axios.get(`https://mombasa-backend.onrender.com/admin/suppliers/${id}`)
      .then(res => {
        if (res.data?.Status) {
          const supplier = res.data.Result;
          setForm({
            name: supplier.name || '',
            email: supplier.email || '',
            phone: supplier.phone || '',
            address: supplier.address || '',
            status: supplier.status || 'active',
            password: '', // Never pre-fill password
          });
        } else {
          alert("Supplier not found");
        }
      })
      .catch(err => {
        console.error(err);
        alert("Failed to load supplier");
      });
  }, [id]);

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const updatedForm = { ...form };
      if (!form.password) {
        delete updatedForm.password; // Don't send if empty
      }
      await axios.put(`https://mombasa-backend.onrender.com/admin/suppliers/${id}`, updatedForm);
      navigate('/dashboard/suppliers');
    } catch (err) {
      console.error(err);
      alert("Update failed");
    }
  };

  return (
    <div className="container mt-4">
      <h4>Edit Supplier</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-2">
          <label>Name</label>
          <input
            name="name"
            className="form-control"
            value={form.name}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control"
            value={form.email}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Phone</label>
          <input
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Address</label>
          <textarea
            name="address"
            className="form-control"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <div className="mb-2">
          <label>Status</label>
          <select
            name="status"
            className="form-control"
            value={form.status}
            onChange={handleChange}
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
        <div className="mb-2">
          <label>New Password (optional)</label>
          <input
            name="password"
            type="password"
            className="form-control"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button className="btn btn-primary">Update</button>
      </form>
    </div>
  );
}

export default EditSupplier;
