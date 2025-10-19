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
  FaChevronUp,
  FaMoneyBillAlt,
  FaSearch,
  FaDownload,
  FaEye
} from 'react-icons/fa';
import axios from 'axios';

function Dashboard() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isUsersOpen, setUsersOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('Dashboard');
  const [showPayments, setShowPayments] = useState(''); // 'booking' or 'order'

  const [bookingPayments, setBookingPayments] = useState([]);
  const [orderPayments, setOrderPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Search states
  const [bookingSearch, setBookingSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  // Auto-update active section based on route
  useEffect(() => {
    const path = location.pathname;
    setShowPayments('');

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
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  // ✅ Secure fetch payments (handles both booking & order)
  const fetchPayments = async (type) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Session expired. Please login again.');
        navigate('/');
        return;
      }

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (type === 'booking') {
        const res = await axios.get('http://localhost:5000/bookings/payments', config);
        const data = res.data;
        setBookingPayments(Array.isArray(data.payments) ? data.payments : data);
      } else if (type === 'order') {
        const res = await axios.get('http://localhost:5000/api/orders/payments', config);
        const data = res.data;
        setOrderPayments(Array.isArray(data.payments) ? data.payments : data);
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      if (error.response?.status === 401) {
        alert('Unauthorized access. Please login again.');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert('Failed to load payment data.');
      }
    } finally {
      setLoading(false);
    }
  };

  // When user clicks a payment item, load real data
  const handleShowPayments = (type) => {
    setActiveSection(type === 'booking' ? 'Booking Payments' : 'Order Payments');
    setShowPayments(type);
    fetchPayments(type);
  };

  // Filter data based on search
  const filteredBookingPayments = bookingPayments.filter(payment =>
    payment.user_id?.full_name?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    payment.route?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    payment.payment_method?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    payment.payment_status?.toLowerCase().includes(bookingSearch.toLowerCase()) ||
    payment.amount_paid?.toString().includes(bookingSearch)
  );

  const filteredOrderPayments = orderPayments.filter(payment =>
    payment.supplier_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    payment.item_name?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    payment.finance_status?.toLowerCase().includes(orderSearch.toLowerCase()) ||
    payment.amount?.toString().includes(orderSearch) ||
    payment._id?.toLowerCase().includes(orderSearch.toLowerCase())
  );

  // Simple PDF generation without external dependencies
  const generatePDF = (type, data) => {
    // Create a simple HTML table for PDF content
    const tableHeaders = type === 'booking' 
      ? ['User', 'Route', 'Amount', 'Payment Method', 'Status', 'Date']
      : ['Order ID', 'Supplier', 'Item', 'Amount', 'Status', 'Date'];
    
    let tableHTML = `
      <html>
        <head>
          <title>${type === 'booking' ? 'Booking' : 'Order'} Payments Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; text-align: center; }
            .summary { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #2c3e50; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .total { margin-top: 20px; font-weight: bold; color: #27ae60; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${type === 'booking' ? 'Booking' : 'Order'} Payments Report</h1>
            <div>Generated on: ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="summary">
            <strong>Total Records: ${data.length}</strong>
          </div>
          <table>
            <thead>
              <tr>
                ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
    `;

    // Calculate total amount while building rows
    let totalAmount = 0;
    
    data.forEach(item => {
      if (type === 'booking') {
        const amount = item.amount_paid || 0;
        totalAmount += amount;
        tableHTML += `
          <tr>
            <td>${item.user_id?.full_name || 'N/A'}</td>
            <td>${item.route || 'N/A'}</td>
            <td>KSh ${amount.toLocaleString()}</td>
            <td>${item.payment_method || 'N/A'}</td>
            <td>${item.payment_status || 'N/A'}</td>
            <td>${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `;
      } else {
        const amount = item.amount || 0;
        totalAmount += amount;
        tableHTML += `
          <tr>
            <td>${item._id || 'N/A'}</td>
            <td>${item.supplier_name || 'N/A'}</td>
            <td>${item.item_name || 'N/A'}</td>
            <td>KSh ${amount.toLocaleString()}</td>
            <td>${item.finance_status || 'N/A'}</td>
            <td>${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `;
      }
    });

    tableHTML += `
            </tbody>
          </table>
          <div class="total">
            Total Amount: KSh ${totalAmount.toLocaleString()}
          </div>
        </body>
      </html>
    `;

    // Create a new window with the HTML content
    const printWindow = window.open('', '_blank');
    printWindow.document.write(tableHTML);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // View PDF in new tab (using same HTML approach)
  const viewPDF = (type, data) => {
    const tableHeaders = type === 'booking' 
      ? ['User', 'Route', 'Amount', 'Payment Method', 'Status', 'Date']
      : ['Order ID', 'Supplier', 'Item', 'Amount', 'Status', 'Date'];
    
    let tableHTML = `
      <html>
        <head>
          <title>${type === 'booking' ? 'Booking' : 'Order'} Payments Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #2c3e50; text-align: center; }
            .summary { margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th { background-color: #2c3e50; color: white; padding: 10px; text-align: left; }
            td { padding: 8px; border: 1px solid #ddd; }
            tr:nth-child(even) { background-color: #f8f9fa; }
            .total { margin-top: 20px; font-weight: bold; color: #27ae60; }
            .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${type === 'booking' ? 'Booking' : 'Order'} Payments Report</h1>
            <div>Generated on: ${new Date().toLocaleDateString()}</div>
          </div>
          <div class="summary">
            <strong>Total Records: ${data.length}</strong>
          </div>
          <table>
            <thead>
              <tr>
                ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
    `;

    let totalAmount = 0;
    
    data.forEach(item => {
      if (type === 'booking') {
        const amount = item.amount_paid || 0;
        totalAmount += amount;
        tableHTML += `
          <tr>
            <td>${item.user_id?.full_name || 'N/A'}</td>
            <td>${item.route || 'N/A'}</td>
            <td>KSh ${amount.toLocaleString()}</td>
            <td>${item.payment_method || 'N/A'}</td>
            <td>${item.payment_status || 'N/A'}</td>
            <td>${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `;
      } else {
        const amount = item.amount || 0;
        totalAmount += amount;
        tableHTML += `
          <tr>
            <td>${item._id || 'N/A'}</td>
            <td>${item.supplier_name || 'N/A'}</td>
            <td>${item.item_name || 'N/A'}</td>
            <td>KSh ${amount.toLocaleString()}</td>
            <td>${item.finance_status || 'N/A'}</td>
            <td>${item.created_at ? new Date(item.created_at).toLocaleDateString() : 'N/A'}</td>
          </tr>
        `;
      }
    });

    tableHTML += `
            </tbody>
          </table>
          <div class="total">
            Total Amount: KSh ${totalAmount.toLocaleString()}
          </div>
          <div class="no-print" style="margin-top: 20px; text-align: center;">
            <button onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 5px; cursor: pointer;">
              Print Report
            </button>
          </div>
        </body>
      </html>
    `;

    const viewWindow = window.open('', '_blank');
    viewWindow.document.write(tableHTML);
    viewWindow.document.close();
  };

  // Sidebar styling
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
          onClick={onClick}
        >
          {icon}
          {isSidebarOpen && <span className="ms-2">{label}</span>}
          {!isSidebarOpen && <span style={tooltipStyle}>{label}</span>}
        </NavLink>
      ) : (
        <div
          onClick={onClick}
          style={{
            ...linkStyle,
            ...(activeSection === label ? activeLinkStyle : {})
          }}
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

  // Enhanced table styles
  const tableContainerStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden',
    marginTop: '20px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  };

  const thStyle = { 
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '12px 15px',
    textAlign: 'left',
    fontWeight: '600',
    borderBottom: '2px solid #34495e'
  };

  const tdStyle = { 
    padding: '12px 15px',
    borderBottom: '1px solid #ecf0f1',
    color: '#2c3e50'
  };

  const trHoverStyle = {
    transition: 'background-color 0.2s ease',
    cursor: 'pointer'
  };

  const statusStyle = (status) => {
    const baseStyle = {
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'capitalize'
    };

    switch (status?.toLowerCase()) {
      case 'completed':
      case 'paid':
      case 'active':
        return { ...baseStyle, backgroundColor: '#d4edda', color: '#155724' };
      case 'pending':
        return { ...baseStyle, backgroundColor: '#fff3cd', color: '#856404' };
      case 'failed':
      case 'rejected':
        return { ...baseStyle, backgroundColor: '#f8d7da', color: '#721c24' };
      default:
        return { ...baseStyle, backgroundColor: '#e2e3e5', color: '#383d41' };
    }
  };

  const amountStyle = {
    fontWeight: 'bold',
    color: '#27ae60'
  };

  // Search input style
  const searchInputStyle = {
    padding: '8px 12px 8px 35px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    fontSize: '14px',
    width: '300px',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const searchContainerStyle = {
    position: 'relative',
    display: 'inline-block'
  };

  const searchIconStyle = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#6c757d'
  };

  // Button styles
  const buttonStyle = {
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.3s ease',
    marginLeft: '10px'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#3498db',
    color: 'white'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#95a5a6',
    color: 'white'
  };

  // Render Payment Tables
  const renderPayments = () => {
    if (loading) {
      return (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '200px',
          fontSize: '16px',
          color: '#6c757d'
        }}>
          Loading payments...
        </div>
      );
    }

    if (showPayments === 'booking') {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: '#2c3e50', margin: 0 }}>Booking Payments</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                backgroundColor: '#3498db', 
                color: 'white', 
                padding: '5px 10px', 
                borderRadius: '15px',
                fontSize: '14px'
              }}>
                Total: {filteredBookingPayments.length}
              </span>
              <button 
                style={secondaryButtonStyle}
                onClick={() => viewPDF('booking', filteredBookingPayments)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
              >
                <FaEye /> View Report
              </button>
              <button 
                style={primaryButtonStyle}
                onClick={() => generatePDF('booking', filteredBookingPayments)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
              >
                <FaDownload /> Print Report
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div style={searchContainerStyle}>
            <FaSearch style={searchIconStyle} />
            <input
              type="text"
              placeholder="Search booking payments..."
              value={bookingSearch}
              onChange={(e) => setBookingSearch(e.target.value)}
              style={searchInputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>User</th>
                  <th style={thStyle}>Route</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Payment Method</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookingPayments.length > 0 ? (
                  filteredBookingPayments.map((p, index) => (
                    <tr 
                      key={p._id} 
                      style={{
                        ...trHoverStyle,
                        backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e8f4f8'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white'}
                    >
                      <td style={tdStyle}>
                        <div style={{ fontWeight: '500' }}>
                          {p.user_id?.full_name || 'N/A'}
                        </div>
                      </td>
                      <td style={tdStyle}>{p.route || 'N/A'}</td>
                      <td style={{ ...tdStyle, ...amountStyle }}>KSh {p.amount_paid?.toLocaleString() || '0'}</td>
                      <td style={tdStyle}>
                        <span style={{ 
                          padding: '4px 8px',
                          backgroundColor: '#e8f4f8',
                          borderRadius: '6px',
                          fontSize: '12px'
                        }}>
                          {p.payment_method || 'N/A'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <span style={statusStyle(p.payment_status)}>
                          {p.payment_status || 'N/A'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ 
                      textAlign: 'center', 
                      padding: '40px',
                      color: '#6c757d',
                      fontSize: '16px'
                    }}>
                      {bookingSearch ? 'No matching booking payments found.' : 'No booking payments found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (showPayments === 'order') {
      return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h4 style={{ color: '#2c3e50', margin: 0 }}>Order Payments</h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ 
                backgroundColor: '#e74c3c', 
                color: 'white', 
                padding: '5px 10px', 
                borderRadius: '15px',
                fontSize: '14px'
              }}>
                Total: {filteredOrderPayments.length}
              </span>
              <button 
                style={secondaryButtonStyle}
                onClick={() => viewPDF('order', filteredOrderPayments)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#95a5a6'}
              >
                <FaEye /> View Report
              </button>
              <button 
                style={primaryButtonStyle}
                onClick={() => generatePDF('order', filteredOrderPayments)}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#2980b9'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#3498db'}
              >
                <FaDownload /> Print Report
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div style={searchContainerStyle}>
            <FaSearch style={searchIconStyle} />
            <input
              type="text"
              placeholder="Search order payments..."
              value={orderSearch}
              onChange={(e) => setOrderSearch(e.target.value)}
              style={searchInputStyle}
              onFocus={(e) => e.target.style.borderColor = '#3498db'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>
          
          <div style={tableContainerStyle}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Order ID</th>
                  <th style={thStyle}>Supplier</th>
                  <th style={thStyle}>Item</th>
                  <th style={thStyle}>Amount</th>
                  <th style={thStyle}>Status</th>
                  <th style={thStyle}>Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrderPayments.length > 0 ? (
                  filteredOrderPayments.map((p, index) => (
                    <tr 
                      key={p._id} 
                      style={{
                        ...trHoverStyle,
                        backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef9e7'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#f8f9fa' : 'white'}
                    >
                      <td style={tdStyle}>
                        <code style={{ 
                          backgroundColor: '#f8f9fa',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontFamily: 'monospace'
                        }}>
                          {p._id || 'N/A'}
                        </code>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ fontWeight: '500' }}>
                          {p.supplier_name || 'N/A'}
                        </div>
                      </td>
                      <td style={tdStyle}>{p.item_name || 'N/A'}</td>
                      <td style={{ ...tdStyle, ...amountStyle }}>KSh {p.amount?.toLocaleString() || '0'}</td>
                      <td style={tdStyle}>
                        <span style={statusStyle(p.finance_status)}>
                          {p.finance_status || 'N/A'}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        {p.created_at ? new Date(p.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        }) : 'N/A'}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" style={{ 
                      textAlign: 'center', 
                      padding: '40px',
                      color: '#6c757d',
                      fontSize: '16px'
                    }}>
                      {orderSearch ? 'No matching order payments found.' : 'No order payments found.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return <Outlet />;
  };

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

          {/* Booking Payments */}
          <MenuItem
            icon={<FaMoneyBillAlt />}
            label="Booking Payments"
            onClick={() => handleShowPayments('booking')}
          />

          {/* Order Payments */}
          <MenuItem
            icon={<FaMoneyBillAlt />}
            label="Order Payments"
            onClick={() => handleShowPayments('order')}
          />

          <MenuItem to="/dashboard/category" icon={<FaList />} label="Category" />
          <MenuItem to="/dashboard/suppliers" icon={<FaBox />} label="Suppliers" />
          <MenuItem to="/dashboard/orders" icon={<FaShoppingCart />} label="Orders" />

          <MenuItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
        </ul>
      </div>

      {/* Main Content */}
      <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#f8f9fa' }}>
        <h4 style={{ color: '#2c3e50', marginBottom: '20px' }}>{activeSection}</h4>
        {renderPayments()}
      </div>
    </div>
  );
}

export default Dashboard;