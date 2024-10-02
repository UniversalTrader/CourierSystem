import React, { useEffect, useState } from "react";
import Input from "../Input/Input";
import { useNavigate, useParams } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../utils/axiosInstance";
import { IoEye, IoEyeOff } from "react-icons/io5";

function RidersUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const updateRiderEndpoint = `${import.meta.env.VITE_RIDER_ENDPOINT}/${id}`;

  // Rider State
  const [riders, setRiders] = useState({
    name: "",
    email: "",
    password: "",
    location: "",
    remaining_balance: "",
    image: null, // Add image field
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fetch Rider on Component Mount
  useEffect(() => {
    axiosInstance
      .get(updateRiderEndpoint)
      .then((response) => {
        setRiders(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching rider:", error);
        toast.error("Failed to fetch rider data", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
      });
  }, [id]);

  // Handle Input Change
  const handleChange = (e) => {
    setRiders({
      ...riders,
      [e.target.name]: e.target.value,
    });
  };

  // Handle Image Upload
  const handleImageChange = (e) => {
    setRiders({
      ...riders,
      image: e.target.files[0],
    });
  };

  // Handle Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(riders).forEach((key) => {
      if (key === "image" && riders.image) {
        formData.append("image", riders.image);
      } else {
        formData.append(key, riders[key]);
      }
    });

    try {
      await axiosInstance.put(updateRiderEndpoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/RidersList");
    } catch (error) {
      console.error("Failed to update rider:", error);
      toast.error("Failed to update rider. Please try again.", {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="md:w-[68vw] lg:w-[76vw] mt-8 w-[100vw] overflow-scroll h-[100vh] mx-auto p-4 md:p-6 lg:p-6">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">
          Update Rider
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded-lg px-4 py-6 md:px-8 md:py-8"
        >
          <div className="parent lg:flex lg:flex-wrap lg:justify-evenly">
            <div className="mb-4 lg:w-2/5 ">
              <label
                htmlFor="riderName"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider Name
              </label>
              <Input
                type="text"
                placeholder="Enter Rider Name"
                onChange={handleChange}
                className="mb-4"
                value={riders.name}
                name="name"
              />
            </div>

            <div className="mb-4 lg:w-2/5 ">
              <label
                htmlFor="riderEmail"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider Email
              </label>
              <Input
                type="email"
                placeholder="Enter Rider Email"
                onChange={handleChange}
                className="mb-4"
                value={riders.email}
                name="email"
              />
            </div>

            <div className="mb-4 lg:w-2/5 relative">
              <label
                htmlFor="riderPassword"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider Password
              </label>
              <Input
                btnType={showPassword ? "text" : "password"} // Toggle input type
                placeholder="Enter Rider Password"
                onChange={handleChange}
                className="mb-4"
                btnValue={riders.password}
                btnName="password"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-10   text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />}
              </button>
            </div>

            <div className="mb-4 lg:w-2/5 ">
              <label
                htmlFor="location"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Location
              </label>
              <Input
                type="text"
                placeholder="Enter Location"
                onChange={handleChange}
                className="mb-4"
                value={riders.location}
                name="location"
              />
            </div>
            <div className="mb-4 lg:w-2/5 ">
              <label
                htmlFor="Amount"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Remaining Balance
              </label>
              <Input
                type="number"
                placeholder="Enter Amount"
                onChange={handleChange}
                className="mb-4"
                value={riders.remaining_balance}
                name="remaining_balance"
              />
            </div>

            <div className="mb-4 lg:w-2/5">
              <label
                htmlFor="image"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider Image
              </label>
              <input
                type="file"
                onChange={handleImageChange}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4 lg:w-[30%]">
              <button
                type="submit"
                className="bg-gray-700 w-full hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default RidersUpdate;
