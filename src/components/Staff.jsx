import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://mombasa-backend.onrender.com/admin/staff')
      .then(result => {
        if (!result.data.Status) {
          setError(result.data.Error || 'No staff found.');
          return;
        }
        setStaff(result.data.Result || []);
        setFilteredStaff(result.data.Result || []);
      })
      .catch(err => {
        console.error('Request Error:', err);
        setError('Error fetching staff. Please try again later.');
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStaff(staff);
    } else {
      const lowercasedTerm = searchTerm.toLowerCase();
      const filtered = staff.filter(s =>
        s.name.toLowerCase().includes(lowercasedTerm) ||
        s.email.toLowerCase().includes(lowercasedTerm) ||
        s.address.toLowerCase().includes(lowercasedTerm) ||
        s.category.toLowerCase().includes(lowercasedTerm)
      );
      setFilteredStaff(filtered);
    }
  }, [searchTerm, staff]);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      axios.delete(`https://mombasa-backend.onrender.com/admin/delete_staff/${id}`)
        .then(result => {
          if (result.data.Status) {
            setStaff(prev => prev.filter(s => s._id !== id));
            setFilteredStaff(prev => prev.filter(s => s._id !== id));
          } else {
            setError(result.data.Error || 'Failed to delete staff.');
          }
        })
        .catch(err => {
          console.error('Delete Error:', err);
          setError('Error deleting staff. Please try again later.');
        });
    }
  };

  return (
    <div className="px-5 mt-3">
      <div className="d-flex justify-content-center mb-3">
        <h3 className="fw-bold">Employee List</h3>
      </div>

      <div className="d-flex justify-content-between mb-3">
        <Link to="/dashboard/add_staff" className="btn btn-success">
          Add Employee
        </Link>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading staff...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : filteredStaff.length === 0 ? (
        <p className="text-muted">No staff members match your search.</p>
      ) : (
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Salary (KES)</th>
              <th>Address</th>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{Number(s.salary).toLocaleString('en-KE')}</td>
                <td>{s.address}</td>
                <td>{s.category}</td>
                <td>
                  <Link to={`/dashboard/edit_staff/${s._id}`} className="btn btn-primary btn-sm mx-2">
                    Edit
                  </Link>
                  <button 
                    onClick={() => handleDelete(s._id)} 
                    className="btn btn-danger btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Staff;
