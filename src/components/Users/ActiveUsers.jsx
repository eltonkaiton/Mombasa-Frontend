// ActiveUsers.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function ActiveUsers() {
  const [activeUsers, setActiveUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch active users on mount
  useEffect(() => {
    axios
      .get("http://localhost:5000/users?status=active") // ✅ correct local endpoint
      .then((response) => {
        const users = Array.isArray(response.data)
          ? response.data
          : response.data.Users || []; // match backend response format

        setActiveUsers(users);
        setFilteredUsers(users);
        setLoading(false);
      })
      .catch((error) => {
        console.error(
          "Error fetching active users:",
          error.response?.data || error.message
        );
        setActiveUsers([]);
        setFilteredUsers([]);
        setLoading(false);
      });
  }, []);

  // Filter users by search term
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = activeUsers.filter(
      (user) =>
        (user.full_name || "").toLowerCase().includes(term) ||
        (user.email || "").toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, activeUsers]);

  // Suspend user handler
  const handleSuspend = (id) => {
    axios
      .put(`http://localhost:5000/users/${id}/status`, { status: "suspended" })
      .then(() => {
        setActiveUsers((prev) => prev.filter((user) => user._id !== id));
        setFilteredUsers((prev) => prev.filter((user) => user._id !== id));
      })
      .catch((err) =>
        console.error(
          "Error suspending user:",
          err.response?.data || err.message
        )
      );
  };

  if (loading) return <p>Loading active users...</p>;

  return (
    <div>
      <h2>Active Users</h2>

      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search by name or email..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredUsers.length === 0 ? (
        <p>No active users found.</p>
      ) : (
        <table className="table table-striped">
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
                <td>{user.phone || "-"}</td>
                <td>{new Date(user.created_at).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => handleSuspend(user._id)}
                  >
                    Suspend
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

export default ActiveUsers;
