import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // ✅ Correct import

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get('https://mombasa-backend.onrender.com/api/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const generateReceipt = () => {
    if (!orders || orders.length === 0) {
      alert('No orders to generate receipt.');
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('All Orders Receipt', 14, 20);

    const tableColumn = [
      '#',
      'Supplier Name',
      'Item Name',
      'Quantity',
      'Amount',
      'Status',
      'Finance Status',
      'Delivery Status',
      'Delivered At',
      'Created At'
    ];

    const tableRows = orders.map((order, index) => [
      index + 1,
      order.supplier_name || '-',
      order.item_name || '-',
      order.quantity || '-',
      order.amount ? `$${order.amount}` : '-',
      order.status || '-',
      order.finance_status || '-',
      order.delivery_status || '-',
      order.delivered_at ? new Date(order.delivered_at).toLocaleString() : '-',
      new Date(order.created_at).toLocaleString()
    ]);

    // ✅ Use autoTable(doc, { ... }) instead of doc.autoTable
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [52, 58, 64] }
    });

    doc.save('orders_receipt.pdf');
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>All Orders</h3>
      <button
        onClick={generateReceipt}
        className="btn btn-primary mb-3"
        style={{ marginBottom: '15px' }}
      >
        Generate Receipt
      </button>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Supplier Name</th>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Finance Status</th>
            <th>Delivery Status</th>
            <th>Delivered At</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order, index) => (
            <tr key={order._id}>
              <td>{index + 1}</td>
              <td>{order.supplier_name || '-'}</td>
              <td>{order.item_name || '-'}</td>
              <td>{order.quantity || '-'}</td>
              <td>{order.amount ? `$${order.amount}` : '-'}</td>
              <td>{order.status || '-'}</td>
              <td>{order.finance_status || '-'}</td>
              <td>{order.delivery_status || '-'}</td>
              <td>{order.delivered_at ? new Date(order.delivered_at).toLocaleString() : '-'}</td>
              <td>{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Orders;
