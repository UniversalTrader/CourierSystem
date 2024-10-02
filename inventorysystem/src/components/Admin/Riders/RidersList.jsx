import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTrash } from "react-icons/fa";
import { CiDeliveryTruck } from "react-icons/ci";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../utils/axiosInstance";
import "../../../styles/ModalStyles.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import DummyImage from "../../../../public/assets/image/dummy.png";

const ITEMS_PER_PAGE = 7; // Number of items per page

const RiderList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [ridersData, setRidersData] = useState([]);
  const [filteredRiders, setFilteredRiders] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    axiosInstance
      .get(import.meta.env.VITE_RIDER_ENDPOINT)
      .then((response) => {
        // console.log("Response data:", response.data);
        const riders = response.data.data || [];
        setRidersData(riders);
        setFilteredRiders(riders);
        // console.log(riders);
      })
      .catch((error) => {
        console.error("Error fetching riders:", error);
        toast.error("Failed to fetch riders.");
      });
  }, []);

  const deleteRider = (id) => {
    const deleteEndpoint = `${import.meta.env.VITE_RIDER_ENDPOINT}/${id}`;
    axiosInstance
      .delete(deleteEndpoint)
      .then((response) => {
        // console.log("Rider deleted successfully", response.data);
        setRidersData((prev) => prev.filter((rider) => rider._id !== id));
        setShowConfirm(false);
        setTimeout(() => {
          toast.error("Rider deleted successfully.");
          window.location.reload();
        }, 1000);
      })
      .catch((error) => {
        console.error("Error deleting rider:", error);
        toast.error("Failed to delete rider.");
      });
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (deleteId) {
      deleteRider(deleteId);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredRiders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRiders.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    let tempRiders = ridersData;

    if (searchTerm) {
      tempRiders = tempRiders.filter((rider) => {
        const riderName = rider.name;
        return riderName
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }
    setFilteredRiders(tempRiders);
  }, [searchTerm]);

  return (
    <div
      className="mt-6 md:px-3 md:py-4 w-[100vw] md:w-[80vw] px-1 py-4 
      overflow-hidden h-full shadow-md items-center rounded-x"
    >
      <div className="text-center mt-4 mb-2 flex justify-between gap-4">
        <input
          type="text"
          placeholder="Search by Riders Names"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border rounded p-2 mr-2"
        />
        <button
          onClick={() => navigate("/AddRiders")}
          className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300 ease-in-out flex items-center gap-2"
        >
          <CiDeliveryTruck />
          Add Riders
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div style={{ scrollbarWidth: 'thin', msOverflowStyle: 'none' }} className="relative overflow-scroll h-[70vh] shadow-md sm:rounded-lg sm:w-[95vw] md:w-[79vw]">
          <table className="w-[80vw] overflow-scroll text-sm text-left rtl:text-right ">
            <thead className="h-[10vh] text-xs text-white uppercase bg-black">
              <tr>
                {/* <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th> */}
                <th scope="col" className="px-4 py-3">
                  Name
                </th>
                <th scope="col" className="px-4 py-3">
                  Email
                </th>
                <th scope="col" className="px-4 py-3">
                  Password
                </th>
                <th scope="col" className="px-4 py-3">
                  Location
                </th>
                <th scope="col" className="px-4 py-3">
                  Image
                </th>
                <th scope="col" className="px-4 py-3">
                  Remaining Balance
                </th>
                <th scope="col" className="px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((rider) => (
                  <tr
                    key={rider._id}
                    className="bg-gray-50 hover:bg-indigo-500 transition hover:text-white"
                  >
                    {/* <td className="px-4 py-3 text-sm text-gray-500">
                          {rider._id}
                        </td> */}
                    <td className="px-4 py-4">{rider.name}</td>
                    <td className="px-4 py-4">{rider.email}</td>
                    <td className="px-4 py-4">{rider.password}</td>
                    <td className="px-4 py-4">{rider.location}</td>
                    {/* <td className="px-4 py-4">
                      <img
                        src={rider?.image?.url ?? DummyImage}
                        alt=""
                        width={50}
                        className="object-cover rounded-full h-[100%] border-black"
                      />
                    </td> */}
                    <td className="px-4 py-4 relative">
                      <div className="relative group">
                        <img
                          src={rider?.image?.url ?? DummyImage}
                          alt=""
                          width={50}
                          className="object-cover rounded-lg h-[8vh] w-[100%] border-black transition duration-300 ease-in-out"
                        />
                        {/* Hover effect */}
                        <div className="absolute z-10 top-[-15px] left-[-10px] hidden group-hover:block md:w-[10vw] md:h-[23vh] w-[30vw] h-[30vh]">
                          <img
                            src={rider?.image?.url ?? DummyImage}
                            alt=""
                            className="object-cover rounded-lg w-[100%] h-[100%] border border-black shadow-lg"
                          />
                        </div>
                      </div>
                    </td>
                    <td
                      className={
                        rider.remaining_balance > 0
                          ? "text-red-500 text-center font-bold"
                          : "text-center"
                      }
                    >
                      {rider.remaining_balance <= 0
                        ? "No Balance"
                        : rider.remaining_balance}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium flex justify-center gap-2">
                      <Link
                        to={`/RidersUpdate/${rider._id}`}
                        className="bg-green-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out flex items-center gap-1"
                      >
                        <FaEdit className="text-white" />
                      </Link>
                      <button
                        onClick={() => handleDeleteClick(rider._id)}
                        className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-300 ease-in-out flex items-center gap-1"
                      >
                        <FaTrash className="text-white" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="11"
                    className="px-4 py-4 text-center text-red-500"
                  >
                    No Riders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className=" mr-5 mt-5 flex justify-end">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white py-2 px-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          <IoIosArrowBack />
        </button>
        <span className="text-gray-700">
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-1 bg-blue-500 text-white py-2 px-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
        >
          <IoIosArrowForward />
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this rider?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleConfirm}
                className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 ease-in-out"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ease-in-out"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default RiderList;
