import { useState, useEffect, useRef } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import { VscFilePdf } from "react-icons/vsc";

function VerticalDropdown({ onBulkDelete, onGeneratePdf }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-block text-left">
      <button
        id="dropdownDefaultButton"
        onClick={toggleDropdown}
        className="text-white bg-gray-900 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-2 text-center inline-flex items-center"
        type="button"
      >
        <HiDotsVertical />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div
          id="dropdown"
          className="z-10 absolute left-0 mt-2 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
        >
          <ul
            className="py-2 text-sm text-gray-700"
            aria-labelledby="dropdownDefaultButton"
          >
            <li>
              <button
                className="block px-4 py-2 w-full text-left hover:bg-red-600 hover:text-white"
                onClick={onBulkDelete}
              >
                <FaTrashAlt size={18} className="inline-block mr-2 text-red-500 hover:text-white" />
                Delete Orders
              </button>
            </li>
            <li>
              <button
                onClick={onGeneratePdf}
                className="block px-4 py-2 w-full text-left hover:bg-blue-600 hover:text-white"
              >
                <VscFilePdf size={18} className="inline-block mr-2" />
                Generate Pdf
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default VerticalDropdown;
