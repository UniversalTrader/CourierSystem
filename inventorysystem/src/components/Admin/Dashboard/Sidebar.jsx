import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBox,
  FaPlus,
  FaList,
  FaBars,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import "./Sidebar.css"; // Make sure to create this CSS file
import { TbReorder } from "react-icons/tb";

function Sidebar() {
  const [openDropdowns, setOpenDropdowns] = useState({
    riders: false,
    orders: false,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle the sidebar state based on window width
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true); // Open sidebar for large screens
      } else {
        setSidebarOpen(false); // Close sidebar for small screens
      }
    };

    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Call the handler right away to set the initial state
    handleResize();

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    // Clear local storage
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("role");

    // Redirect to login page
    navigate("/RiderLogin");
  };

  return (
    <div className="flex  h-[100vh]">
      {/* Toggle Button for Small Screens */}
      <button
        onClick={toggleSidebar}
        className={`fixed top-4 z-50 text-gray-800 hover:text-gray-400 md:hidden transition-all duration-300 ${
          sidebarOpen ? "button-closed" : "button-open"
        }`}
      >
        {sidebarOpen ? (
          <FaTimes className="w-6 h-6" />
        ) : (
          <FaBars className="w-6 h-6" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`h-[100%] sidebar bg-gray-900 text-white flex-shrink-0 shadow-lg transition-transform duration-300 ${
          sidebarOpen ? "w-64 translate-x-0" : "w-0 -translate-x-full"
        } md:translate-x-0`}
      >
        <div className="p-6 ">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          </div>
          <ul className="space-y-4">
            {/* <li>
              <Link
                to="/"
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <FaHome className="w-6 h-6" />
                <span>Home</span>
              </Link>
            </li> */}

            {/* Orders Dropdown */}
            {/* <button
                onClick={() => toggleDropdown("orders")}
                className="flex items-center justify-between w-full text-left py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <FaBox className="w-6 h-6" />
                  <span>Orders</span>
                </div>
                {openDropdowns.orders ? (
                  <IoMdArrowDropup className="w-5 h-5" />
                ) : (
                  <IoMdArrowDropdown className="w-5 h-5" />
                )}
              </button> */}
            {/* <div
                className={`mt-2 bg-gray-800 rounded-lg ${
                  openDropdowns.orders ? "block" : "hidden"
                }`}
              ></div> */}
            <li>
              <Link
                to="/AddRiders"
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <FaPlus className="w-6 h-6" />
                <span>Add Rider</span>
              </Link>
            </li>
            <li>
              <Link
                to="/RidersList"
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <FaList className="w-6 h-6" />
                <span>Riders List</span>
              </Link>
            </li>

            <li>
              <Link
                to="/OrdersAdd"
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <FaPlus className="w-6 h-6" />
                <span>Add Order</span>
              </Link>
            </li>
            <li>
              <Link
                to="/OrdersList"
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <FaList className="w-6 h-6" />
                <span>Orders List</span>
              </Link>
            </li>
            <li>
              <Link
                to="/OrdersManage"
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out"
              >
                <TbReorder className="w-6 h-6" />
                <span>Orders Manage</span>
              </Link>
            </li>

            {/* Riders Dropdown */}
            {/* <li>
              <button
                onClick={() => toggleDropdown("riders")}
                className="flex items-center justify-between w-full text-left py-3 px-6 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <FaUsers className="w-6 h-6" />
                  <span>Riders</span>
                </div>
                {openDropdowns.riders ? (
                  <IoMdArrowDropup className="w-5 h-5" />
                ) : (
                  <IoMdArrowDropdown className="w-5 h-5" />
                )}
              </button>
              <div
                className={`mt-2 bg-gray-800 rounded-lg ${
                  openDropdowns.riders ? "block" : "hidden"
                }`}
              ></div>
            </li> */}

            {/* Logout Button */}
            <li>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 py-3 px-6 rounded-lg hover:bg-red-800 transition duration-300 ease-in-out w-full text-left"
              >
                <FaSignOutAlt className="w-6 h-6" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default Sidebar;
