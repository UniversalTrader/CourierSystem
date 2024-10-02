import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../Input/Input"; // Adjust the path as needed
import axiosInstance from "../../../utils/axiosInstance";

const OrdersUpdate = () => {
  // Update Orders State
  const [rider_id, setRiderId] = useState([]);
  const [custName, setCustName] = useState("");
  const [custCity, setCustCity] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custTown, setCustTown] = useState("");
  const [custNumber, setCustNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [feedback, setFeedback] = useState("");
  const [status, setStatus] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");
  const [riders, setRiders] = useState([]);
  const { id } = useParams(); // Get the order ID from the URL params
  const navigate = useNavigate();
  const updateOrderEndpoint = `${import.meta.env.VITE_ORDER_ENDPOINT}/${id}`

  // Fetch Orders on Input
  useEffect(() => {
    axiosInstance
      .get(updateOrderEndpoint)
      .then((response) => {
        const order = response.data.data;
        // console.log(order);
        setCustName(order.cust_name);
        setCustCity(order.cust_city);
        setCustAddress(order.cust_address);
        setCustTown(order.cust_town);
        setCustNumber(order.cust_number);
        setAmount(order.amount);
        setDeliveryCharges(order.delivery_charges);
        setFeedback(order.feedback);
        setStatus(order.status);
        setRiderId(order.rider_id);
      })
      .catch((error) => {
        console.error("Error fetching order details:", error);
        toast.error("Failed to fetch order details.");
      });

    axiosInstance
      .get(import.meta.env.VITE_RIDER_ENDPOINT)
      .then((response) => {
        const ridersList = response.data.data || [];
        // console.log(ridersList);
        setRiders(ridersList);
      })
      .catch((error) => {
        console.error("Error fetching riders:", error);
        toast.error("Failed to fetch riders.");
      });
  }, [id]);

  // Update Orders
  const updateOrder = (e) => {    
    e.preventDefault();

    const updatedOrderData = {
      cust_name: custName,
      cust_city: custCity,
      cust_address: custAddress,
      cust_town: custTown,
      cust_number: custNumber,
      delivery_charges: deliveryCharges,
      amount,
      feedback,
      status,
      rider_id,
    };

    axiosInstance
      .put(updateOrderEndpoint, updatedOrderData)
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
            navigate("/OrdersList");
          }, 1000);
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

  return (
    <>
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

      <div style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="md:w-[68vw] lg:w-[80vw] mt-8 w-[100vw] overflow-scroll h-[100vh] mx-auto p-4 md:p-6 lg:p-6">
        <form
          onSubmit={updateOrder}
          className="bg-white shadow-md rounded-lg px-4 md:px-8 pt-6 pb-8 mb-4"
        >
          <div className="parent lg:flex lg:flex-wrap lg:justify-evenly">
            <div className="mb-3 lg:w-2/5">
              <label
                htmlFor="custName"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Customer Name
              </label>
              <Input
                btnType="text"
                placeholder="Enter Customer Name"
                onChange={(e) => setCustName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={custName}
                btnName="custName"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="custCity"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Customer City
              </label>
              <Input
                btnType="text"
                placeholder="Enter Customer City"
                onChange={(e) => setCustCity(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={custCity}
                btnName="custCity"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="custAddress"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Customer Address
              </label>

              <Input
                btnType="text"
                placeholder="Enter Customer Address"
                onChange={(e) => setCustAddress(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={custAddress}
                btnName="custAddress"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Customer Town
              </label>

              <select
                id="custTown"
                // Ensure this value is bound to state
                onChange={(e) => setCustTown(e.target.value)} // Update state on change
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value={custTown}>{custTown}</option>
                <optgroup label="Karachi Central">
                  <option value="Liaquatabad">Liaquatabad Town</option>
                  <option value="Gulberg">Gulberg Town</option>
                  <option value="North Nazimabad">North Nazimabad Town</option>
                  <option value="New Karachi">New Karachi Town</option>
                </optgroup>
                <optgroup label="Karachi East">
                  <option value="Gulshan-e-Iqbal">Gulshan-e-Iqbal Town</option>
                  <option value="Jamshed">Jamshed Town</option>
                  <option value="Ferozabad">Ferozabad</option>
                  <option value="Gulistan-e-Jauhar">Gulistan-e-Jauhar</option>
                </optgroup>
                <optgroup label="Karachi South">
                  <option value="Saddar">Saddar Town</option>
                  <option value="Lyari">Lyari Town</option>
                  <option value="Clifton">Clifton</option>
                  <option value="DHA">DHA</option>
                </optgroup>
                <optgroup label="Karachi West">
                  <option value="Orangi">Orangi Town</option>
                  <option value="SITE">SITE Town</option>
                  <option value="Baldia">Baldia Town</option>
                  <option value="Mominabad">Mominabad</option>
                  <option value="Manghopir">Manghopir</option>
                </optgroup>
                <optgroup label="Korangi">
                  <option value="Korangi">Korangi Town</option>
                  <option value="Landhi">Landhi Town</option>
                  <option value="Shah Faisal">Shah Faisal Town</option>
                  <option value="Ibrahim Hyderi">Ibrahim Hyderi</option>
                </optgroup>
                <optgroup label="Malir">
                  <option value="Malir">Malir Town</option>
                  <option value="Bin Qasim">Bin Qasim Town</option>
                  <option value="Gadap">Gadap Town</option>
                </optgroup>
                <optgroup label="Kemari">
                  <option value="Kemari">Kemari</option>
                  <option value="Hawkesbay">Hawkesbay</option>
                </optgroup>
              </select>
            </div>
            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="custNumber"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Customer Number
              </label>
              <Input
                btnType="text"
                placeholder="Enter Customer Number"
                onChange={(e) => setCustNumber(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={custNumber}
                btnName="custNumber"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="amount"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Amount
              </label>
              <Input
                btnType="text"
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={amount}
                btnName="amount"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="deliveryCharges"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Delivery Charges
              </label>
              <Input
                btnType="number"
                placeholder="Enter Amount"
                onChange={(e) => setDeliveryCharges(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={deliveryCharges}
                btnName="deliveryCharges"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="status"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Status
              </label>

              {status === "complete" ? (
                <p className="text-green-500">Completed!</p>
              ) : (
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="inprocess">In Process</option>
                  <option value="return">Return</option>
                  <option value="delivered">Delivired</option>
                  <option value="hold">Hold</option>
                  <option value="canceled">Canceled</option>
                  <option value="complete">Complete</option>

                </select>
              )}
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="feedback"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Feedback
              </label>
              <textarea
                id="feedback"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Enter Feedback"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>

            <div className="mb-3 lg:w-2/5 ">
              <label
                htmlFor="rider_id"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Assign Rider
              </label>
              <select
                id="rider_id"
                onChange={(e) => setRiderId(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              >
                <option selected disabled value={rider_id._id}>
                  {rider_id.name}
                </option>

                {/* loop api  */}
                {riders.map((rider) => (
                  <option value={rider._id}>{rider.name}</option>
                ))}
              </select>
            </div>

            <div className="mb-3 lg:w-2/5 md:mt-4">
              <button
                type="submit"
                className="bg-gray-700 w-full hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Update Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrdersUpdate;
