import { useEffect, useState } from 'react';
import axios from 'axios';

function SuspendedUsers() {
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/api/users?status=suspended')
      .then(response => {
        const data = response.data;
        const usersArray = Array.isArray(data) ? data
          : Array.isArray(data.users) ? data.users
          : [];
        setSuspendedUsers(usersArray);
        setFilteredUsers(usersArray);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching suspended users:', error);
        setSuspendedUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = suspendedUsers.filter(user =>
      (user.full_name || '').toLowerCase().includes(term) ||
      (user.email || '').toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, suspendedUsers]);

  const handleActivate = (_id) => {
    axios.put(`http://localhost:5000/api/users/${_id}/status`, { status: 'active' })
      .then(() => {
        setSuspendedUsers(prev => prev.filter(user => user._id !== _id));
        setFilteredUsers(prev => prev.filter(user => user._id !== _id));
      })
      .catch(err => console.error(err));
  };

  const handleReject = (_id) => {
    axios.put(`http://localhost:5000/api/users/${_id}/status`, { status: 'rejected' })
      .then(() => {
        setSuspendedUsers(prev => prev.filter(user => user._id !== _id));
        setFilteredUsers(prev => prev.filter(user => user._id !== _id));
      })
      .catch(err => console.error(err));
  };

  if (loading) return <p>Loading suspended users...</p>;

  return (
    <div>
      <h2>Suspended Users</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No suspended users found.</p>
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
                  <button className="btn btn-success me-2" onClick={() => handleActivate(user._id)}>Activate</button>
                  <button className="btn btn-danger" onClick={() => handleReject(user._id)}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default SuspendedUsers;
