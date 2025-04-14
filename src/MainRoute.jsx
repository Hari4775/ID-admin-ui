import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import Register from './Pages/auth/Components/Register';
import AdminPackageDetails from './Pages/PackageDetails/PackageDetails';
import Navbar from './Components/navbar/Navbar';
import Bookings from './Pages/Bookings/Bookings';

const MainRoute = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setAuth(!!localStorage.getItem("token"));
    };

    checkAuth();

    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <BrowserRouter>
      {auth ? (
        <div className="w-full flex">
          <div className="w-3/12">
            <Navbar />
          </div>
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Bookings />} />
              <Route path="/packages" element={<AdminDashboard />} />
              <Route path="/package_details/:package_id" element={<AdminPackageDetails />} />
              <Route path="/login" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
};

export default MainRoute;
