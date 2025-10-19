import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosInstance";
import { FaEye, FaEdit, FaTrash, FaFileAlt } from "react-icons/fa";
import PatientDetailsModal from "../../Components/doctor/models/PatientDetails";
import PrescriptionModal from "../../Components/doctor/models/PrescriptionModal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function PatientHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    prescriptions: [],
  });
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/prescription");
        const prescriptionsData =
          response.data?.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          ) || [];

        setDashboardData({
          prescriptions: prescriptionsData,
        });
        setFilteredPrescriptions(prescriptionsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching prescription data", error);
        setError("Failed to load prescription data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter prescriptions based on search query
    const filtered = dashboardData.prescriptions.filter((pres) => {
      const patient = pres.patient;
      if (!patient) return false;
      const searchLower = searchQuery.toLowerCase();
      return (
        (patient.name && patient.name.toLowerCase().includes(searchLower)) ||
        (patient.email && patient.email.toLowerCase().includes(searchLower)) ||
        (patient.phone && patient.phone.includes(searchLower))
      );
    });
    setFilteredPrescriptions(filtered);
  }, [searchQuery, dashboardData.prescriptions]);

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription.patient);
    setShowPatientModal(true);
  };

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowPrescriptionModal(true);
  };

  const handleDeletePrescription = (prescriptionId) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this prescription?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={closeToast}
          >
            No
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              closeToast();
              try {
                await axiosInstance.delete(`/api/prescription/${prescriptionId}`);
                
                // Update state after deletion
                setDashboardData((prev) => ({
                  ...prev,
                  prescriptions: prev.prescriptions.filter(
                    (pres) => pres._id !== prescriptionId
                  ),
                }));
  
                setFilteredPrescriptions((prev) =>
                  prev.filter((pres) => pres._id !== prescriptionId)
                );
  
                toast.success("Prescription deleted successfully!");
              } catch (error) {
                console.error("Error deleting prescription", error);
                toast.error("Failed to delete prescription. Please try again later.");
              }
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    );
  
    toast.info(<ConfirmToast />, {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  };
  

  const handleEditPrescription = (prescription) => {
    if (prescription && prescription.patient && prescription.doctor && prescription._id) {
      navigate(`/doctor/prescription?patientId=${prescription.patient._id}&doctorId=${prescription.doctor._id}&id=${prescription._id}`);
    } else {
      console.log("Edit prescription: missing patient, doctor, or id", prescription);
    }
  };

  const handleSaveAsTemplate = (prescription) => {
    // Navigate to prescription page with template creation mode
    if (prescription && prescription.patient && prescription.doctor && prescription._id) {
      navigate(`/doctor/prescription?patientId=${prescription.patient._id}&doctorId=${prescription.doctor._id}&id=${prescription._id}&saveAsTemplate=true`);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };



  return (
    <>
      <ToastContainer />
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Patients History</h1>

        {/* Search Input */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by patient name, email, or phone"
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full max-w-md p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="bg-white rounded-lg shadow p-4">
            {loading ? (
              <div className="flex justify-center p-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>
            ) : filteredPrescriptions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-3 px-3 text-left">Patient</th>
                      <th className="py-3 px-3 text-left">Date</th>
                      <th className="py-3 px-3 text-left">Diagnosis</th>
                      <th className="py-3 px-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredPrescriptions.map((pres) => (
                      <tr key={pres._id} className="hover:bg-gray-50">
                        <td className="py-3 px-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                              {pres.patient && pres.patient.name
                                ? pres.patient.name[0]?.toUpperCase()
                                : "P"}
                            </div>
                            <div>
                              <div className="font-medium">
                                {pres.patient && pres.patient.name
                                  ? pres.patient.name
                                  : "Unknown"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {pres.patient && pres.patient.phone
                                  ? pres.patient.phone
                                  : "-"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          {new Intl.DateTimeFormat("en-GB", {
                            timeZone: "UTC",
                          }).format(new Date(pres.updatedAt))}
                        </td>

                        <td className="py-3 px-3">{pres.diagnosis}</td>
                        <td className="py-3 px-3">
                          <div className="flex space-x-4">
                            <button
                              onClick={() => handleViewDetails(pres)}
                              className="text-blue-600 hover:text-blue-800 cursor-pointer"
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => handleViewPrescription(pres)}
                              className="text-blue-600 hover:text-blue-800  cursor-pointer"
                              title="View Prescription"
                            >
                              Prescription
                            </button>
                            <button
                              onClick={() => handleEditPrescription(pres)}
                              className="text-yellow-600 hover:text-yellow-800  cursor-pointer"
                              title="Edit Prescription"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleSaveAsTemplate(pres)}
                              className="text-green-600 hover:text-green-800  cursor-pointer"
                              title="Save as Template"
                            >
                              <FaFileAlt />
                            </button>
                            <button
                              onClick={() => handleDeletePrescription(pres._id)}
                              className="text-red-600 hover:text-red-800  cursor-pointer"
                              title="Delete Prescription"
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No prescriptions found
              </div>
            )}
          </div>
        </div>

        {/* Patient Details Modal */}
        {showPatientModal && (
          <PatientDetailsModal
            patient={selectedPrescription}
            onClose={() => setShowPatientModal(false)}
          />
        )}

        {/* Prescription Modal */}
        {showPrescriptionModal && (
          <PrescriptionModal
            prescriptionId={selectedPrescription._id}
            onClose={() => setShowPrescriptionModal(false)}
          />
        )}
      </div>
    </>
  );
}

export default PatientHistoryPage;
