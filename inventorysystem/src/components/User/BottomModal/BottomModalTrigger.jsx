import React, { useState } from 'react';

import BottomModal from './BottomModal';

const BottomModalTrigger = () => {
  const [isBottomModalOpen, setBottomModalOpen] = useState(false);

  const toggleBottomModal = () => {
    setBottomModalOpen(!isBottomModalOpen);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {/* Trigger Button */}
      <button
        onClick={toggleBottomModal}
        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300 ease-in-out"
      >
        Open Modal
      </button>

      {/* Modal */}
      <BottomModal isOpenBottom={isBottomModalOpen} onCloseBottom={toggleBottomModal}>
        {/* <p className="text-gray-700">
          This is a modal that appears at the bottom of the screen.
        </p> */}
      </BottomModal>
    </div>
  );
};

export default BottomModalTrigger;
