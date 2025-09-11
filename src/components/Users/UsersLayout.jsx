import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';

export default function UsersLayout() {
  return (
    <div className="container mt-4">
      <h2 className="mb-3">Users Section</h2>

      {/* Navigation Tabs */}
      <nav className="nav nav-pills mb-3">
        <NavLink to="active" className="nav-link" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
          Active
        </NavLink>
        <NavLink to="pending" className="nav-link" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
          Pending
        </NavLink>
        <NavLink to="suspended" className="nav-link" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
          Suspended
        </NavLink>
        <NavLink to="rejected" className="nav-link" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
          Rejected
        </NavLink>
        <NavLink to="add" className="nav-link" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
          Add User
        </NavLink>
      </nav>

      <hr />

      {/* Render nested route here */}
      <Outlet />
    </div>
  );
}
