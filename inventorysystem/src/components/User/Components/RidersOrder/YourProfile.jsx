import React, { useEffect, useState } from "react";
import Header from "../../Layout/Header";
import Modal from "../../ProfileModal/ProfileModal";
import Nav from "../../Layout/Nav";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";
import { Bounce, toast } from "react-toastify";
import { FiLogOut } from "react-icons/fi";
import BottomModalTrigger from "../../BottomModal/BottomModalTrigger";
// import DummyImage from "../../../../../public/assets/image/";


function YourProfile() {
  const navigate = useNavigate();
  const [riders, setRiders] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = localStorage.getItem("id");
  
  const RIDER_DETAILS = `${
    import.meta.env.VITE_RIDER_ENDPOINT
  }${id}`;

  useEffect(() => {
    if (id) {
      getRiderDetails();
    }
  }, [id]);

  const getRiderDetails = async () => {
    try {
      const response = await axiosInstance.get(RIDER_DETAILS);
      setRiders(response?.data?.data || {});
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const riderLogout = () => {
    axiosInstance.post(import.meta.env.VITE_RIDER_LOGOUT).then(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("id");
      toast.success("Rider LogOut Successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      navigate("/RiderLogin");
    });
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <Header onClick={toggleModal} />
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
          <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">
            Profile Details
          </h2>
          <div className="space-y-2">
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Name:</span> {riders.name}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Email:</span> {riders.email}
            </p>
            <p className="text-lg text-gray-700">
              <span className="font-semibold">Location:</span> {riders.location}
            </p>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={riderLogout}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out flex items-center gap-2 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <FiLogOut className="w-5 h-5" />
            Log Out
          </button>
        </div>
      </Modal>

      <div className="mt-20 flex justify-center items-center text-xl font-bold">
        <h1>Your Profile</h1>
      </div>

      <div className=" mb-16 bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full">
          {/* Profile Header */}
          <div className="flex flex-col items-center sm:flex-row sm:items-start sm:space-x-6">
            <img
              className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
              src={riders?.image?.url}
              alt="Profile"
            />
            <div className="mt-4 sm:mt-0 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900">
                {riders.name}
              </h1>
              <p className="text-gray-600 text-lg">{riders.email}</p>
              <p className="text-gray-600 text-lg">{riders.location}</p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-900 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white">Account Info</h3>
              <ul className="mt-4 space-y-2 text-white">
                <li>
                  <span className="font-semibold">Role:</span>{" "}
                  {riders.role === 1 ? "Admin" : "Rider"}
                </li>
                <li>
                  <span className="font-semibold">Balance: </span>
                  {riders.remaining_balance}
                </li>
              </ul>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-900 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-white">
                Contact Details
              </h3>
              <ul className="mt-4 space-y-2 text-white">
                <li>
                  <span className="font-semibold">Email:</span> {riders.email}
                </li>
                <li>
                  <span className="font-semibold">Location:</span>{" "}
                  {riders.location}
                </li>
              </ul>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={riderLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      <Nav />
    </>
  );
}

export default YourProfile;
