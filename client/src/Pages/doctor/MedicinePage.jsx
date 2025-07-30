import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaPills,
  FaPrescriptionBottleAlt,
  FaCalendarAlt,
  FaEye,
  FaTrash,
  FaEdit,
  FaFilter,
  FaTimes,
  FaChartLine,
} from "react-icons/fa";
import { axiosInstance } from "../../API/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function MedicinePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/medicine");
      setMedicines(response.data?.data || response.data || []);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
      toast.error("Failed to fetch medicines");
    } finally {
      setLoading(false);
    }
  };

  // Toast-based delete confirmation
  const handleDelete = (id) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this medicine?</p>
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
                await axiosInstance.delete(`/api/medicine/${id}`);
                setMedicines((prev) => prev.filter((med) => med._id !== id));
                toast.success("Medicine deleted successfully!");
              } catch (error) {
                console.error("Failed to delete medicine:", error);
                toast.error("Failed to delete medicine");
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

  const handleEdit = (medicine) => {
    setSelectedMedicine(medicine);
    setShowEditModal(true);
  };

  const handleUpdate = (updatedMedicine) => {
    setMedicines((prev) =>
      prev.map((med) =>
        med._id === updatedMedicine._id ? updatedMedicine : med
      )
    );
  };

  const filteredMedicines = medicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (med.content && med.content.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = !filterType || med.dosageForm === filterType;
    return matchesSearch && matchesFilter;
  });

  const uniqueTypes = [...new Set(medicines.map(m => m.dosageForm))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Medicine Inventory</h1>
            <p className="text-gray-600 mt-1">Manage your pharmacy stock efficiently</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 font-semibold"
          >
            <FaPlus />
            Add Medicine
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            icon={<FaPills />}
            label="Total Medicines"
            value={medicines.length}
            color="bg-blue-600"
            bgColor="bg-blue-50"
          />
          <DashboardCard
            icon={<FaPrescriptionBottleAlt />}
            label="Medicine Types"
            value={uniqueTypes.length}
            color="bg-green-600"
            bgColor="bg-green-50"
          />
          <DashboardCard
            icon={<FaChartLine />}
            label="Stock Items"
            value={medicines.filter(m => m.content).length}
            color="bg-purple-600"
            bgColor="bg-purple-50"
          />
          <DashboardCard
            icon={<FaCalendarAlt />}
            label="Categories"
            value={uniqueTypes.length}
            color="bg-orange-600"
            bgColor="bg-orange-50"
          />
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines by name or content..."
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Filter */}
            <div className="relative">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              >
                <option value="">All Types</option>
                {uniqueTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              <FaFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>
            
            {(searchQuery || filterType) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setFilterType("");
                }}
                className="px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaTimes />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Professional Data Table */}
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    S.No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Medicine Name
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Type/Form
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Content/Strength
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMedicines.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                      <div className="flex flex-col items-center">
                        <FaPills className="text-gray-300 text-4xl mb-4" />
                        <p className="text-lg font-medium text-gray-400 mb-2">
                          {searchQuery || filterType ? 'No medicines found' : 'No medicines yet'}
                        </p>
                        <p className="text-gray-400 mb-4">
                          {searchQuery || filterType 
                            ? 'Try adjusting your search or filter' 
                            : 'Add your first medicine to get started'
                          }
                        </p>
                        {!searchQuery && !filterType && (
                          <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Add First Medicine
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredMedicines.map((medicine, index) => (
                    <tr key={medicine._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <FaPills className="text-blue-600 text-sm" />
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-semibold text-gray-900">{medicine.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {medicine.dosageForm}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate" title={medicine.content}>
                          {medicine.content || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => {
                              setSelectedMedicine(medicine);
                              setShowViewModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <FaEye size={16} />
                          </button>
                          <button
                            onClick={() => handleEdit(medicine)}
                            className="text-green-600 hover:text-green-800 hover:bg-green-50 p-2 rounded-lg transition-colors"
                            title="Edit Medicine"
                          >
                            <FaEdit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(medicine._id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                            title="Delete Medicine"
                          >
                            <FaTrash size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Results Count */}
        {filteredMedicines.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredMedicines.length} of {medicines.length} medicines
          </div>
        )}

        {/* Modals */}
        {showAddModal && (
          <AddMedicineModal
            onClose={() => setShowAddModal(false)}
            onAdd={(newMed) => setMedicines((prev) => [...prev, newMed])}
          />
        )}

        {showEditModal && selectedMedicine && (
          <EditMedicineModal
            medicine={selectedMedicine}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdate}
          />
        )}

        {showViewModal && selectedMedicine && (
          <ViewMedicineModal
            medicine={selectedMedicine}
            onClose={() => setShowViewModal(false)}
          />
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

// Professional Dashboard Card
function DashboardCard({ icon, label, value, color, bgColor }) {
  return (
    <div className={`${bgColor} rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`${color} text-white p-3 rounded-lg shadow-sm`}>
          <div className="text-xl">{icon}</div>
        </div>
      </div>
    </div>
  );
}

// Professional Add Medicine Modal
function AddMedicineModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    dosageForm: "",
    content: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Medicine name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.post("/api/medicine", formData);
      onAdd(res.data?.data || res.data);
      toast.success("Medicine added successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to add medicine:", err);
      toast.error("Failed to add medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg shadow-2xl w-[90%] md:w-[500px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add New Medicine</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Enter medicine name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosage Form <span className="text-red-500">*</span>
            </label>
            <input
              name="dosageForm"
              placeholder="e.g., Tablet, Capsule, Syrup"
              value={formData.dosageForm}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content/Strength
            </label>
            <textarea
              name="content"
              placeholder="Enter medicine content or strength"
              value={formData.content}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Adding..." : "Add Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Professional Edit Medicine Modal
function EditMedicineModal({ medicine, onClose, onUpdate }) {
  const [formData, setFormData] = useState({
    name: medicine.name || "",
    dosageForm: medicine.dosageForm || "",
    content: medicine.content || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Medicine name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await axiosInstance.put(
        `/api/medicine/${medicine._id}`,
        formData
      );
      onUpdate(res.data?.data || res.data);
      toast.success("Medicine updated successfully!");
      onClose();
    } catch (err) {
      console.error("Failed to update medicine:", err);
      toast.error("Failed to update medicine");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg shadow-2xl w-[90%] md:w-[500px] p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Edit Medicine</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicine Name <span className="text-red-500">*</span>
            </label>
            <input
              name="name"
              placeholder="Enter medicine name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dosage Form <span className="text-red-500">*</span>
            </label>
            <input
              name="dosageForm"
              placeholder="e.g., Tablet, Capsule, Syrup"
              value={formData.dosageForm}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content/Strength
            </label>
            <textarea
              name="content"
              placeholder="Enter medicine content or strength"
              value={formData.content}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Medicine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Professional View Medicine Modal
function ViewMedicineModal({ medicine, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(4px)' }}>
      <div className="bg-white rounded-lg shadow-2xl w-[90%] md:w-[500px] p-6">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Medicine Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
          >
            <FaTimes size={18} />
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3 mb-4">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <FaPills size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{medicine.name}</h3>
              <p className="text-gray-600 text-sm">{medicine.dosageForm}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{medicine.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
              <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{medicine.dosageForm}</p>
            </div>
            
            {medicine.content && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Content/Strength</label>
                <p className="text-gray-900 bg-gray-50 px-3 py-2 rounded border">{medicine.content}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
