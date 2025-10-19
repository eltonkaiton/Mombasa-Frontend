import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingStatus, setBookingStatus] = useState('');

  useEffect(() => {
    axios.get(`http://localhost:5000/bookings/${id}`)
      .then(res => {
        if (res.data.Status) {
          setBooking(res.data.Result);
          setBookingStatus(res.data.Result.booking_status);
        } else {
          setError(res.data.Error || 'Booking not found.');
        }
      })
      .catch(() => setError('Error fetching booking details.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = (e) => {
    setBookingStatus(e.target.value);
  };

  const handleUpdate = () => {
    axios.put(`http://localhost:5000/bookings/${id}`, { booking_status: bookingStatus })
      .then(res => {
        if (res.data.Status) {
          alert('Booking updated successfully.');
          navigate('/dashboard/bookings');
        } else {
          alert(res.data.Error || 'Failed to update booking.');
        }
      })
      .catch(() => alert('Error updating booking.'));
  };

  if (loading) return <p>Loading booking details...</p>;
  if (error) return <p className="text-danger">{error}</p>;
  if (!booking) return <p>No booking details available.</p>;

  return (
    <div className="px-5 mt-3">
      <h3>Booking Details</h3>
      <table className="table table-bordered">
        <tbody>
          <tr><th>ID</th><td>{booking._id}</td></tr>
          <tr><th>User ID</th><td>{booking.user_id}</td></tr>
          <tr><th>Booking Type</th><td>{booking.booking_type}</td></tr>
          <tr><th>Travel Date</th><td>{booking.travel_date}</td></tr>
          <tr><th>Travel Time</th><td>{booking.travel_time}</td></tr>
          <tr><th>Route</th><td>{booking.route}</td></tr>
          <tr><th>Passengers</th><td>{booking.num_passengers || '-'}</td></tr>
          <tr><th>Vehicle Type</th><td>{booking.vehicle_type || '-'}</td></tr>
          <tr><th>Vehicle Plate</th><td>{booking.vehicle_plate || '-'}</td></tr>
          <tr><th>Cargo Description</th><td>{booking.cargo_description || '-'}</td></tr>
          <tr><th>Cargo Weight (kg)</th><td>{booking.cargo_weight_kg || '-'}</td></tr>
          <tr><th>Amount Paid (KES)</th><td>{Number(booking.amount_paid || 0).toLocaleString('en-KE')}</td></tr>
          <tr><th>Payment Status</th><td>{booking.payment_status}</td></tr>
          <tr><th>Payment Method</th><td>{booking.payment_method || '-'}</td></tr>
          <tr><th>Transaction ID</th><td>{booking.transaction_id || '-'}</td></tr>
          <tr>
            <th>Booking Status</th>
            <td>
              <select
                value={bookingStatus}
                onChange={handleStatusChange}
                className="form-select"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </td>
          </tr>
          <tr><th>Created At</th><td>{new Date(booking.createdAt).toLocaleString()}</td></tr>
        </tbody>
      </table>
      <button className="btn btn-primary" onClick={handleUpdate}>Update Status</button>
      <Link to="/dashboard/bookings" className="btn btn-secondary ms-2">Back to Bookings</Link>
    </div>
  );
};

export default BookingDetail;
