import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaSearch,
  FaPills,
  FaPrescriptionBottleAlt,
  FaCalendarAlt,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { axiosInstance } from "../../API/axiosInstance";

export default function MedicinePage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [medicines, setMedicines] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const response = await axiosInstance.get("/api/medicine");
      setMedicines(response.data);
    } catch (error) {
      console.error("Failed to fetch medicines:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/medicine/${id}`);
      setMedicines((prev) => prev.filter((med) => med._id !== id));
    } catch (error) {
      console.error("Failed to delete medicine:", error);
    }
  };

  const filteredMedicines = medicines.filter((med) =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Medicine Inventory</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          <FaPlus className="inline mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          icon={<FaPills />}
          label="Total Medicines"
          value={medicines.length}
        />
        <DashboardCard
          icon={<FaPrescriptionBottleAlt />}
          label="Different Dosage Forms"
          value={new Set(medicines.map((m) => m.dosageForm)).size}
        />
        <DashboardCard
          icon={<FaCalendarAlt />}
          label="Unique Strengths"
          value={new Set(medicines.map((m) => m.strength)).size}
        />
      </div>

      {/* Search Bar */}
      <div className="flex items-center mb-4">
        <div className="relative w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search medicines..."
            className="pl-10 pr-4 py-2 border rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded shadow">
          <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
            <tr>
              <th className="px-4 py-3 border-b">Name</th>
              <th className="px-4 py-3 border-b">Type</th>
              <th className="px-4 py-3 border-b">Strength</th>
              <th className="px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMedicines.map((medicine) => (
              <tr key={medicine._id} className="text-sm text-gray-600">
                <td className="px-4 py-3 border-b">{medicine.name}</td>
                <td className="px-4 py-3 border-b">{medicine.dosageForm}</td>
                <td className="px-4 py-3 border-b">{medicine.strength}</td>
                <td className="px-4 py-3 border-b space-x-5">
                  <button
                    onClick={() => {
                      setSelectedMedicine(medicine);
                      setShowViewModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FaEye />
                  </button>
                  <button
                    onClick={() => handleDelete(medicine._id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <AddMedicineModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newMed) => setMedicines((prev) => [...prev, newMed])}
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedMedicine && (
        <ViewMedicineModal
          medicine={selectedMedicine}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
}

// Dashboard card component
function DashboardCard({ icon, label, value }) {
  return (
    <div className="flex items-center bg-white p-4 rounded-lg shadow hover:shadow-md transition">
      <div className="text-blue-500 text-2xl mr-4">{icon}</div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
    </div>
  );
}

// Add medicine modal component
function AddMedicineModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    dosageForm: "",
    content: "",
    strength: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/api/medicine", formData);
      onAdd(res.data);
      onClose();
    } catch (err) {
      console.error("Failed to add medicine:", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Add Medicine</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Medicine Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="dosageForm"
            placeholder="Type"
            value={formData.dosageForm}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="strength"
            placeholder="Strength"
            value={formData.strength}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <input
            name="content"
            placeholder="Content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// View medicine modal component
function ViewMedicineModal({ medicine, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-xs flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] md:w-[500px]">
        <h2 className="text-xl font-semibold mb-4">Medicine Details</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>
            <strong>Name:</strong> {medicine.name}
          </p>
          <p>
            <strong>Type :</strong> {medicine.dosageForm}
          </p>
          <p>
            <strong>Strength:</strong> {medicine.strength}
          </p>
          <p>
            <strong>Content:</strong> {medicine.content}
          </p>
          {/* Add more fields here if needed */}
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
