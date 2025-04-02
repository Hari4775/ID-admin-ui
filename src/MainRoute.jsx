import React, { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import Register from './Pages/auth/Components/Register';
import AdminPackageDetails from './Pages/PackageDetails/PackageDetails';
import Navbar from './Components/navbar/Navbar';

const MainRoute = () => {
  const [auth, setAuth] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkAuth = () => {
      setAuth(!!localStorage.getItem("token")); // Update state based on token
    };

    checkAuth(); // Ensure the correct state on first render

    window.addEventListener("storage", checkAuth); // Listen for changes in localStorage
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  return (
    <BrowserRouter>
      {auth && <Navbar />} {/* Show Navbar only if authenticated */}
      
      <Routes>
        <Route path="/" element={auth ? <AdminDashboard /> : <Navigate to="/login" replace />} />
        <Route path="/package_details/:package_id" element={auth ? <AdminPackageDetails /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default MainRoute;
