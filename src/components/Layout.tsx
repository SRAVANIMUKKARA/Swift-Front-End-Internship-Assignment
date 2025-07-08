import React from 'react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Outlet />
    </div>
  );
}