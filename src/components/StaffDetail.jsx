import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate for redirect
import 'bootstrap/dist/css/bootstrap.min.css';

const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staff, setStaff] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/staff/detail/' + id)
      .then((response) => response.json())
      .then((data) => setStaff(data))
      .catch((error) => console.error('Error fetching staff data:', error));
  }, [id]);

  const handleLogout = () => {
    // Clear token or session data (example using localStorage)
    localStorage.removeItem('token'); // or whatever key you're using
    // Redirect to login
    navigate('/start');
  };

  if (!staff) {
    return <div>Loading...</div>;
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ minWidth: '300px' }}>
        <h4 className="mb-3 text-center">Employee Management</h4>
        <p><strong>{staff.name}</strong></p>
        <p><strong>Email:</strong> {staff.email}</p>
        <p><strong>Category:</strong> {staff.category}</p>
        <div className="d-flex justify-content-between mt-4">
          <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
          <button className="btn btn-primary">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default StaffDetail;
