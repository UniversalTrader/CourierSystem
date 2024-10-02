import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { FaTimes } from "react-icons/fa";
import { CgMoreR } from "react-icons/cg";
import { PiWarning } from "react-icons/pi";

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

import "react-toastify/dist/ReactToastify.css";
// import "../styles/ModalStyles.css";

import axiosInstance from "../../../utils/axiosInstance";

import io from "socket.io-client";
import VerticalDropdown from "../../VerticalDropdown/VerticalDropdown";
import { MdInfoOutline } from "react-icons/md";

const socket = io("http://localhost:8000");

const ITEMS_PER_PAGE = 10; // Number of items per page

const OrdersManage = () => {
  socket.on("connect", () => {});

  const [currentPage, setCurrentPage] = useState(1);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false); // For bulk delete
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
  const [selectedRider, setSelectedRider] = useState(""); // For the new dropdown
  const [modalVisible, setModalVisible] = useState(false);
  const [completedOrders, setCompletedOrders] = useState([]);
  const [notDeliveredOrders, setNotDeliveredOrders] = useState([]);
  const [message, setMessage] = useState("");
  const [showAddToCompleteConfirm, setShowAddToCompleteConfirm] =
    useState(false); // New state for confirmation modal

  // const [completedOrders, setCompletedOrders] = useState();

  const multipleDeleteEndpoint = `${
    import.meta.env.VITE_ORDER_ENDPOINT
  }/multipleDelete`;

  const multipleUpdateEndpoint = `${
    import.meta.env.VITE_ORDER_ENDPOINT
  }/multipleRiderUpdate`;

  // const showModal = () => {
  //   setModalVisible(true);
  // };

  const hideModal = () => {
    setModalVisible(false);
  };

  const deleteOrders = async (ids) => {
    try {
      // Replace `/order/bulk-delete` with your actual bulk delete API endpoint
      const response = await axiosInstance.delete(multipleDeleteEndpoint, {
        data: { ids },
      });

      if (response.data.success) {
        toast.success("Selected orders deleted successfully.");
        setOrders((prev) => prev.filter((order) => !ids.includes(order._id)));
        setFilteredOrders((prev) =>
          prev.filter((order) => !ids.includes(order._id))
        );
        setOrdersId([]); // Clear selected orders
        setShowConfirm(false); // Hide confirmation modal
        window.location.reload();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting orders:", error);
      toast.error("Failed to delete selected orders.");
    }
  };

  // Handle Bulk Delete Button Click
  const handleBulkDeleteClick = () => {
    if (ordersId.length === 0) {
      // Agar koi order select nahi kiya gaya toh error message show karo
      toast.error(
        "No orders selected for deletion. Please select at least one order."
      );
    } else {
      setIsBulkDelete(true); // Indicate bulk deletion
      setShowConfirm(true); // Show confirmation modal
    }
  };

  // Handle Confirmation of Deletion
  const handleConfirm = () => {
    if (isBulkDelete && ordersId.length > 0) {
      deleteOrders(ordersId);
    } else if (deleteId) {
      deleteOrders(deleteId);
    }
  };

  // Handle Cancellation of Deletion
  const handleCancel = () => {
    setShowConfirm(false);
    setDeleteId(null);
    setIsBulkDelete(false);
  };

  useEffect(() => {
    // Listen for the 'orderUpdated' event from the server
    socket.on("orderUpdated", (data) => {
      toast.success(data.message);

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
    if (ordersId.length === 0) {
      // Agar koi order select nahi kiya gaya toh error message show karo
      toast.error(
        "No orders selected for Update Riders. Please select at least one order."
      );
    }
    axiosInstance
      .put(multipleUpdateEndpoint, { ordersId, selectedRider }) // Send ordersId array to the API
      .then((response) => {
        // console.log(response?.data?.message);
        toast.success(response.data?.message);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  // Create PDF Function
  const sendPdfData = (e) => {
    e.preventDefault(); // Prevent page reload

    axiosInstance
      .post(
        import.meta.env.VITE_ORDERS_PDF,
        { filteredOrders },
        { responseType: "blob" }
      )
      .then((response) => {
        const pdfBlob = new Blob([response.data], { type: "application/pdf" });
        const pdfUrl = URL.createObjectURL(pdfBlob);

        // Open the PDF in a new browser tab
        window.open(pdfUrl);
      })
      .catch((error) => {
        console.error("Error generating PDF:", error);
        toast.error("Failed to generate PDF");
      });
  };

  // Add to Complete Function

  const addToComplete = (e) => {
    e.preventDefault();
    setShowAddToCompleteConfirm(true); // Show confirmation modal before completing
  };

  // Confirm Add to Complete
  const confirmAddToComplete = () => {
    axiosInstance
      .post(import.meta.env.VITE_ORDERS_COMPLETE, { filteredOrders })
      .then((response) => {
        setCompletedOrders(response?.data?.completedOrders);
        setNotDeliveredOrders(response?.data?.notDeliveredOrders);
        setModalVisible(true);
        setMessage(response?.data?.message);
        setShowAddToCompleteConfirm(false); // Hide confirmation modal after completion
      })
      .catch((error) => {
        toast.error("Failed to Complete");
        setShowAddToCompleteConfirm(false);
      });
  };

  const cancelAddToComplete = () => {
    setShowAddToCompleteConfirm(false);
  };

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
      tempOrders = tempOrders.filter((order) => {
        const chek = order.cutsomDate === selectedDate;
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
      <div>
        {/* Modal */}
        {modalVisible && (
          <div
            className="fixed top-0 left-0 right-0 z-50 w-full h-full flex items-center justify-center p-4 overflow-x-hidden overflow-y-auto "
            aria-hidden={!modalVisible}
          >
            <div className="relative w-full max-w-4xl max-h-full">
              <div className="relative bg-white rounded-lg shadow ">
                {/* Modal header */}
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                  <h3 className="text-xl font-medium text-gray-900 ">
                    List of Completed Orders
                  </h3>
                  <button
                    onClick={hideModal}
                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center  "
                  >
                    <span className="sr-only">Close modal</span>
                    &#10005;
                  </button>
                </div>

                {/* Modal content */}
                <div className="flex flex-wrap flex-col justify-start items-start p-4 md:p-5 space-y-4 md:space-y-0">
                  {/* Completed Orders */}

                  <div className="w-full md:w-1/2 mb-2">
                    <h4 className="font-bold mb-2">Completed Orders</h4>
                    <p>
                      {completedOrders.length > 0
                        ? completedOrders.length
                        : "There is no Completed Orders"}
                    </p>
                  </div>

                  <div class="overflow-x-auto h-[60vh] w-full">
                    <h4 className="font-bold mb-2">
                      <span className="text-red-500">
                        {" "}
                        <PiWarning
                          size={25}
                          className="text-red-500 inline-block"
                        />{" "}
                        Warning :
                      </span>
                      <span className=""> Not Allow Completed Orders</span>
                    </h4>

                    <table class="w-full text-sm text-left text-gray-500">
                      <thead class="text-xs text-gray-700 uppercase bg-gray-300">
                        <tr>
                          <th scope="col" class="px-6 py-3">
                            Tracking ID
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Customer Name
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Amount
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Status
                          </th>
                          <th scope="col" class="px-6 py-3">
                            Rider Name
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {notDeliveredOrders.length > 0 ? (
                          notDeliveredOrders.map((order, index) => (
                            <tr
                              key={index}
                              className="bg-gray-50  hover:bg-indigo-500 transition hover:text-white"
                            >
                              <td className="px-4 py-4">{order.tracking_id}</td>
                              <td className="px-4 py-4">{order.cust_name}</td>
                              <td className="px-4 py-4">{order.amount}</td>
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

                              <td className="px-4 py-4 text-sm ">
                                {order.rider_id.name}
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
                </div>

                {/* Modal footer */}
                <div className="flex items-center p-4 md:p-5 space-x-3 rtl:space-x-reverse border-t border-gray-200 rounded-b ">
                  {message}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add to Complete Confirmation Modal */}
        {showAddToCompleteConfirm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-semibold mb-4">Confirm Completion</h2>
              <p className="mb-4">
                Are you sure you want to mark these orders as complete?
              </p>
              <div className="flex justify-end">
                <button
                  onClick={cancelAddToComplete}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAddToComplete}
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Yes, Complete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

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

        {/* Orders Manage Inputs */}
        <div className="flex flex-wrap justify-between pl-5">
          <div className="flex flex-wrap justify-start md:justify-evenly items-center p-1 space-y-1 md:space-y-0">
            <VerticalDropdown
              onBulkDelete={handleBulkDeleteClick}
              onGeneratePdf={sendPdfData}
              ordersId={ordersId}
            />

            <select
              value={selectedRider}
              onChange={(e) => setSelectedRider(e.target.value)}
              className="border rounded p-2 mr-2 md:ml-3"
            >
              <option value="">Select a Rider</option>
              {riders.map((rider) => (
                <option key={rider._id} value={rider._id}>
                  {rider.name}
                </option>
              ))}
            </select>

            <button
              onClick={addOrdersId}
              className={`py-1 px-4 rounded-md transition duration-300 ease-in-out items-center ${
                selectedRider.length === 0
                  ? "hidden" // Disabled button styles
                  : "bg-blue-500 text-white hover:bg-blue-600" // Enabled button styles
              }`}
            >
              Update
            </button>

            <button
              onClick={addToComplete}
              className="md:ml-1 py-1 px-4 rounded-md transition duration-300 ease-in-out items-center bg-blue-500 text-white hover:bg-blue-600"
            >
              Add To Complete
            </button>
          </div>

          <div className="mr-5 p-1 mt-1">
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

        {/* Table */}
        <div
          style={{ scrollbarWidth: "thin", msOverflowStyle: "none" }}
          className="relative overflow-scroll h-[67vh] shadow-md sm:rounded-lg sm:w-[95vw] md:w-[79vw] mt-3"
        >
          <table className="w-[80vw] overflow-scroll text-sm text-left rtl:text-right">
            <thead className="h-[10vh] text-xs  uppercase bg-black text-white">
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
                    className="bg-gray-50  hover:bg-indigo-500 transition hover:text-white"
                  >
                    <td className="px-4 py-4 text-center">
                      <input
                        type="checkbox"
                        value={order._id}
                        onChange={() => handleCheckboxChange(order._id)} // Pass the order ID to the handler
                      />
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

        {/* Total Orders & Amount */}
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
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-4">
              {isBulkDelete
                ? `Are you sure you want to delete the selected ${ordersId.length} order(s)?`
                : "Are you sure you want to delete this order?"}
            </p>
            <div className="flex justify-end">
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
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

export default OrdersManage;
