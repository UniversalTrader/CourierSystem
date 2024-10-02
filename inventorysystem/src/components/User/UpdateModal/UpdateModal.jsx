import React from "react";

function UpdateModal({ onClose }) {
  return (
    <div className="fixed inset-0 flex justify-center items-center z-50 ">
     
 

      {/* Modal content */}
      <div className=" relative mt-6 flex flex-col gap-5 bg-red-600  rounded-xl px-8 py-6 text-white ">
        <button className="place-self-end text-whit" onClick={onClose}>
          Close
        </button>
        <h1 className="text-3xl font-extrabold text-center">Update Status</h1>
        <p className="text-xl font-bold text-center max-w-md">
          Update your status and feedback
        </p>
        <form className="w-full">
          <input
            type="text"
            placeholder="status"
            className="w-full px-4 py-3 text-black border border-gray-300 rounded-md mb-4"
          />
          <button
            type="submit"
            className="mt-4 w-full flex items-center justify-center gap-2 px-5 py-3 font-medium rounded-md bg-black text-white hover:bg-blue-700 transition-colors"
          >
            Update Now
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdateModal;
