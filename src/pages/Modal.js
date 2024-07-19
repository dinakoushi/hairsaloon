import React from 'react';
import "../assets/styles/modal.css";

const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <button onClick={onClose} className="modal-close-button">&times;</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
