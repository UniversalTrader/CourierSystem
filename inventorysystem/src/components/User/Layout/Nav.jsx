import React, { useState } from "react";
import {
  FaHome,
  FaWallet,
  FaPlus,
  FaCog,
  FaUser,
  FaGripLines,
  FaCircleNotch,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import BottomModal from "../BottomModal/BottomModal";

function Nav() {
  const [isBottomModalOpen, setBottomModalOpen] = useState(false);

  const toggleBottomModal = () => {
    setBottomModalOpen(!isBottomModalOpen);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-300 z-50 rounded-t-lg">
      <div className="flex justify-evenly h-full max-w-lg  mx-auto">
        {/* <Link
          to="/WelcomeRider"
          className="inline-flex flex-col items-center justify-center px-5 rounded-s-full hover:bg-gray-50 group"
        >
          <FaHome className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="sr-only">Home</span>
        </Link> */}

        <div className="flex items-center justify-center">
          <Link
            to="/ViewOrders"
            className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
          >
            <FaCircleNotch className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600" />
            <span className="sr-only">View All Orders</span>
          </Link>
        </div>

        <div className="flex items-center justify-center">
          <Link
            to="/WelcomeRider"
            className="inline-flex items-center justify-center w-10 h-10 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            <FaHome className="w-4 h-4 text-white" />
            <span className="sr-only">New item</span>
          </Link>
        </div>

        {/* <button
          type="button"
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
        >
          <FaCog className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="sr-only">Settings</span>
        </button> */}

        <Link
          to="/YourProfile"
          className="inline-flex flex-col items-center justify-center px-5 rounded-e-full hover:bg-gray-50 group"
        >
          <FaUser className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="sr-only">Profile</span>
        </Link>

        {/* New Button to trigger BottomModal */}
        {/* <button
          onClick={toggleBottomModal}
          className="inline-flex flex-col items-center justify-center px-5 hover:bg-gray-50 group"
        >
          <FaCog className="w-5 h-5 mb-1 text-gray-500 group-hover:text-blue-600" />
          <span className="sr-only">Settings Modal</span>
        </button> */}
      </div>

      {/* Bottom Modal */}
      {/* <BottomModal isOpenBottom={isBottomModalOpen} onCloseBottom={toggleBottomModal}>
        <p className="text-gray-700">
          This is a modal that appears at the bottom of the screen.
        </p>
      </BottomModal> */}
    </div>
  );
}

export default Nav;
