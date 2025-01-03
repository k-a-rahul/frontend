import { useEffect } from "react";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="w-full fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity">
      <div className="bg-white w-[95%] rounded-lg shadow-lg md:w-full max-w-lg p-6 relative transform transition-all scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 font-bold text-gray-600"
        >
          <span role="img" className="text-2xl hover:opacity-70">
            ❌
          </span>
        </button>
        <div className="overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
