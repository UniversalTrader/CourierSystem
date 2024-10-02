import React from 'react';

const BottomModal = ({ isOpenBottom, onCloseBottom, children }) => {
  if (!isOpenBottom) return null;

  return (
    <div className="fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-100">
      <div className="bg-white w-full max-w-lg rounded-t-lg p-6 shadow-lg mb-16">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
          <button
            onClick={onCloseBottom}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {/* Modal Content */}
        <div className="mt-4">{children}</div>

        <div className="mt-6 flex justify-end">
         <h1>Hello World</h1>
        </div>
      </div>
    </div>
  );
};

export default BottomModal;
