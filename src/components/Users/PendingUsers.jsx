import { useEffect, useState } from 'react';
import axios from 'axios';

function PendingUsers() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Local backend URL
  const API_URL = "https://mombasa-backend.onrender.com";

  useEffect(() => {
    axios
      .get(`${API_URL}/users?status=pending`)
      .then(response => {
        const users = Array.isArray(response.data)
          ? response.data
          : response.data.Users || []; // ✅ match backend key
        setPendingUsers(users);
        setFilteredUsers(users);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching pending users:', error.response?.data || error.message);
        setPendingUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = pendingUsers.filter(user =>
      (user.full_name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, pendingUsers]);

  const handleStatusChange = (id, status) => {
    axios
      .put(`${API_URL}/users/${id}/status`, { status })
      .then(() => {
        setPendingUsers(prev => prev.filter(user => user._id !== id));
        setFilteredUsers(prev => prev.filter(user => user._id !== id));
      })
      .catch(err =>
        console.error('Error updating user status:', err.response?.data || err.message)
      );
  };

  if (loading) return <p>Loading pending users...</p>;

  return (
    <div>
      <h2>Pending Users</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No pending users found.</p>
      ) : (
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-success me-2"
                    onClick={() => handleStatusChange(user._id, 'active')}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleStatusChange(user._id, 'rejected')}
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PendingUsers;
