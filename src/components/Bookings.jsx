import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import jsPDF from 'jspdf';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/bookings')
      .then(res => {
        if (res.data.Status) {
          setBookings(res.data.Result);
        } else {
          setError(res.data.Error || "Failed to load bookings.");
        }
      })
      .catch(err => {
        console.error(err);
        setError("Something went wrong while fetching bookings.");
      })
      .finally(() => setLoading(false));
  }, []);

  // Function to generate a PDF receipt for a single booking
  const handleViewReceipt = (booking) => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Booking Receipt", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`Booking ID: ${booking._id}`, 20, 40);
    doc.text(`User ID: ${booking.user_id}`, 20, 50);
    doc.text(`Booking Type: ${booking.booking_type}`, 20, 60);
    doc.text(`Travel Date: ${booking.travel_date}`, 20, 70);
    doc.text(`Travel Time: ${booking.travel_time}`, 20, 80);
    doc.text(`Route: ${booking.route}`, 20, 90);
    doc.text(`Amount Paid: ${Number(booking.amount_paid || 0).toLocaleString()}`, 20, 100);
    doc.text(`Payment Status: ${booking.payment_status}`, 20, 110);
    doc.text(`Booking Status: ${booking.booking_status}`, 20, 120);

    doc.save(`Booking_${booking._id}.pdf`);
  };

  // Generate receipts for all bookings
  const handleGenerateAllReceipts = () => {
    bookings.forEach((b) => handleViewReceipt(b));
  };

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-3">Bookings List</h3>

      {loading ? (
        <p>Loading bookings...</p>
      ) : error ? (
        <p className="text-danger">{error}</p>
      ) : bookings.length === 0 ? (
        <p className="text-muted">No bookings found.</p>
      ) : (
        <>
          <div className="mb-3 text-end">
            <button 
              className="btn btn-success"
              onClick={handleGenerateAllReceipts}
            >
              Generate All Receipts
            </button>
          </div>
          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>ID</th>
                  <th>User ID</th>
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
                    <td>{b.user_id}</td>
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
        </>
      )}
    </div>
  );
};

export default Bookings;
