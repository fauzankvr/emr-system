import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosInstance";
import {
  FaEye, FaEdit, FaTrash, FaFileAlt, FaChevronLeft, FaChevronRight,
  FaSearch, FaFileMedicalAlt, FaInbox,
} from "react-icons/fa";
import PatientDetailsModal from "../../Components/doctor/models/PatientDetails";
import PrescriptionModal from "../../Components/doctor/models/PrescriptionModal";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

function PatientHistoryPage() {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;

  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const navigate = useNavigate();

  // ---------- FETCH ----------
  const fetchPrescriptions = async (resetPage = false) => {
    try {
      setLoading(true);
      const currentPage = resetPage ? 1 : page;
      const params = new URLSearchParams({
        page: String(currentPage),
        limit: String(limit),
        search: searchQuery.trim(),
        sort: "updatedAt",
        order: "desc",
      });

      const res = await axiosInstance.get(`/api/prescription?${params}`);
      setPrescriptions(res.data.data || []);
      setMeta(res.data.meta || null);
      if (resetPage) setPage(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };

  // ONE EFFECT: mount + page + search
  useEffect(() => {
    fetchPrescriptions(searchQuery ? true : false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchQuery]);

  // ---------- ACTIONS ----------
  const handleViewDetails = (pres) => {
    setSelectedPrescription(pres.patient);
    setShowPatientModal(true);
  };

  const handleViewPrescription = (pres) => {
    console.log("Viewing prescription:", pres);
    setSelectedPrescription(pres);
    setShowPrescriptionModal(true);
  };

  const handleEditPrescription = (pres) => {
    navigate(
      `/doctor/prescription?patientId=${pres.patient._id}&doctorId=${pres.doctor._id}&id=${pres._id}`
    );
  };

  const handleSaveAsTemplate = (pres) => {
    navigate(
      `/doctor/prescription?patientId=${pres.patient._id}&doctorId=${pres.doctor._id}&id=${pres._id}&saveAsTemplate=true`
    );
  };

  const handleDeletePrescription = (id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Delete this prescription?</p>
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
                await axiosInstance.delete(`/api/prescription/${id}`);
                setPrescriptions((prev) => prev.filter((p) => p._id !== id));
                toast.success("Deleted!");
                fetchPrescriptions(); // refresh meta
              } catch {
                toast.error("Delete failed");
              }
            }}
          >
            Yes
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

  // ---------- PAGINATION ----------
  const Pagination = () => {
    if (!meta || meta.totalPages <= 1) return null;

    const start = meta.page ? (meta.page - 1) * meta.limit + 1 : 0;
    const end = meta.page ? Math.min(meta.page * meta.limit, meta.total) : 0;

    const pages = [];
    if (meta.totalPages <= 5) {
      for (let i = 1; i <= meta.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (meta.page > 3) pages.push("...");
      if (meta.page > 2) pages.push(meta.page - 1);
      if (meta.page !== 1 && meta.page !== meta.totalPages) pages.push(meta.page);
      if (meta.page < meta.totalPages - 1) pages.push(meta.page + 1);
      if (meta.page < meta.totalPages - 2) pages.push("...");
      pages.push(meta.totalPages);
    }
    const unique = [...new Set(pages)];

    return (
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {start} to {end} of {meta.total} entries
        </div>

        <div className="flex gap-1 items-center">
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={!meta.hasPrev}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronLeft className="h-4 w-4" />
          </button>

          {unique.map((pg, i) =>
            pg === "..." ? (
              <span key={`dot-${i}`} className="px-2 py-1">
                ...
              </span>
            ) : (
              <button
                key={pg}
                onClick={() => setPage(pg)}
                className={`px-3 py-1 rounded text-sm ${
                  pg === meta.page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {pg}
              </button>
            )
          )}

          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!meta.hasNext}
            className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  // ---------- RENDER ----------
  return (
    <div className="min-h-screen p-8 bg-gray-50 space-y-6">
      <ToastContainer />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Patients History</h1>

        <div className="relative w-full sm:w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search patient name / email / phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <FaInbox className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium">No prescriptions found</h3>
            <p className="mt-1 text-sm">
              Try adjusting your search or create a new prescription.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Patient
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Date
                    </th>
                    <th className="py-3 px-6 text-left text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Diagnosis
                    </th>
                    <th className="py-3 px-6 text-center text-xs font-medium text-gray-600 uppercase tracking-wider whitespace-nowrap">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {prescriptions.map((pres) => (
                    <tr key={pres._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="flex items-center">
                          <div className="h-9 w-9 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3 text-sm font-semibold">
                            {pres.patient?.name?.[0]?.toUpperCase() || "P"}
                          </div>
                          <div>
                            <div className="font-medium text-sm text-gray-900">
                              {pres.patient?.name || "Unknown"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {pres.patient?.phone || "No phone"}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-700">
                        {new Intl.DateTimeFormat("en-GB").format(new Date(pres.updatedAt))}
                      </td>

                      <td className="py-4 px-6 text-sm text-gray-700">
                        {pres.diagnosis ? (
                          pres.diagnosis
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <div className="flex justify-center items-center space-x-4 text-lg">
                          <button
                            onClick={() => handleViewDetails(pres)}
                            title="View Patient Details"
                            className="text-blue-600 cursor-pointer"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleViewPrescription(pres)}
                            title="View Prescription"
                            className="text-blue-600 cursor-pointer"
                          >
                            {/* <FaFileMedicalAlt /> */}
                            Prescription
                          </button>
                          <button
                            onClick={() => handleEditPrescription(pres)}
                            title="Edit"
                            className="text-gray-500 hover:text-yellow-600 transition-colors"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleSaveAsTemplate(pres)}
                            title="Save as Template"
                            className="text-gray-500 hover:text-green-600 transition-colors"
                          >
                            <FaFileAlt />
                          </button>
                          <button
                            onClick={() => handleDeletePrescription(pres._id)}
                            title="Delete"
                            className="text-gray-500 hover:text-red-600 transition-colors"
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

            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination />
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showPatientModal && (
        <PatientDetailsModal
          patient={selectedPrescription}
          onClose={() => setShowPatientModal(false)}
        />
      )}
      {showPrescriptionModal && (
        <PrescriptionModal
          prescriptionId={selectedPrescription._id}   // <-- pass whole object (adjust modal if needed)
          onClose={() => setShowPrescriptionModal(false)}
        />
      )}
    </div>
  );
}

export default PatientHistoryPage;