import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../API/axiosInstance";
import { FaEye, FaEdit, FaTrash, FaSearch, FaPlus, FaUser, FaSpinner, FaTimes } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    dob: "",
    vitals: {
      spo2: "",
      bp: "",
      pulse: "",
      temp: "",
      weight: ""
    }
  });
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/api/patient");
      setPatients(res.data.data || []);
    } catch (err) {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  };

  // Filter patients based on search term
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewModal(true);
  };

  const handleEdit = (patient) => {
    setEditForm({ 
      ...patient,
      vitals: patient.vitals || {
        spo2: "",
        bp: "",
        pulse: "",
        temp: "",
        weight: ""
      }
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vitals.')) {
      const vitalKey = name.split('.')[1];
      setEditForm(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          [vitalKey]: value
        }
      }));
    } else {
      setEditForm({ ...editForm, [name]: value });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editForm.name.trim()) {
      toast.error("Patient name is required");
      return;
    }
    setEditLoading(true);
    try {
      await axiosInstance.put(`/api/patient/${editForm._id}`, editForm);
      toast.success("Patient updated successfully!");
      setShowEditModal(false);
      fetchPatients();
    } catch (err) {
      toast.error("Failed to update patient");
    } finally {
      setEditLoading(false);
    }
  };

  const handleAddChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('vitals.')) {
      const vitalKey = name.split('.')[1];
      setAddForm(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          [vitalKey]: value
        }
      }));
    } else {
      setAddForm({ ...addForm, [name]: value });
    }
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) {
      toast.error("Patient name is required");
      return;
    }
    setAddLoading(true);
    try {
      await axiosInstance.post("/api/patient", addForm);
      toast.success("Patient added successfully!");
      setShowAddModal(false);
      setAddForm({
        name: "",
        email: "",
        phone: "",
        gender: "",
        age: "",
        dob: "",
        vitals: {
          spo2: "",
          bp: "",
          pulse: "",
          temp: "",
          weight: ""
        }
      });
      fetchPatients();
    } catch (err) {
      toast.error("Failed to add patient");
    } finally {
      setAddLoading(false);
    }
  };

  const handleDelete = (id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this patient?</p>
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
              setDeletingId(id);
              try {
                await axiosInstance.delete(`/api/patient/${id}`);
                toast.success("Patient deleted successfully!");
                fetchPatients();
              } catch (err) {
                toast.error("Failed to delete patient");
              } finally {
                setDeletingId(null);
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

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center py-12">
      <FaSpinner className="animate-spin text-3xl text-blue-500" />
      <span className="ml-3 text-lg text-gray-600">Loading patients...</span>
    </div>
  );

  const EmptyState = () => (
    <div className="text-center py-12">
      <FaUser className="mx-auto text-6xl text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No patients found</h3>
      <p className="text-gray-500">Start by adding your first patient</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <ToastContainer />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
              <p className="text-gray-600 mt-1">Manage and view all patient records</p>
            </div>
            <button 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              onClick={() => setShowAddModal(true)}
            >
              <FaPlus /> Add New Patient
            </button>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search patients by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-4 text-sm">
              <div className="bg-blue-50 px-4 py-2 rounded-lg">
                <span className="text-blue-600 font-semibold">{filteredPatients.length}</span>
                <span className="text-gray-600 ml-1">Total Patients</span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient Table */}
        <div className="bg-white rounded-lg shadow-sm">
          {loading ? (
            <LoadingSpinner />
          ) : filteredPatients.length === 0 ? (
            <EmptyState />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient Info
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Demographics
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentPatients.map((patient) => (
                      <tr key={patient._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <FaUser className="text-blue-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {patient.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {patient._id.slice(-8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{patient.email}</div>
                          <div className="text-sm text-gray-500">{patient.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {patient.gender}, {patient.age} years
                          </div>
                          {patient.dob && (
                            <div className="text-sm text-gray-500">
                              DOB: {new Date(patient.dob).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient.updatedAt ? new Date(patient.updatedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="text-blue-600 hover:text-blue-900 p-2 hover:bg-blue-50 rounded-lg transition-colors"
                              onClick={() => handleView(patient)}
                              title="View Details"
                            >
                              <FaEye />
                            </button>
                            <button
                              className="text-yellow-600 hover:text-yellow-900 p-2 hover:bg-yellow-50 rounded-lg transition-colors"
                              onClick={() => handleEdit(patient)}
                              title="Edit Patient"
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              onClick={() => handleDelete(patient._id)}
                              disabled={deletingId === patient._id}
                              title="Delete Patient"
                            >
                              {deletingId === patient._id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                  <div className="flex-1 flex justify-between sm:hidden">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{indexOfFirstPatient + 1}</span> to{' '}
                        <span className="font-medium">
                          {Math.min(indexOfLastPatient, filteredPatients.length)}
                        </span>{' '}
                        of <span className="font-medium">{filteredPatients.length}</span> results
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        {Array.from({ length: totalPages }, (_, i) => (
                          <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              currentPage === i + 1
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Add New Patient</h2>
                  <p className="text-gray-600 mt-1">Enter patient information and vitals</p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleAddSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={addForm.name}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={addForm.email}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      value={addForm.phone}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={addForm.gender}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={addForm.age}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      name="dob"
                      type="date"
                      value={addForm.dob}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Vitals */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Vital Signs</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SpO2 (%)</label>
                    <input
                      name="vitals.spo2"
                      value={addForm.vitals.spo2}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 98"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                    <input
                      name="vitals.bp"
                      value={addForm.vitals.bp}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 120/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pulse (bpm)</label>
                    <input
                      name="vitals.pulse"
                      value={addForm.vitals.pulse}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 72"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                    <input
                      name="vitals.temp"
                      value={addForm.vitals.temp}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 98.6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      name="vitals.weight"
                      value={addForm.vitals.weight}
                      onChange={handleAddChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 70"
                    />
                  </div>
                </div>
              </div>
            </form>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleAddSubmit}
                disabled={addLoading}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {addLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
                {addLoading ? "Adding..." : "Add Patient"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced View Modal */}
      {showViewModal && selectedPatient && (
        <div className="fixed inset-0 bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Patient Details</h2>
              <p className="text-gray-600 mt-1">Complete patient information</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Basic Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Full Name</label>
                      <p className="text-gray-900 font-medium">{selectedPatient.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email Address</label>
                      <p className="text-gray-900">{selectedPatient.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone Number</label>
                      <p className="text-gray-900">{selectedPatient.phone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{selectedPatient.gender}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Age</label>
                      <p className="text-gray-900">{selectedPatient.age} years</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">
                        {selectedPatient.dob ? new Date(selectedPatient.dob).toLocaleDateString() : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">System Information</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Patient ID</label>
                      <p className="text-gray-900 font-mono text-sm">{selectedPatient._id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Created Date</label>
                      <p className="text-gray-900">
                        {selectedPatient.createdAt ? new Date(selectedPatient.createdAt).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Last Updated</label>
                      <p className="text-gray-900">
                        {selectedPatient.updatedAt ? new Date(selectedPatient.updatedAt).toLocaleDateString() : 'Not available'}
                      </p>
                    </div>
                  </div>

                  {selectedPatient.vitals && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Vital Signs</h3>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <label className="text-sm font-medium text-blue-700">SpO2</label>
                          <p className="text-blue-900 font-semibold">{selectedPatient.vitals.spo2 || 'N/A'}</p>
                        </div>
                        <div className="bg-red-50 p-3 rounded-lg">
                          <label className="text-sm font-medium text-red-700">Blood Pressure</label>
                          <p className="text-red-900 font-semibold">{selectedPatient.vitals.bp || 'N/A'}</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg">
                          <label className="text-sm font-medium text-green-700">Pulse</label>
                          <p className="text-green-900 font-semibold">{selectedPatient.vitals.pulse || 'N/A'}</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <label className="text-sm font-medium text-yellow-700">Temperature</label>
                          <p className="text-yellow-900 font-semibold">{selectedPatient.vitals.temp || 'N/A'}</p>
                        </div>
                        <div className="bg-purple-50 p-3 rounded-lg col-span-2">
                          <label className="text-sm font-medium text-purple-700">Weight</label>
                          <p className="text-purple-900 font-semibold">{selectedPatient.vitals.weight || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-xl">
              <button
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                onClick={() => setShowViewModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Edit Modal with Vitals */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ backdropFilter: 'blur(4px)' }}>
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Patient</h2>
                  <p className="text-gray-600 mt-1">Update patient information and vitals</p>
                </div>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
                >
                  <FaTimes size={20} />
                </button>
              </div>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="name"
                      value={editForm.name || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={editForm.email || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="phone"
                      value={editForm.phone || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="gender"
                      value={editForm.gender || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="age"
                      type="number"
                      value={editForm.age || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
                    <input
                      name="dob"
                      type="date"
                      value={editForm.dob ? editForm.dob.split('T')[0] : ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Vitals */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-gray-900 border-b pb-2">Vital Signs</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">SpO2 (%)</label>
                    <input
                      name="vitals.spo2"
                      value={editForm.vitals?.spo2 || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 98"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Pressure</label>
                    <input
                      name="vitals.bp"
                      value={editForm.vitals?.bp || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 120/80"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pulse (bpm)</label>
                    <input
                      name="vitals.pulse"
                      value={editForm.vitals?.pulse || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 72"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Temperature (°F)</label>
                    <input
                      name="vitals.temp"
                      value={editForm.vitals?.temp || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 98.6"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
                    <input
                      name="vitals.weight"
                      value={editForm.vitals?.weight || ""}
                      onChange={handleEditChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 70"
                    />
                  </div>
                </div>
              </div>
            </form>
            
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3 rounded-b-lg">
              <button
                type="button"
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowEditModal(false)}
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleEditSubmit}
                disabled={editLoading}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {editLoading ? <FaSpinner className="animate-spin" /> : <FaEdit />}
                {editLoading ? "Updating..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
