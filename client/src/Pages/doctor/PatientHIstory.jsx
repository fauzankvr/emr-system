import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosInstance";
import { FaEye } from "react-icons/fa";
import PatientDetailsModal from "../../Components/doctor/models/PatientDetails";
import PrescriptionModal from "../../Components/doctor/models/PrescriptionModal";

function PatientHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    appointments: [],
  });
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [prescriptionDate, setDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/api/booking");
        const appointmentsData =
          response.data?.data
            .filter((item) => item.status === "completed")
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)) ||
          [];

        setDashboardData({
          appointments: appointmentsData,
        });
        setFilteredAppointments(appointmentsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    // Filter appointments based on search query
    const filtered = dashboardData.appointments.filter((appt) => {
      const patient = appt.patientId;
      const searchLower = searchQuery.toLowerCase();
      return (
        patient.name.toLowerCase().includes(searchLower) ||
        patient.email.toLowerCase().includes(searchLower) ||
        patient.phone.includes(searchLower)
      );
    });
    setFilteredAppointments(filtered);
  }, [searchQuery, dashboardData.appointments]);

  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowPatientModal(true);
  };

  const handleViewPrescription = (patientId, date) => {
    setSelectedPatientId(patientId);
    setDate(date);
    setShowPrescriptionModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
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
          ) : filteredAppointments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-3 px-3 text-left">Patient</th>
                    <th className="py-3 px-3 text-left">Date</th>
                    <th className="py-3 px-3 text-left">Time</th>
                    <th className="py-3 px-3 text-left">Reason</th>
                    <th className="py-3 px-3 text-left">Status</th>
                    <th className="py-3 px-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appt) => (
                    <tr
                      key={appt._id}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center mr-3">
                            {appt.patientId.name[0]?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {appt.patientId.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {appt.patientId.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {new Date(appt.updatedAt).toLocaleDateString("en-GB")}
                      </td>
                      <td className="py-3 px-3">{appt.timeSlot}</td>
                      <td className="py-3 px-3">
                        <div className="truncate max-w-xs">{appt.reason}</div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {appt.status}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleViewDetails(appt)}
                            className="text-blue-600 hover:text-blue-800"
                            title="View Details"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() =>
                              handleViewPrescription(
                                appt.patientId._id,
                                appt.updatedAt
                              )
                            }
                            className="text-blue-600 hover:text-blue-800"
                            title="View Prescription"
                          >
                            Prescription
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
              No appointments found
            </div>
          )}
        </div>
      </div>

      {/* Patient Details Modal */}
      {showPatientModal && selectedAppointment && (
        <PatientDetailsModal
          selectedAppointment={selectedAppointment}
          onClose={() => setShowPatientModal(false)}
        />
      )}

      {/* Prescription Modal */}
      {showPrescriptionModal && selectedPatientId && (
        <PrescriptionModal
          patientId={selectedPatientId}
          onClose={() => setShowPrescriptionModal(false)}
          date={prescriptionDate}
        />
      )}
    </div>
  );
}

export default PatientHistoryPage;
