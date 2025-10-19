import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function DashboardSummary() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get('https://mombasa-backend.onrender.com/api/reports/daily');
        setReport(res.data);
      } catch (err) {
        setError('Failed to load daily report.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  if (loading) return <p>Loading daily summary...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  // Updated labels and data to match backend response
  const chartData = {
    labels: ['Pending Users', 'Active Users', 'Pending Bookings', 'Approved Bookings'],
    datasets: [
      {
        label: 'Daily Metrics',
        data: [
          report.pendingUsers,
          report.activeUsers,
          report.pendingBookings,
          report.approvedBookings,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',   // Yellow - Pending Users
          'rgba(54, 162, 235, 0.7)',   // Blue - Active Users
          'rgba(255, 99, 132, 0.7)',   // Red - Pending Bookings
          'rgba(75, 192, 192, 0.7)',   // Green - Approved Bookings
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: `Daily Summary for ${report.date}` },
    },
  };

  return (
    <div>
      <h2 className="mb-4">Daily Summary: {report.date}</h2>

      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-warning text-white p-3 text-center">
            <h5>Pending Users</h5>
            <p className="fs-3">{report.pendingUsers}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white p-3 text-center">
            <h5>Active Users</h5>
            <p className="fs-3">{report.activeUsers}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white p-3 text-center">
            <h5>Pending Bookings</h5>
            <p className="fs-3">{report.pendingBookings}</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white p-3 text-center">
            <h5>Approved Bookings</h5>
            <p className="fs-3">{report.approvedBookings}</p>
          </div>
        </div>
      </div>

      <Bar data={chartData} options={chartOptions} />
    </div>
  );
}

export default DashboardSummary;
