import BookingDetail from './components/BookingDetail';  // Import BookingDetail component
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Home from './components/Home';
import Ferries from './components/Ferries';

import Staff from './components/Staff';
import Bookings from './components/Bookings';
import Reports from './components/Reports';
import Category from './components/Category';
import AddCategory from './components/AddCategory';
import AddStaff from './components/AddStaff';
import EditStaff from './components/EditStaff';
import Start from './components/Start';
import StaffLogin from './components/StaffLogin';
import StaffDetail from './components/StaffDetail';
import UserRegister from './components/UserRegister';
import UserLogin from './components/UserLogin';

import UsersLayout from './components/Users/UsersLayout';
import ActiveUsers from './components/Users/ActiveUsers';
import PendingUsers from './components/Users/PendingUsers';
import SuspendedUsers from './components/Users/SuspendedUsers';
import RejectedUsers from './components/Users/RejectedUsers';
import AddUser from './components/Users/AddUser';

// ✅ Import supplier components
import SupplierList from './components/Suppliers/SupplierList';
import AddSupplier from './components/Suppliers/AddSupplier';
import EditSupplier from './components/Suppliers/EditSupplier';

// ✅ Import Orders component
import Orders from './components/Orders';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/start" />} />
      <Route path="/adminlogin" element={<Login />} />
      <Route path="/staff_login" element={<StaffLogin />} />
      <Route path="/staff_detail/:id" element={<StaffDetail />} />
      <Route path="/start" element={<Start />} />
      <Route path="/userlogin" element={<UserLogin />} />        {/* User Login */}
      <Route path="/userregister" element={<UserRegister />} />  {/* User Register */}

      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Home />} />
        <Route path="ferries" element={<Ferries />} />
        <Route path="staff" element={<Staff />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="bookings/:id" element={<BookingDetail />} />
        <Route path="reports" element={<Reports />} />
        <Route path="category" element={<Category />} />
        <Route path="add_staff" element={<AddStaff />} />
        <Route path="add_category" element={<AddCategory />} />
        <Route path="edit_staff/:id" element={<EditStaff />} />

        {/* Users nested routes */}
        <Route path="users" element={<UsersLayout />}>
          <Route index element={<ActiveUsers />} />
          <Route path="active" element={<ActiveUsers />} />
          <Route path="pending" element={<PendingUsers />} />
          <Route path="suspended" element={<SuspendedUsers />} />
          <Route path="rejected" element={<RejectedUsers />} />
          <Route path="add" element={<AddUser />} />
        </Route>

        {/* ✅ Supplier routes */}
        <Route path="suppliers" element={<SupplierList />} />
        <Route path="suppliers/add" element={<AddSupplier />} />
        <Route path="suppliers/edit/:id" element={<EditSupplier />} />

        {/* ✅ Orders route */}
        <Route path="orders" element={<Orders />} />
      </Route>
    </Routes>
  );
}

export default function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
}
