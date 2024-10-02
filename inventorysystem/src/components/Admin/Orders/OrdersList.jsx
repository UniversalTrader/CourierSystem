import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
import { CgMoreR } from "react-icons/cg";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "react-toastify/dist/ReactToastify.css";
// import "../styles/ModalStyles.css";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

import io from "socket.io-client";
import { MdInfoOutline } from "react-icons/md";

const socket = io("http://localhost:8000");

const ITEMS_PER_PAGE = 10; // Number of items per page

const OrdersList = () => {
  socket.on("connect", () => {
    console.log("Connected to server");
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [townFilter, setTownFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [riderFilter, setRiderFilter] = useState("");
  const [riders, setRiders] = useState([]);
  const [ordersId, setOrdersId] = useState([]);
  const [ordersLength, setOrdersLength] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    // Listen for the 'orderUpdated' event from the server
    socket.on("orderUpdated", (data) => {
      toast.success(data.message);
      // console.log("Order updated:", data);

      // Handle the received data (e.g., update the state or UI)
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === data.orderId ? { ...order, status: data.status } : order
        )
      );
    });

    // Clean up the listener when the component unmounts
    return () => {
      socket.off("orderUpdated");
    };
  }, []);

  // Function to handle checkbox changes
  const handleCheckboxChange = (orderId) => {
    setOrdersId((prevOrdersId) => {
      if (prevOrdersId.includes(orderId)) {
        // If the orderId is already in the list, remove it
        return prevOrdersId.filter((id) => id !== orderId);
      } else {
        // If it's not in the list, add it
        return [...prevOrdersId, orderId];
      }
    });
  };

  // Function to send selected order IDs to the API
  const addOrdersId = (e) => {
    e.preventDefault(); // Prevent page reload
    axiosInstance
      .post("order/multipleUpadate", { ordersId }) // Send ordersId array to the API
      .then((response) => {
        // console.log(response?.data?.success);
        toast.success("In Process Successfull");
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log(ordersId);

  useEffect(() => {
    fetchOrders();
    fetchRiders();
    clearFields();
  }, []);

  // Fetch all orders from backend
  const fetchOrders = async () => {
    try {
      const response = await axiosInstance.get(
        import.meta.env.VITE_ORDER_ENDPOINT
      );
      setOrders(response.data.data || []);
      setFilteredOrders(response.data.data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders.");
    }
  };

  // Fetch Riders on Dropdown

  const fetchRiders = async () => {
    try {
      const response = await axiosInstance.get(
        import.meta.env.VITE_RIDER_ENDPOINT
      );
      setRiders(response?.data?.data || []); // Assuming `response.data` contains an array of rider names
    } catch (error) {
      console.error("Error fetching riders:", error);
      toast.error("Failed to fetch riders.");
    }
  };

  // Apply filters when any filter changes
  useEffect(() => {
    let tempOrders = orders;
    let totalAmount = 0; // Initialize totalAmount

    // Filter by customer number
    if (searchTerm) {
      tempOrders = tempOrders.filter((order) => {
        const trackingId = order.tracking_id || "";
        return trackingId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }

    // Filter by status
    if (statusFilter) {
      tempOrders = tempOrders.filter((order) => order.status === statusFilter);
    }

    // Filter by town
    if (townFilter) {
      tempOrders = tempOrders.filter((order) => order.cust_town === townFilter);
    }

    // Filter by Rider
    if (riderFilter) {
      tempOrders = tempOrders.filter(
        (order) => order.rider_id.name === riderFilter
      );
    }

    // Filter by date (assuming the date format is DD/MM/YYYY)
    if (dateFilter) {
      const selectedDate = new Date(dateFilter).toLocaleDateString("en-PK"); // Convert input date to DD/MM/YYYY format
      // console.log(selectedDate);
      tempOrders = tempOrders.filter((order) => {
        const chek = order.cutsomDate === selectedDate;
        // console.log(chek);

        return chek;
      });
    }

    totalAmount = tempOrders.reduce(
      (sum, order) => sum + (order.amount || 0),
      0
    );

    setFilteredOrders(tempOrders);
    setOrdersLength(tempOrders.length);
    setTotalAmount(totalAmount);
  }, [searchTerm, statusFilter, townFilter, dateFilter, orders, riderFilter]);

  // Delete Order
  const deleteOrder = async (id) => {
    const deleteOrderEndpoint = `${import.meta.env.VITE_ORDER_ENDPOINT}/${id}`;
    try {
      const response = await axiosInstance.delete(deleteOrderEndpoint);
      if (response.data.success) {
        toast.success("Order Deleted Successfully");
        setOrders((prev) => prev.filter((order) => order._id !== id));
        setShowConfirm(false);
      } else {
        toast.error("Failed to delete order.");
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Failed to delete order.");
    }
  };
  // Delete Orders Start
  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    if (deleteId) {
      deleteOrder(deleteId);
    }
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  // Details Modal
  const handleDetailsClick = (order) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedOrder(null);
  };

  const clearFields = () => {
    setSearchTerm("");
    setStatusFilter("");
    setTownFilter("");
    setDateFilter("");
    setRiderFilter("");
    setDateFilter("");
  };

  // Pagination logic
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div
        className="md:px-3 md:py-4 w-[100vw] md:w-[80vw] px-1 py-4 
      overflow-scroll md:overflow-hidden h-full shadow-md items-center rounded-xl"
      >
        {/* Filters Div */}
        <div className="pl-5">
          <input
            type="text"
            placeholder="Search by Tracking Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mr-2"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2"
          >
            <option value="">Statuses</option>
            <option value="delivered">Delivered</option>
            <option value="pending">Pending</option>
            <option value="hold">Hold</option>
            <option value="return">Return</option>
            <option value="canceled">Canceled</option>
            <option value="inprocess">In Process</option>
            <option value="complete">Complete</option>
          </select>
          <select
            value={townFilter}
            onChange={(e) => setTownFilter(e.target.value)}
            className="border rounded p-2 mr-2 ml-2"
          >
            <option value="">Towns</option>
            {/* Replace these options with actual town names */}
            <optgroup label="Karachi Central">
              <option value="Liaquatabad">Liaquatabad</option>
              <option value="Gulberg">Gulberg</option>
              <option value="North Nazimabad">North Nazimabad</option>
              <option value="New Karachi">New Karachi</option>
            </optgroup>
            <optgroup label="Karachi East">
              <option value="Gulshan-e-Iqbal">Gulshan-e-Iqbal</option>
              <option value="Jamshed">Jamshed</option>
              <option value="Ferozabad">Ferozabad</option>
              <option value="Gulistan-e-Jauhar">Gulistan-e-Jauhar</option>
            </optgroup>
            <optgroup label="Karachi South">
              <option value="Saddar">Saddar</option>
              <option value="Lyari">Lyari</option>
              <option value="Clifton">Clifton</option>
              <option value="DHA">DHA</option>
            </optgroup>
            <optgroup label="Karachi West">
              <option value="Orangi">Orangi</option>
              <option value="SITE">SITE</option>
              <option value="Baldia">Baldia</option>
              <option value="Mominabad">Mominabad</option>
              <option value="Manghopir">Manghopir</option>
            </optgroup>
            <optgroup label="Korangi">
              <option value="Korangi">Korangi</option>
              <option value="Landhi">Landhi</option>
              <option value="Shah Faisal">Shah Faisal</option>
              <option value="Ibrahim Hyderi">Ibrahim Hyderi</option>
            </optgroup>
            <optgroup label="Malir">
              <option value="Malir">Malir</option>
              <option value="Bin Qasim">Bin Qasim</option>
              <option value="Gadap">Gadap</option>
            </optgroup>
            <optgroup label="Kemari">
              <option value="Kemari">Kemari</option>
              <option value="Hawkesbay">Hawkesbay</option>
            </optgroup>
          </select>
          <select
            id="_id"
            value={riderFilter}
            onChange={(e) => setRiderFilter(e.target.value)}
            className="border rounded p-2 mr-2"
          >
            <option value="">Riders</option>
            {riders.map((rider) => (
              <option key={rider._id} value={rider.name}>
                {rider.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border rounded p-2"
          />

          <button
            className="bg-blue-500 text-white m-2 py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            onClick={clearFields}
          >
            Clear
          </button>

          <br />
        </div>

        <div className="flex flex-wrap justify-between pl-5">
          <button
            disabled={ordersId.lengyth === 0} // Button will be disabled if ordersId array is empty
            className={`mt-2 py-1 px-4 rounded-md transition duration-300 ease-in-out items-center ${
              ordersId.length === 0
                ? "bg-gray-400 text-white cursor-not-allowed" // Disabled button styles
                : "bg-blue-500 text-white hover:bg-blue-600" // Enabled button styles
            }`}
            onClick={addOrdersId}
          >
            Add To Process
          </button>

          <div className="mr-5">
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
              className="bg-blue-500 text-white py-2 px-3 rounded-full hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              <IoIosArrowForward />
            </button>
          </div>
        </div>

        <div
          style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
          className=" relative overflow-scroll h-[70vh] shadow-md sm:rounded-lg sm:w-[95vw] md:w-[79vw] mt-3"
        >
          <table className="w-[80vw] overflow-scroll text-sm text-left rtl:text-right">
            <thead className="h-[10vh] text-xs  uppercase 0 bg-black text-white">
              <tr>
                <th scope="col" className="px-4 py-3">
                  Process
                </th>
                <th scope="col" className="px-4 py-3">
                  Tracking #
                </th>

                <th scope="col" className="px-4 py-3">
                  Name
                </th>

                {/* <th scope="col" className="px-4 py-3">
                  City
                </th> */}

                {/* <th scope="col" className="px-4 py-3">
                  Order ID
                </th> */}

                {/* <th scope="col" className="px-4 py-3">
                  Town
                </th> */}

                <th scope="col" className="px-4 py-3">
                  Contact #
                </th>

                <th scope="col" className="px-4 py-3">
                  Amount
                </th>

                <th scope="col" className="px-4 py-3">
                  Rider Name
                </th>

                <th scope="col" className="px-4 py-3">
                  Status
                </th>

                <th scope="col" className="px-4 py-3">
                  Date
                </th>
                <th scope="col" className="px-4 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length > 0 ? (
                currentItems.map((order) => (
                  <tr
                    key={order._id}
                    className="bg-gray-50   hover:bg-indigo-500 transition hover:text-white"
                  >
                    <td className="px-4 py-4 text-center">
                      {order.status === "delivered" ||
                      order.status === "canceled" ||
                      order.status === "complete" ||
                      order.status === "inprocess" ? (
                        <input
                          type="checkbox"
                          disabled
                          value={order._id}
                          onChange={() => handleCheckboxChange(order._id)} // Pass the order ID to the handler
                        />
                      ) : (
                        <input
                          type="checkbox"
                          value={order._id}
                          onChange={() => handleCheckboxChange(order._id)} // Pass the order ID to the handler
                        />
                      )}
                    </td>
                    <td className="px-4 py-4">{order.tracking_id}</td>

                    <td className="px-4 py-4">{order.cust_name}</td>
                    {/* <td className="px-4 py-4 ">{order.cust_city}</td> */}
                    {/* <td className="px-4 py-4">{order._id}</td> */}

                    {/* <td className="px-4 py-4">{order.cust_town}</td> */}
                    <td className="px-4 py-4">
                      <a
                        className="underline"
                        href={`https://wa.me/${
                          order.cust_number.startsWith("0")
                            ? "92" + order.cust_number.slice(1)
                            : order.cust_number.replace("+", "")
                        }`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {order.cust_number}
                      </a>
                    </td>

                    <td className="px-4 py-4">Rs-/ {order.amount}</td>
                    <td className="px-4 py-4 text-sm ">
                      {order.rider_id.name}
                    </td>
                    {order.status === "delivered" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto bg-green-500 rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : order.status === "pending" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto bg-yellow-500 text-black rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : order.status === "canceled" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto bg-red-500 text-white  rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : order.status === "inprocess" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto text-white bg-blue-500 rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : order.status === "hold" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto bg-pink-500 text-black  rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : order.status === "return" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto text-white bg-orange-600 rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : order.status === "complete" ? (
                      <td>
                        <button className="py-1 px-3 text-sm cursor-auto text-white bg-black rounded-md">
                          {order.status}
                        </button>
                      </td>
                    ) : (
                      <td className="px-4 py-4">{"No Status"}</td>
                    )}

                    <td className="px-4 py-4 text-sm">{order.cutsomDate}</td>
                    <td className="px-4 py-6 text-sm font-medium flex justify-center gap-2">
                      <button
                        onClick={() => handleDeleteClick(order._id)}
                        className=" text-red-500 py-1 px-1 rounded-md  transition duration-300 ease-in-out flex items-center gap-1"
                      >
                        <FaTrash size={18} />
                      </button>

                      <Link
                        to={`/OrdersUpdate/${order._id}`}
                        className=" text-green-500 py-1 px-1 rounded-md  transition duration-300 ease-in-out flex items-center gap-1"
                      >
                        <FaEdit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDetailsClick(order)}
                        className=" text-black py-1 px-1 rounded-md  transition duration-300 ease-in-out flex items-center gap-1"
                      >
                        <MdInfoOutline size={18} />
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
                    No orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="w-full bg-slate-800 text-white p-2 rounded-md flex justify-between mt-2">
          <div className="">
            <h4 className="text-lg font-semibold ">
              <span className="">ORDERS :</span>{" "}
              {ordersLength > 0 ? ordersLength : "No Data"}
            </h4>
          </div>

          <div className="">
            <h4 className="text-lg font-semibold ">
              <span className="">Amount :</span>{" "}
              {totalAmount > 0
                ? new Intl.NumberFormat().format(totalAmount)
                : "No Data"}
            </h4>
          </div>
        </div>
      </div>

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

      {/* Delete Modal */}
      {showConfirm && (
        <div className={`modal-background ${showConfirm ? "visible" : ""}`}>
          <div
            className={`modal-container w-[35%] h-[30%] overflow-hidden	 ${
              showConfirm ? "visible" : ""
            }`}
          >
            <h2 className="text-lg font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this order?</p>
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

      {/* Details Modal */}
      {showDetailsModal && selectedOrder && (
        <div
          className={`modal-background  ${showDetailsModal ? "visible" : ""}`}
        >
          <div
            className={`modal-container  ${showDetailsModal ? "visible" : ""}`}
          >
            <div className="flex justify-end mb-4">
              <button onClick={handleCloseDetailsModal}>
                <FaTimes size={22} />
              </button>
            </div>
            <table className="modal-table w-full mb-4 ">
              <tbody>
                <tr>
                  <th colSpan={2} className="text-center text-xl">
                    Order Details
                  </th>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Tracking Id:</th>
                  <td className="px-4 py-2">{selectedOrder.tracking_id}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Customer Name:</th>
                  <td className="px-4 py-2">{selectedOrder.cust_name}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">City:</th>
                  <td className="px-4 py-2">{selectedOrder.cust_city}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Address:</th>
                  <td className="px-4 py-2">{selectedOrder.cust_address}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Contact Number:</th>
                  <td className="px-4 py-4">
                    <a
                      href={`https://wa.me/${
                        selectedOrder.cust_number.startsWith("0")
                          ? "92" + selectedOrder.cust_number.slice(1)
                          : selectedOrder.cust_number.replace("+", "")
                      }`}
                      target="_blank"
                      rel="noopener noreferrer"
                      // Tailwind classes for underline and color
                    >
                      {selectedOrder.cust_number}
                    </a>
                  </td>
                </tr>

                <tr>
                  <th className="px-4 py-2 text-left">Order Amount:</th>
                  <td className="px-4 py-2">{selectedOrder.amount}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Delivery Charges:</th>
                  <td className="px-4 py-2">
                    {selectedOrder.delivery_charges}
                  </td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Status:</th>
                  <td className="px-4 py-2">{selectedOrder.status}</td>
                </tr>
                <tr>
                  <th className="px-4 py-2 text-left">Feedback:</th>
                  <td className="px-4 py-2">
                    {selectedOrder.feedback || "No feedback"}
                  </td>
                </tr>
              </tbody>
            </table>

            <table className="modal-table w-full mb-4">
              <tbody>
                <tr>
                  <th colSpan={2} className="text-center text-xl">
                    Rider Details
                  </th>
                </tr>
                <tr>
                  <th className="px-3 py-2 text-left">Rider Name:</th>
                  <td className="px-3 py-2">{selectedOrder.rider_id.name}</td>
                </tr>
                <tr>
                  <th className="px-3 py-2 text-left">Location:</th>
                  <td className="px-3 py-2">
                    {selectedOrder.rider_id.location}
                  </td>
                </tr>
                <tr>
                  <th className="px-3 py-2 text-left">Rider Balance:</th>
                  <td className="px-3 py-2">
                    {selectedOrder.rider_id.remaining_balance}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default OrdersList;
