import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './Pages/AdminDashboard/AdminDashboard';
import Register from './Pages/auth/Components/Register';
import Login from './Pages/auth/Components/Login';
import LoginRegisterPage from './Pages/auth/LoginRegisterPage';
import AdminPackageDetails from './Pages/PackageDetails/PackageDetails';
import Navbar from './Components/navbar/Navbar';

const isAuthenticated = () => {
    console.log(document,"cookie")
    const token = document.cookie
      .split('; ')
      .find((row) => row.startsWith('token='));
    return !!token;
  };

  const PrivateRoute = ({ element: Component }) => {
    return isAuthenticated() ? <Component /> : <Navigate to="/login" replace />;
  };
  

const MainRoute = () => {
   
  return (
    
    <>
   <BrowserRouter>
    {/* Render the Header component only for authenticated pages */}
    {isAuthenticated() && <Navbar/>}

    <Routes>
      <Route path="/" element={<PrivateRoute element={AdminDashboard} />} />
      <Route path="/package_details/:package_id" element={<PrivateRoute element={AdminPackageDetails} />} />
      <Route path="/login_register" element={<LoginRegisterPage/>} />
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default MainRoute