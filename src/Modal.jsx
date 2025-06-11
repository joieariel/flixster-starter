import React from "react";
import "./Modal.css";

// isOpen = bool controlling if the modal is open
// onClose = function to call when modal should close
// backdropPath = path to the movie backdrop image
// children = what is displayed in the modal
const Modal = ({ isOpen, onClose, backdropPath, children }) => {
  if (!isOpen) return null;

  // construct full backdrop URL
  const backdropUrl = backdropPath
    ? `https://image.tmdb.org/t/p/w1280${backdropPath}`
    : null; // handles case for if no image is available preventing potential errors

  return (
    // note to self: onClick prop tells React what function to call when element is clicked
    <div className="modal-overlay" onClick={onClose}>
      {/* use propagation to prevent clicks inside modal to close modal */}
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        // add backdrop image to modal if available and style it
        style={backdropUrl ? {
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url(${backdropUrl})`,
          backgroundSize: '100% auto',
          backgroundPosition: 'top center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: 'transparent',
          color: 'white',
          paddingTop: '180px'
        } : {}}
      >
        <button className="modal-close-btn" onClick={onClose}>
          &times;
        </button>
        {/* render children that were passed to the modal */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
