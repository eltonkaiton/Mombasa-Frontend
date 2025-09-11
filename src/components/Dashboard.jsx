import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation, Outlet } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserPlus,
  FaUserTimes,
  FaUserCheck,
  FaUserClock,
  FaUserShield,
  FaBook,
  FaBox,
  FaList,
  FaSignOutAlt,
  FaBars,
  FaShoppingCart,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isUsersOpen, setUsersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');

  const navigate = useNavigate();
  const location = useLocation();

  // Update active section based on URL
  useEffect(() => {
    const path = location.pathname;

    if (path.includes('/users/active')) setActiveSection('Active Users');
    else if (path.includes('/users/pending')) setActiveSection('Pending Users');
    else if (path.includes('/users/suspended')) setActiveSection('Suspended Users');
    else if (path.includes('/users/rejected')) setActiveSection('Rejected Users');
    else if (path.includes('/users/add')) setActiveSection('Add User');
    else if (path.includes('/staff')) setActiveSection('Employee');
    else if (path.includes('/bookings')) setActiveSection('Bookings');
    else if (path.includes('/category')) setActiveSection('Category');
    else if (path.includes('/suppliers')) setActiveSection('Suppliers');
    else if (path.includes('/orders')) setActiveSection('Orders');
    else if (path === '/dashboard') setActiveSection('Dashboard');
  }, [location.pathname]);

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      navigate('/');
    }
  };

  // Sidebar style
  const sidebarStyle = {
    width: isSidebarOpen ? '220px' : '60px',
    transition: 'width 0.3s ease',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#343a40',
    color: '#fff'
  };

  const linkStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 15px',
    borderRadius: '5px',
    marginBottom: '5px',
    position: 'relative',
    cursor: 'pointer',
    color: 'white',
    textDecoration: 'none'
  };

  const activeLinkStyle = {
    backgroundColor: '#495057',
    fontWeight: 'bold'
  };

  const tooltipStyle = {
    position: 'absolute',
    left: '70px',
    backgroundColor: '#000',
    color: '#fff',
    padding: '5px 10px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    fontSize: '0.85rem',
    top: '50%',
    transform: 'translateY(-50%)'
  };

  const MenuItem = ({ to, icon, label, children, onClick, isDropdownOpen, isDropdown }) => (
    <li className="nav-item">
      {to ? (
        <NavLink
          to={to}
          style={({ isActive }) =>
            isActive ? { ...linkStyle, ...activeLinkStyle } : linkStyle
          }
        >
          {icon}
          {isSidebarOpen && <span className="ms-2">{label}</span>}
          {!isSidebarOpen && <span style={tooltipStyle}>{label}</span>}
        </NavLink>
      ) : (
        <div
          onClick={onClick}
          style={linkStyle}
        >
          <span className="d-flex align-items-center">
            {icon}
            {isSidebarOpen && <span className="ms-2">{label}</span>}
          </span>
          {isSidebarOpen && isDropdown !== undefined && (isDropdownOpen ? <FaChevronUp /> : <FaChevronDown />)}
          {!isSidebarOpen && <span style={tooltipStyle}>{label}</span>}
        </div>
      )}
      {children}
    </li>
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div className="d-flex justify-content-between align-items-center mb-3 p-2">
          <h4 className="mb-0" style={{ fontSize: isSidebarOpen ? '1.2rem' : '1rem' }}>
            {isSidebarOpen ? 'Admin Panel' : 'AP'}
          </h4>
          <FaBars onClick={() => setSidebarOpen(!isSidebarOpen)} style={{ cursor: 'pointer' }} />
        </div>

        <ul className="nav flex-column mt-2">
          <MenuItem to="/dashboard" icon={<FaTachometerAlt />} label="Dashboard" />
          
          {/* Users Dropdown */}
          <MenuItem
            icon={<FaUsers />}
            label="Users"
            onClick={() => setUsersOpen(!isUsersOpen)}
            isDropdownOpen={isUsersOpen}
            isDropdown
          >
            {isUsersOpen && (
              <ul className="nav flex-column ms-3">
                <MenuItem to="/dashboard/users/active" icon={<FaUserCheck />} label="Active Users" />
                <MenuItem to="/dashboard/users/pending" icon={<FaUserClock />} label="Pending Users" />
                <MenuItem to="/dashboard/users/suspended" icon={<FaUserShield />} label="Suspended Users" />
                <MenuItem to="/dashboard/users/rejected" icon={<FaUserTimes />} label="Rejected Users" />
                <MenuItem to="/dashboard/users/add" icon={<FaUserPlus />} label="Add User" />
              </ul>
            )}
          </MenuItem>

          <MenuItem to="/dashboard/staff" icon={<FaUserShield />} label="Employee" />
          <MenuItem to="/dashboard/bookings" icon={<FaBook />} label="Bookings" />
          <MenuItem to="/dashboard/category" icon={<FaList />} label="Category" />
          <MenuItem to="/dashboard/suppliers" icon={<FaBox />} label="Suppliers" />
          <MenuItem to="/dashboard/orders" icon={<FaShoppingCart />} label="Orders" />

          <MenuItem
            icon={<FaSignOutAlt />}
            label="Logout"
            onClick={handleLogout}
          />
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
        <h4>{activeSection}</h4>
        <Outlet />
      </div>
    </div>
  );
}

export default Dashboard;
