import { useEffect, useState } from 'react';
import axios from 'axios';

function RejectedUsers() {
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('https://mombasa-backend.onrender.com/api/users?status=rejected')
      .then(response => {
        const data = response.data;
        const usersArray = Array.isArray(data)
          ? data
          : Array.isArray(data.users)
          ? data.users
          : [];
        setRejectedUsers(usersArray);
        setFilteredUsers(usersArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rejected users:', error);
        setRejectedUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = rejectedUsers.filter(user =>
      (user.full_name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, rejectedUsers]);

  const handleApprove = (_id) => {
    axios.put(`https://mombasa-backend.onrender.com/api/users/${_id}/status`, { status: 'active' })
      .then(() => {
        setRejectedUsers(prev => prev.filter(user => user._id !== _id));
        setFilteredUsers(prev => prev.filter(user => user._id !== _id));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p>Loading rejected users...</p>;

  return (
    <div>
      <h2>Rejected Users</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No rejected users found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>#</th><th>Name</th><th>Email</th><th>Phone</th><th>Created At</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.full_name}</td>
                <td>{user.email}</td>
                <td>{user.phone || '-'}</td>
                <td>{user.createdAt ? new Date(user.createdAt).toLocaleString() : '-'}</td>
                <td>
                  <button className="btn btn-success" onClick={() => handleApprove(user._id)}>Approve</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default RejectedUsers;
