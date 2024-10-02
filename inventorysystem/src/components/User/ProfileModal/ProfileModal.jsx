import React from 'react';
import ReactDOM from 'react-dom';
import { FaTimes } from 'react-icons/fa'; // Import the close icon from react-icons
import './ProfileModal.css'; // Ensure you have this CSS file

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          <FaTimes className="icon" />
          <span className="sr-only">Close</span>
        </button>
        {children}
      </div>
    </div>,
    document.body
  );
}

export default Modal;
