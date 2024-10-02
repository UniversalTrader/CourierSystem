import React, { useEffect, useState } from "react";
import Header from "../../Layout/Header";
import Nav from "../../Layout/Nav";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../../ProfileModal/ProfileModal";
import axiosInstance from "../../../../utils/axiosInstance";
import { Bounce, toast, ToastContainer } from "react-toastify";
import { FiLogOut } from "react-icons/fi";

function ViewOrders() {
  const navigate = useNavigate();
  const [riders, setRiders] = useState({});
  const [orders, setOrders] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const id = localStorage.getItem("id");
  
  const RIDER_DETAILS = `${
    import.meta.env.VITE_RIDER_ENDPOINT
  }/${id}`;

  useEffect(() => {
    if (id) {
      getRiderDetails();
      getRidersOrder();
    }
  }, [id]);

  const getRidersOrder = async () => {
    try {
      const response = await axiosInstance.get(import.meta.env.VITE_RIDER_SPECIFIC);
      // Filter orders where status is "delivered"
      const filteredOrders = response?.data?.data?.filter(order => order.status === "delivered") || [];
      setOrders(filteredOrders);
    } catch (error) {
      // console.log("Error in Fetching Orders", error);
    }
  };

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
      <div className="pt-20 pb-16 flex flex-col items-center min-h-screen bg-gray-100">
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

        {/* Orders Section */}
        <div className="max-w-lg w-full bg-white shadow-md rounded-lg p-6 mb-4">
          <h2 className="text-2xl font-bold mb-4 ">Delivered Orders</h2>
          <div className="flex flex-col items-center rounded-lg">
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div
                  key={order._id}
                  className="shadow-lg rounded-lg p-6 w-full mb-2 mt-2 bg-green-500 text-white"
                >
                  <h2 className="text-2xl font-bold mb-4 ">
                  {index + 1}) {order.tracking_id}
                  </h2>
                  <p className="text-lg ">
                    <span className="text-lg font-bold">Customer Name:</span>{" "}
                    {order.cust_name}
                  </p>
                  <p className="text-lg ">
                    <span className="text-lg font-bold">Customer City:</span>{" "}
                    {order.cust_city}
                  </p>
                  <p className="text-lg ">
                    <span className="text-lg font-bold">Tracking ID:</span>{" "}
                    {order.tracking_id}
                  </p>
                  <p className="text-lg">
                    <span className="text-lg font-bold">Status:</span>
                    <button className="bg-indigo-900 ml-2 text-[13px] text-white px-2 py-0 rounded cursor-default">
                      {order.status}
                    </button>
                  </p>
                </div>
              ))
            ) : (
              <p>No delivered orders found</p>
            )}
          </div>
        </div>
      </div>
      <Nav />
    </>
  );
}

export default ViewOrders;
