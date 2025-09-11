import React from 'react';
import DashboardSummary from './DashboardSummary'; // Adjust path as needed

function Home() {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <DashboardSummary />
    </div>
  );
}

export default Home;
