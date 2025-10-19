import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditStaff = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    password: "", // Optional, only filled if user wants to change it
    salary: "",
    address: "",
    category: "",
  });

  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);

    // Fetch categories
    axios.get('https://mombasa-backend.onrender.com/admin/category')
      .then(res => {
        if (res.data.Status) {
          setCategoryList(res.data.Result || []);
        } else {
          setError(res.data.Error || 'No categories found.');
        }
      })
      .catch(err => {
        console.error('Category Error:', err);
        setError('Error fetching categories.');
      });

    // Fetch staff data
    axios.get(`https://mombasa-backend.onrender.com/admin/staff/${id}`)
      .then(res => {
        if (res.data.Status) {
          const fetched = res.data.Result;
          setStaff({
            name: fetched.name || "",
            email: fetched.email || "",
            password: "", // Do not pre-fill password
            salary: fetched.salary || "",
            address: fetched.address || "",
            category: fetched.category || "",
          });
        } else {
          setError(res.data.Error || 'Staff not found.');
        }
      })
      .catch(err => {
        console.error('Staff Error:', err);
        setError('Error fetching staff data.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setStaff(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedStaff = { ...staff };
      if (!updatedStaff.password) {
        delete updatedStaff.password; // Only send password if filled
      }

      const res = await axios.put(`https://mombasa-backend.onrender.com/admin/staff/${id}`, updatedStaff);
      if (res.data.Status) {
        navigate('/dashboard/staff');
      } else {
        setError(res.data.Error || 'Update failed.');
      }
    } catch (err) {
      console.error('Update Error:', err);
      setError('Error updating staff.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-3 rounded w-50 border">
        <h3 className="text-center mb-3">Edit Staff</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form className="row g-2" onSubmit={handleSubmit}>
          <div className="col-12">
            <label><strong>Name</strong></label>
            <input
              name="name"
              type="text"
              className="form-control"
              value={staff.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label><strong>Email</strong></label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={staff.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <label><strong>New Password (optional)</strong></label>
            <input
              name="password"
              type="password"
              className="form-control"
              placeholder="Leave empty to keep current password"
              value={staff.password}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label><strong>Salary</strong></label>
            <input
              name="salary"
              type="text"
              className="form-control"
              value={staff.salary}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label><strong>Address</strong></label>
            <input
              name="address"
              type="text"
              className="form-control"
              value={staff.address}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <label><strong>Category</strong></label>
            <input
              name="category"
              list="categoryOptions"
              className="form-control"
              value={staff.category}
              onChange={handleChange}
            />
            <datalist id="categoryOptions">
              {categoryList.map(cat => (
                <option key={cat._id || cat.id} value={cat.name || cat.category} />
              ))}
            </datalist>
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success w-100" disabled={loading}>
              {loading ? 'Updating...' : 'Update Staff'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaff;
