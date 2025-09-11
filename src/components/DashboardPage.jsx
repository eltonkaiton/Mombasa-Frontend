import React from 'react';
import DashboardSummary from './DashboardSummary';

function DashboardPage() {
  return (
    <div className="dashboard-container">
      {/* Top Header */}
      <header 
        className="d-flex align-items-center bg-white shadow-sm p-3 position-sticky top-0"
        style={{ zIndex: 1020 }}
      >
        {/* Sidebar toggle (optional, only visual) */}
        <div className="me-3" style={{ fontSize: '24px', cursor: 'pointer' }}>
          &#9776;
        </div>

        <div className="fw-bold fs-5 flex-grow-1">
          Welcome to Mombasa Ferry Service
        </div>

        {/* Search bar */}
        <div style={{ minWidth: '250px' }}>
          <input 
            type="search" 
            className="form-control" 
            placeholder="Search..."
          />
        </div>
      </header>

      {/* Main Dashboard Area */}
      <main 
        className="p-3 bg-light"
        style={{
          height: 'calc(100vh - 72px)', // Adjust for sticky header
          overflowY: 'auto'
        }}
      >
        {/* Summary Cards + Charts */}
        <DashboardSummary />
      </main>
    </div>
  );
}

export default DashboardPage;
