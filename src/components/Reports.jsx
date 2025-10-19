import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,        // Needed for Pie chart
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,         // Register ArcElement for Pie
  Title,
  Tooltip,
  Legend
);

const Reports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get('https://mombasa-backend.onrender.com/api/reports/daily');
        setReport(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch report.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) return <p className="text-muted p-3">Loading daily report...</p>;
  if (error) return <p className="text-danger p-3">{error}</p>;

  const summaryChartData = {
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
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
      },
    ],
  };

  const pieChartData = {
    labels: ['Pending Users', 'Active Users', 'Pending Bookings', 'Approved Bookings'],
    datasets: [
      {
        data: [
          report.pendingUsers,
          report.activeUsers,
          report.pendingBookings,
          report.approvedBookings,
        ],
        backgroundColor: [
          'rgba(255, 206, 86, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
        ],
        hoverOffset: 30,
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

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'right' },
      title: { display: true, text: 'Distribution of Users & Bookings' },
    },
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Daily Report - {report.date}</h2>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card bg-warning text-white text-center">
            <div className="card-body">
              <h5 className="card-title">Pending Users</h5>
              <p className="fs-3">{report.pendingUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-primary text-white text-center">
            <div className="card-body">
              <h5 className="card-title">Active Users</h5>
              <p className="fs-3">{report.activeUsers}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-danger text-white text-center">
            <div className="card-body">
              <h5 className="card-title">Pending Bookings</h5>
              <p className="fs-3">{report.pendingBookings}</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card bg-success text-white text-center">
            <div className="card-body">
              <h5 className="card-title">Approved Bookings</h5>
              <p className="fs-3">{report.approvedBookings}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="card p-4 mb-4">
        <Bar data={summaryChartData} options={chartOptions} />
      </div>

      {/* Pie Chart */}
      <div className="card p-4">
        <Pie data={pieChartData} options={pieOptions} />
      </div>
    </div>
  );
};

export default Reports;
