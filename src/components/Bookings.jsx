import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No admin token found. Please login.');
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get('https://mombasa-backend.onrender.com/bookings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setBookings(res.data.bookings);
        } else {
          setError(res.data.message || 'Failed to load bookings.');
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong while fetching bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  // Generate PDF receipt for a single booking
  const handleViewReceipt = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Booking Receipt', 105, 20, null, null, 'center');
    doc.setFontSize(12);

    doc.text(`Booking ID: ${booking._id}`, 20, 40);
    doc.text(`Passenger Name: ${booking.user_id?.full_name || 'N/A'}`, 20, 50);
    doc.text(`Email: ${booking.user_id?.email || 'N/A'}`, 20, 60);
    doc.text(`Booking Type: ${booking.booking_type}`, 20, 70);
    doc.text(`Travel Date: ${booking.travel_date}`, 20, 80);
    doc.text(`Travel Time: ${booking.travel_time}`, 20, 90);
    doc.text(`Route: ${booking.route}`, 20, 100);
    doc.text(`Amount Paid: ${Number(booking.amount_paid || 0).toLocaleString()}`, 20, 110);
    doc.text(`Payment Status: ${booking.payment_status}`, 20, 120);
    doc.text(`Booking Status: ${booking.booking_status}`, 20, 130);

    doc.save(`Booking_${booking._id}.pdf`);
  };

  // Generate one PDF with all bookings in table format
  const handleGenerateAllReceipts = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('All Bookings Receipt', 105, 20, null, null, 'center');
    doc.setFontSize(12);
    doc.text(`Total Bookings: ${bookings.length}`, 20, 30);

    // Table headers
    const tableColumn = [
      'ID',
      'Passenger Name',
      'Email',
      'Type',
      'Date',
      'Time',
      'Route',
      'Amount Paid',
      'Payment',
      'Status',
    ];

    // Table rows
    const tableRows = bookings.map((b) => [
      b._id,
      b.user_id?.full_name || 'N/A',
      b.user_id?.email || 'N/A',
      b.booking_type,
      b.travel_date,
      b.travel_time,
      b.route,
      Number(b.amount_paid || 0).toLocaleString(),
      b.payment_status,
      b.booking_status,
    ]);

    // Generate table using jspdf-autotable
    autoTable(doc, {
      startY: 40,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [0, 0, 0] },
    });

    doc.save('All_Bookings.pdf');
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (bookings.length === 0) return <p className="text-muted">No bookings found.</p>;

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">Bookings List</h3>

      <div className="mb-3 text-end">
        <button className="btn btn-success" onClick={handleGenerateAllReceipts}>
          Generate All Receipts
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Passenger Name</th>
              <th>Email</th>
              <th>Type</th>
              <th>Date</th>
              <th>Time</th>
              <th>Route</th>
              <th>Amount Paid</th>
              <th>Payment</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id}>
                <td>{b._id}</td>
                <td>{b.user_id?.full_name || 'N/A'}</td>
                <td>{b.user_id?.email || 'N/A'}</td>
                <td>{b.booking_type}</td>
                <td>{b.travel_date}</td>
                <td>{b.travel_time}</td>
                <td>{b.route}</td>
                <td>{Number(b.amount_paid || 0).toLocaleString()}</td>
                <td>{b.payment_status}</td>
                <td>{b.booking_status}</td>
                <td>
                  <div className="d-flex gap-2">
                    <Link to={`/dashboard/bookings/${b._id}`} className="btn btn-sm btn-info">
                      View
                    </Link>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewReceipt(b)}
                    >
                      View Receipt
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;
