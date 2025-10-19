import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Category = () => {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true); // Track loading state
  const [error, setError] = useState(''); // Track errors

  useEffect(() => {
    axios.get('https://mombasa-backend.onrender.com/admin/category')
      .then(result => {
        console.log(result.data); // Inspect structure

        if (!result.data.Status) {
          setError(result.data.Error || 'No categories found.');
          return;
        }

        const items = Array.isArray(result.data.Result) ? result.data.Result : [];
        setCategory(items);
      })
      .catch(err => {
        console.error('Request Error:', err);
        setError('Error fetching categories.');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center mb-3">
        <h3 className="fw-bold">Category List</h3>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="alert alert-danger text-center">{error}</div>}

      <div className="text-end mb-3">
        <Link to="/dashboard/add_category" className="btn btn-success">
          Add Category
        </Link>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {category.length > 0 ? (
            category.map((c, index) => (
              <tr key={c._id}>
                <td>{index + 1}</td>
                <td>{c.category}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="text-center">No categories found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Category;
