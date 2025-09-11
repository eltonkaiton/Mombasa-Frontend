import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddStaff = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [salary, setSalary] = useState('');
  const [address, setAddress] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://mombasa-backend.onrender.com/admin/category')
      .then((res) => {
        if (res.data.Status) {
          setCategoryList(res.data.Result || []);
        } else {
          setError(res.data.Error || 'Failed to fetch categories.');
        }
      })
      .catch(() => setError('Error fetching categories.'))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !salary || !address || !selectedCategory) {
      alert('Please fill in all fields');
      return;
    }

    const staffData = {
      name: name.trim(),
      email: email.trim(),
      password,
      salary: parseFloat(salary),
      address: address.trim(),
      category: selectedCategory.trim()
    };

    try {
      const response = await axios.post('https://mombasa-backend.onrender.com/admin/add_staff', staffData);
      if (response.data.Status) {
        alert('Staff added successfully!');
        navigate('/dashboard/staff');
      } else {
        alert(response.data.Error || 'Failed to add staff');
      }
    } catch (err) {
      console.error(err);
      alert('Server error. Could not add staff.');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="p-4 bg-white rounded shadow w-50">
        <h3 className="text-center mb-4">Add Staff</h3>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-12">
            <label className="form-label"><strong>Name</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <label className="form-label"><strong>Salary</strong></label>
            <input
              type="number"
              className="form-control"
              placeholder="Enter salary"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label"><strong>Address</strong></label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label"><strong>Category</strong></label>
            {loading ? (
              <p>Loading categories...</p>
            ) : (
              <>
                <input
                  list="categoryOptions"
                  className="form-control"
                  placeholder="Type or select category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
                <datalist id="categoryOptions">
                  {categoryList.map((cat) => (
                    <option key={cat._id || cat.id} value={cat.category || cat.name} />
                  ))}
                </datalist>
              </>
            )}
          </div>

          <div className="col-12">
            <button type="submit" className="btn btn-success w-100">
              Add Staff
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStaff;
