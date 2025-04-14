import React, { useState } from "react";
import {
  FaHome,
  FaChartBar,
  FaBoxes,
  FaUsersCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { label: "Dashboard", icon: <FaHome />, path: "/" },
    { label: "Packages", icon: <FaChartBar />, path: "/packages" },
    // { label: "", icon: <FaBoxes />, path: "/admin/bookings" },
    // { label: "Users", icon: <FaUsersCog />, path: "/admin/users" },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex items-center justify-between bg-blue-950 px-4 py-3 text-white fixed w-full top-0 z-50 shadow-md">
        <h1 className="text-xl font-bold text-red-500">ISLAND-DAYS </h1>
        <button onClick={toggleSidebar}>
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-blue-950 text-white h-screen w-64 fixed top-0 left-0 shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 space-y-4 pt-20 md:pt-6">
          <h1 className="text-2xl font-bold text-center text-red-500 mb-6">
          ISLAND-DAYS
          </h1>
          <nav className="space-y-2">
            {navItems.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false); // Close sidebar on mobile after navigation
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-800 rounded-lg transition"
              >
                <span className="text-lg">{item.icon}</span>
                <span className="text-md font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-blue-800 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition"
          >
            <FaSignOutAlt />
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay when sidebar open on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-30 md:hidden"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default AdminSidebar;
