import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddCategory = () => {
  const [category, setCategory] = useState('');
  const navigate = useNavigate(); // ✅ Added navigate

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/admin/add_category', { category }) // ✅ Updated URL
      .then(result => {
        if (result.data.Status) {
          navigate('/dashboard/category'); // ✅ Redirect on success
        } else {
          alert(result.data.Error);
        }
      })
      .catch(err => console.error("Error adding category:", err));
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-4 rounded border" style={{ width: '300px' }}>
        <h3 className="text-center mb-3">Add Category</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="category">
              <strong>Category:</strong>
            </label>
            <input
              type="text"
              name="category"
              id="category"
              placeholder="Enter Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-control rounded"
              required
            />
          </div>
          <div className="text-center">
            <button type="submit" className="btn btn-success px-4">
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCategory;
