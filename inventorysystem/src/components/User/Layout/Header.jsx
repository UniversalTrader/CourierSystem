
import React from "react";
import { FaAngleDown } from "react-icons/fa"; // Import icons from react-icons

function Header({ onClick }) {
  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white shadow p-4 rounded-b-lg ">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Rider Dashboard</h1>
        <button
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          onClick={onClick}
        >
          <FaAngleDown className="text-white" />
        </button>
      </div>
    </div>
  );
}

export default Header;
