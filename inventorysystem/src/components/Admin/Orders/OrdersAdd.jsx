import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Input from "../Input/Input";
import axiosInstance from "../../../utils/axiosInstance";

const OrdersAdd = () => {
  // Orders State
  const [rider_id, setRiderId] = useState("");
  const [custName, setCustName] = useState("");
  const [custCity, setCustCity] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [custTown, setCustTown] = useState("");
  const [custNumber, setCustNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [deliveryCharges, setDeliveryCharges] = useState("");

  const [riders, setRiders] = useState([]);
  const navigate = useNavigate();
  // Fetch Riders Dropdown on Orders
  useEffect(() => {
    axiosInstance
      .get(import.meta.env.VITE_RIDER_ENDPOINT)
      .then((response) => {
        const ridersList = response.data.data || [];
        setRiders(ridersList);
      })
      .catch((error) => {
        console.error("Error fetching riders:", error);
        toast.error("Failed to fetch riders.");
      });
  }, []);
  // Add Orders
  const addOrder = (e) => {
    e.preventDefault();

    const ordersData = {
      rider_id,
      cust_name: custName,
      cust_city: custCity,
      cust_address: custAddress,
      cust_town: custTown,
      cust_number: custNumber,
      amount,
    };

    // Agar `deliveryCharges` fill kiya gaya hai toh usko add karo ordersData mein
    if (deliveryCharges !== "") {
      ordersData.delivery_charges = deliveryCharges;
    }

    axiosInstance
      .post(import.meta.env.VITE_ORDER_ENDPOINT, ordersData)
      .then((response) => {
        if (response.data.success) {
          toast.success("Order Added Successfully", {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: Bounce,
          });
          setRiderId("");
          setCustName("");
          setCustCity("");
          setCustAddress("");
          setCustTown("");
          setCustNumber("");
          setAmount("");
          setDeliveryCharges("");
          setTimeout(() => {
            navigate("/OrdersList");
          }, 3000);
        }
      })
      .catch((error) => {
        if (error.response) {
          const { status, data } = error.response;

          if (status === 400) {
            toast.error(data.message || "Error in Adding Order", {
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
        <h1 className=" md:text-3xl font-bold mb-4  text-center">
          Add Orders To Rider
        </h1>
        <form
          onSubmit={addOrder}
          className="bg-white shadow-md rounded-lg px-4 md:px-8 pt-6 pb-8 mb-4"
        >
          <div className="parent lg:flex lg:flex-wrap lg:justify-evenly">
            <div className="mb-4 lg:w-2/5 ">
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
            <div className="mb-4 lg:w-2/5">
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
            <div className="mb-4 lg:w-2/5">
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
            <div className="mb-4 lg:w-2/5">
              <label
                htmlFor="custAddress"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Customer Town
              </label>
              <select
                id="karachitowns"
                value={custTown}
                onChange={(e) => setCustTown(e.target.value)}
                className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option value="">All Towns</option>
                {/* Replace these options with actual town names */}
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
            <div className="mb-4 lg:w-2/5">
              <label
                htmlFor="custNumber"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Contact Number
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
            <div className="mb-4 lg:w-2/5">
              <label
                htmlFor="riderId"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider
              </label>
              <div className="relative">
                <select
                  id="riderId"
                  value={rider_id}
                  onChange={(e) => setRiderId(e.target.value)}
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="">Select Rider</option>
                  {riders.map((rider) => (
                    <option key={rider._id} value={rider._id}>
                      {rider.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293l-1.414 1.414L10 14.828l6.121-6.121-1.414-1.414L10 12z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-4 lg:w-2/5">
              <label
                htmlFor="amount"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Amount
              </label>
              <Input
                btnType="number"
                placeholder="Enter Amount"
                onChange={(e) => setAmount(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={amount}
                btnName="amount"
              />
            </div>

            <div className="mb-4 lg:w-2/5">
              <label
                htmlFor="deliveryCharges"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Delivery Charges
              </label>
              <Input
                btnType="number"
                placeholder="Enter Delivery Charges"
                onChange={(e) => setDeliveryCharges(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={deliveryCharges}
                btnName="deliveryCharges"
              />
            </div>

            <div className="mb-4  lg:w-2/5">
              <button
                type="submit"
                className="bg-gray-700 w-full hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Add Order
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default OrdersAdd;
