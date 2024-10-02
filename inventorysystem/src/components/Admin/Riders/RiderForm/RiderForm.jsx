import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bounce, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axiosInstance from "../../../../utils/axiosInstance";
import Input from "../../Input/Input";
import { IoEye, IoEyeOff } from "react-icons/io5";

const RiderForm = () => {
  const [name, setRiderName] = useState("");
  const [email, setRiderEmail] = useState("");
  const [password, setRiderPass] = useState("");
  const [location, setRiderLocation] = useState("");
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const addRider = async (e) => {
    e.preventDefault();

    // Create FormData object
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("location", location);
    if (image) formData.append("image", image);

    try {
      const response = await axiosInstance.post(
        import.meta.env.VITE_RIDER_ENDPOINT,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Rider Added Successfully", {
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
        setRiderName("");
        setRiderEmail("");
        setRiderPass("");
        setRiderLocation("");
        setImage(null); // Clear image
        setTimeout(() => {
          navigate("/RidersList");
        }, 3000);
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 400) {
          toast.error(data.message || "Error in Adding Rider", {
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
        } else {
          toast.error(data.error, {
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
        }
      } else {
        toast.error("Network Error. Please check your connection.", {
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
      }
    }
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      <div  className="md:w-[68vw] lg:w-[76vw] mt-8 w-[100vw] overflow-scroll h-[100vh] mx-auto p-4 md:p-6 lg:p-6">
        <form
          onSubmit={addRider}
          className="bg-white shadow-md rounded-lg px-4 md:px-8 pt-6 pb-8 mb-4 mt-10"
        >
          <h1 className="md:text-3xl font-bold mb-4  text-center">Add Rider</h1>

          <div className="parent lg:flex lg:flex-wrap lg:justify-evenly">
            <div className="mb-4 lg:w-2/5 ">
              <label
                htmlFor="riderName"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider Name
              </label>
              <Input
                btnType="text"
                placeholder="Enter Rider Name"
                onChange={(e) => setRiderName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={name}
                btnName="riderName"
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
                btnType="email"
                placeholder="Enter Rider Email"
                onChange={(e) => setRiderEmail(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={email}
                btnName="riderEmail"
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
                onChange={(e) => setRiderPass(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={password}
                btnName="riderPassword"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-10   text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <IoEye size={20} /> : <IoEyeOff size={20} />
                }
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
                btnType="text"
                placeholder="Enter Location"
                onChange={(e) => setRiderLocation(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                btnValue={location}
                btnName="location"
              />
            </div>

            <div className="mb-4 lg:w-2/5 ">
              <label
                htmlFor="image"
                className="block text-gray-700 text-sm md:text-base font-bold mb-2"
              >
                Rider Image
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
            <div className="mb-4  lg:w-2/5">
              <button
                type="submit"
                className="w-full bg-gray-700 hover:bg-gray-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default RiderForm;
