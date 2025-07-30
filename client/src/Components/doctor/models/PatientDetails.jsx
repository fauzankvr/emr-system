import React from "react";
import {
  FaCalendarAlt,
  FaClock,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import DetailItem from "../common/DetailItem";
import { formatDate } from "../../../util/formatters";

function PatientDetailsModal({ patient, onClose }) {
  if (!patient) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-lg w-full mx-4 shadow-xl">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Prescription Details</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="mb-4 flex items-center space-x-3">
            <div className="h-12 w-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold">
              {patient.name[0]?.toUpperCase() || "P"}
            </div>
            <div>
              <h4 className="font-bold text-lg">
                {patient.name}
              </h4>
              <p className="text-sm text-gray-500">
                Age: {patient.age || "N/A"} years
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <DetailItem
              icon={<FaCalendarAlt />}
              label="Prescription Date"
              value={formatDate(patient.updatedAt)}
            />
            <DetailItem
              icon={<FaPhoneAlt />}
              label="Phone"
              value={patient.phone}
            />
            <DetailItem
              icon={<FaEnvelope />}
              label="Email"
              value={patient.email}
            />
            {patient.address && (
              <DetailItem
                icon={<FaMapMarkerAlt />}
                label="Address"
                value={`${patient.address.street || ""}, ${
                  patient.address.city || ""
                }`}
                col="col-span-2"
              />
            )}
          </div>

          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Close
            </button>
            {/* <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              Update
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PatientDetailsModal;
