// src/api/reportApi.js
import axios from 'axios';

const BASE_URL = 'https://mombasa-backend.onrender.com/api/reports'; // change if needed

export const getPaymentReports = async () => {
  const res = await axios.get(`${BASE_URL}/payments`);
  return res.data;
};

export const getSupplyReports = async () => {
  const res = await axios.get(`${BASE_URL}/supplies`);
  return res.data;
};

export const getBookingReports = async () => {
  const res = await axios.get(`${BASE_URL}/bookings`);
  return res.data;
};
