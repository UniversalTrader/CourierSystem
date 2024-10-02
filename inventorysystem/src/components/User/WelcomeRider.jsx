import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import Modal from "./ProfileModal/ProfileModal";
import Nav from "./Layout/Nav";
import axiosInstance from "../../utils/axiosInstance";
import { FaAngleDown, FaEye, FaEyeSlash } from "react-icons/fa";
import Header from "./Layout/Header";
import { FiLogOut } from "react-icons/fi";
import { MdInfoOutline, MdLocationOn } from "react-icons/md";
import { IoMdCall } from "react-icons/io";

function WelcomeRider() {
  // States
  const location = useLocation();
  const navigate = useNavigate();
  const [riders, setRiders] = useState({});
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAmount, setShowAmount] = useState(false);
  const [statusFilter, setStatusFilter] = useState(""); // Status filter state
  const id = localStorage.getItem("id");
  const [name, setName] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const RIDER_DETAILS = `${import.meta.env.VITE_RIDER_ENDPOINT}/${id}`;

  const handleDetailsClick = (orders) => {
    setSelectedOrder(orders);
    setShowUpdateModal(true);
  };

  const handleDetailsOrder = (orders) => {
    setSelectedOrder(orders);
    setShowDetailModal(true);
  };

  const updateStatus = (e) => {
    e.preventDefault();
    const updatedOrderData = {
      feedback,
      status,
    };
    axiosInstance
      .put(`/order/${selectedOrder._id}`, updatedOrderData)
      .then((response) => {
        if (response.data.success) {
          toast.success("Order Updated Successfully", {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          // console.log(response);
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
      })
      .catch((error) => {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
            toast.error(data.message || "Error in Updating Order", {
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
          } else {
            toast.error("An error occurred. Please try again.", {
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
          }
        } else {
          toast.error("Network Error. Please check your connection.", {
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
        }
      });
  };

  // Name on Welcome Page
  useEffect(() => {
    if (location.state && location.state.name) {
      setName(location.state.name);
    } else {
      navigate("/WelcomeRider");
    }
  }, [location.state, navigate]);

  // Riders Orders & Details
  useEffect(() => {
    if (id) {
      getRiderDetails();
      getRidersOrder();
    }
  }, [id]);

  // RidersSpecific
  const getRidersOrder = async () => {
    try {
      const response = await axiosInstance.get(
        import.meta.env.VITE_RIDER_SPECIFIC
      );
      setOrders(response?.data?.data || []);
    } catch (error) {
      // console.log("Error in Fetching Orders", error);
    }
  };

  // Riders Details
  const getRiderDetails = async () => {
    try {
      const response = await axiosInstance.get(RIDER_DETAILS);
      setRiders(response?.data?.data || {});
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Filters on Orders
  useEffect(() => {
    let tempOrders = orders;

    // Exclude orders with status 'deliver'
    tempOrders = tempOrders.filter((order) => order.status !== "delivered");

    if (statusFilter) {
      tempOrders = tempOrders.filter((order) => order.status === statusFilter);
    }

    if (dateFilter) {
      const selectedDate = new Date(dateFilter).toLocaleDateString("en-PK"); // Convert input date to DD/MM/YYYY format
      // console.log(selectedDate);
      tempOrders = tempOrders.filter((order) => {
        const chek = order.cutsomDate === selectedDate;
        // console.log(chek);

        return chek;
      });
    }

    if (searchTerm) {
      tempOrders = tempOrders.filter((order) => {
        const trackingId = order.tracking_id || "";
        return trackingId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }

    setFilteredOrders(tempOrders);
  }, [statusFilter, orders, dateFilter, searchTerm]);

  // Rider Logout
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

  // Profile Modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleShowAmount = () => {
    setShowAmount(!showAmount);
  };

  // Update Modal Close Button
  const closeUpdateModal = () => {
    setShowUpdateModal(false);
  };

  // Detail Modal Close Button
  const closeDetailModal = () => {
    setShowDetailModal(false);
  };

  const clearFilters = () => {
    setDateFilter("");
    setStatusFilter("");
    setSearchTerm("");
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

      <div className="pt-18 pb-16 flex flex-col items-center min-h-screen bg-gray-100">
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />

        <div className="w-full flex justify-center items-center mt-[4.5rem]">
          <div className="w-4/5 bg-gradient-to-r from-red-500 to-orange-500 shadow-md rounded-lg p-6 mb-4 text-white">
            <h2 className="text-xl font-bold mb-3 text-white">
              Welcome {riders.name}!
            </h2>
            <h2 className="block text-lg">Your Balance</h2>
            <div className="flex items-center gap-2">
              <p className="text-lg text-white">
                {showAmount ? riders.remaining_balance : "•••••••"}
              </p>
              <button onClick={toggleShowAmount} className="text-white">
                {showAmount ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>

        {/* <MobileModal /> */}
        {showUpdateModal && selectedOrder && (
          <div className="fixed inset-0 flex justify-center items-center z-50  ">
            {/* Modal content */}
            <div className=" relative mt-6 flex flex-col gap-5 bg-gradient-to-r from-rose-700 to-pink-600  rounded-xl px-8 py-6 text-white ">
              <button
                className="place-self-end text-whit"
                onClick={closeUpdateModal}
              >
                Close
              </button>
              <h1 className="text-2xl font-bold text-center">Update Status</h1>
              <p className="text-xl font-bold text-center max-w-md">
                Update Your Status & Feedback
              </p>
              <form className="w-full" onSubmit={updateStatus}>
                <select
                  id="status"
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 text-black border border-gray-300 rounded-md mb-4"
                >
                  <option selected value={selectedOrder.status}>
                    {selectedOrder.status}
                  </option>
                  <option value="return">Return</option>
                  <option value="delivered">Delivired</option>
                  <option value="hold">Hold</option>
                  <option value="canceled">Canceled</option>
                </select>

                {status === "delivered" ? (
                  <input
                    type="text"
                    disabled
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="feedback"
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-md mb-4"
                  />
                ) : status === "return" ||
                  status === "hold" ||
                  status === "canceled" ? (
                  <input
                    required
                    type="text"
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="feedback"
                    className="w-full px-4 py-3 text-black border border-gray-300 rounded-md mb-4"
                  />
                ) : (
                  ""
                )}

                <button
                  type="submit"
                  className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-white text-blue-700 hover:bg-blue-700 hover:text-white transition-colors"
                >
                  Update Now
                </button>
              </form>
            </div>
          </div>
        )}

        {/* <DetailModal /> */}
        {showDetailModal && selectedOrder && (
          <div className="fixed inset-0 flex justify-center items-center z-50 p-5 ">
            {/* Modal content */}
            <div style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="h-[70vh] overflow-y-scroll relative max-w-lg w-full bg-gradient-to-r from-slate-900 to-slate-700 rounded-xl px-8 py-6 text-white shadow-lg shadow-black/30">
              <button
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-300"
                onClick={closeDetailModal}
              >
                &times;
              </button>
              <h1 className="text-2xl font-bold text-center mb-4">
                Order Details
              </h1>

              <div className="space-y-2">
                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Customer Name:</span>
                  <span>{selectedOrder.cust_name}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">City:</span>
                  <span>{selectedOrder.cust_city}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Address:</span>
                  <span>{selectedOrder.cust_address}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Town:</span>
                  <span>{selectedOrder.cust_town}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Customer Number:</span>
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
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Tracking ID:</span>
                  <span>{selectedOrder.tracking_id}</span>
                </div>
                
                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Order Amount:</span>
                  <span>{selectedOrder.amount}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Delivery Charges:</span>
                  <span>{selectedOrder.delivery_charges}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">FeedBack:</span>
                  <span>{selectedOrder.feedback || "No Feedback"}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Status:</span>
                  <span>{selectedOrder.status}</span>
                </div>

                <div
                  className="flex justify-between"
                  style={{ borderBottom: "2px solid gray" }}
                >
                  <span className="font-semibold pb-1">Date:</span>
                  <span>{selectedOrder.cutsomDate}</span>
                </div>
                {/* Add more fields as needed */}
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6 mb-4">
          <input
            type="text"
            placeholder="Search by Tracking Code"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded p-2 mr-2 w-full mb-2"
          />
          <div className="mb-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded p-2"
            >
              <option value="">Statuses</option>
              <option value="pending">Pending</option>
              <option value="hold">Hold</option>
              <option value="canceled">Canceled</option>
              <option value="in process">In Process</option>
              <option value="complete">Complete</option>
            </select>

            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="border rounded p-2"
            />

            <button
              onClick={clearFilters}
              className="bg-blue-500 text-white m-2 py-1 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
            >
              Clear
            </button>
          </div>

          <h2 className="text-2xl font-bold mb-4 ">Orders</h2>
          <div className="flex flex-col items-center rounded-lg">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => {
                const buttonClass =
                  order.status === "pending"
                    ? "bg-yellow-300 text-black"
                    : order.status === "canceled"
                    ? "bg-red-400 text-white"
                    : order.status === "inprocess"
                    ? "bg-blue-400 text-white"
                    : order.status === "hold"
                    ? "bg-purple-400 text-white"
                    : "bg-gray-200 text-black";

                return (
                  <div
                    key={order._id}
                    className="shadow-lg rounded-lg p-6 w-full mb-2 mt-2 bg-indigo-600 text-white"
                  >
                    <div className="flex justify-end">
                      <button onClick={() => handleDetailsOrder(order)}>
                        <MdInfoOutline />
                      </button>
                    </div>
                    <h2 className="text-2xl font-bold mb-4">
                      Order {index + 1}
                    </h2>
                    <p className="text-lg">
                      <span className="text-lg font-bold">Name:</span>{" "}
                      {order.cust_name}
                    </p>

                    <p className="text-lg">
                      <IoMdCall size={22} className="inline-block mb-1" /> :{" "}
                      <a
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
                    </p>

                    <p className="text-lg">
                      <MdLocationOn size={22} className="inline-block mb-1" /> :{" "}
                      {order.cust_address}
                    </p>
                    <p className="text-lg">
                      <span className="text-lg font-bold">Status:</span>
                      <Link>
                        <button
                          onClick={() => handleDetailsClick(order)}
                          className={`ml-2 text-[13px] px-1 py-0 rounded-lg ${buttonClass} uppercase`}
                        >
                          {order.status}
                        </button>
                      </Link>
                    </p>
                  </div>
                );
              })
            ) : (
              <p>No orders found</p>
            )}
          </div>
        </div>
      </div>

      <Nav />
    </>
  );
}

export default WelcomeRider;
