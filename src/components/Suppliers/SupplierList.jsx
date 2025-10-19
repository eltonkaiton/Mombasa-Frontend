import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function SupplierList() {
  const [suppliers, setSuppliers] = useState([]);

  const fetchSuppliers = () => {
    axios.get('https://mombasa-backend.onrender.com/admin/suppliers')
      .then(res => {
        if (res.data?.Status) {
          setSuppliers(res.data.Result);
        }
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleDelete = id => {
    if (window.confirm("Are you sure you want to delete this supplier?")) {
      axios.delete(`https://mombasa-backend.onrender.com/admin/suppliers/${id}`)
        .then(() => fetchSuppliers())
        .catch(err => {
          console.error(err);
          alert("Delete failed");
        });
    }
  };

  return (
    <div className="container mt-4">
      <h4>Suppliers</h4>
      <Link to="/dashboard/suppliers/add" className="btn btn-success mb-3">
        Add Supplier
      </Link>
      <table className="table table-bordered table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Login Access</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier._id}>
              <td>{supplier.name}</td>
              <td><a href={`mailto:${supplier.email}`}>{supplier.email}</a></td>
              <td>{supplier.phone}</td>
              <td style={{ color: supplier.status === 'active' ? 'green' : 'red' }}>
                {supplier.status}
              </td>
              <td>
                {supplier.password ? (
                  <span className="text-success">Yes</span>
                ) : (
                  <span className="text-muted">No</span>
                )}
              </td>
              <td>
                <Link to={`/dashboard/suppliers/edit/${supplier._id}`} className="btn btn-sm btn-primary me-2">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(supplier._id)}
                  className="btn btn-sm btn-danger"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {suppliers.length === 0 && (
            <tr><td colSpan="6" className="text-center">No suppliers found.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default SupplierList;
