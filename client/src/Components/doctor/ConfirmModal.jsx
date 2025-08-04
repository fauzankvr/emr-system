import React from "react"; 
import { toast } from "react-toastify";

const ConfirmToast = ({ message, onConfirm, onCancel }) => (
  <div>
    <p>{message}</p>
    <div className="mt-2 flex justify-end gap-2">
      <button
        className="px-3 py-1 bg-gray-300 rounded"
        onClick={onCancel}
      >
        No
      </button>
      <button
        className="px-3 py-1 bg-red-600 text-white rounded"
        onClick={onConfirm}
      >
        Yes
      </button>
    </div>
  </div>
);

export default ConfirmToast;
