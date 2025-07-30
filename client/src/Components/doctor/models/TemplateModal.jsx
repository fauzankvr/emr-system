import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../API/axiosInstance';
import { Search, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'react-toastify';

const TemplateModal = ({ 
  isOpen, 
  onClose, 
  template = null, 
  onSave,
  prescriptionData = null 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    medicines: [],
    diagnosis: '',
    notes: '',
    labReports: [],
    labTest: []
  });
  const [medicines, setMedicines] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMedicines();
      if (template) {
        setFormData({
          name: template.name || '',
          description: template.description || '',
          medicines: template.medicines || [],
          diagnosis: template.diagnosis || '',
          notes: template.notes || '',
          labReports: template.labReports || [],
          labTest: template.labTest || []
        });
      } else if (prescriptionData) {
        setFormData({
          name: '',
          description: '',
          medicines: prescriptionData.medicines || [],
          diagnosis: prescriptionData.diagnosis || '',
          notes: prescriptionData.notes || '',
          labReports: prescriptionData.labReports || [],
          labTest: prescriptionData.labTest || []
        });
      } else {
        setFormData({
          name: '',
          description: '',
          medicines: [],
          diagnosis: '',
          notes: '',
          labReports: [],
          labTest: []
        });
      }
    }
  }, [isOpen, template, prescriptionData]);

  useEffect(() => {
    const filtered = medicines.filter(medicine =>
      medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredMedicines(filtered);
  }, [searchQuery, medicines]);

  const fetchMedicines = async () => {
    try {
      const response = await axiosInstance.get('/api/medicine');
      setMedicines(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      toast.error('Failed to fetch medicines');
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMedicineSelect = (medicine) => {
    const newMedicine = {
      medicine: medicine,
      isTapering: false,
      dosage: '',
      duration: '',
      instructions: '',
      tapering: []
    };
    setFormData(prev => ({
      ...prev,
      medicines: [...prev.medicines, newMedicine]
    }));
    setSearchQuery('');
  };

  const handleRemoveMedicine = (index) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.filter((_, i) => i !== index)
    }));
  };

  const handleMedicineChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medicines: prev.medicines.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleAddLabTest = () => {
    setFormData(prev => ({
      ...prev,
      labTest: [...prev.labTest, '']
    }));
  };

  const handleLabTestChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      labTest: prev.labTest.map((test, i) => i === index ? value : test)
    }));
  };

  const handleRemoveLabTest = (index) => {
    setFormData(prev => ({
      ...prev,
      labTest: prev.labTest.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Template name is required');
      return;
    }

    setLoading(true);
    try {
      const url = template ? `/api/template/${template._id}` : '/api/template';
      const method = template ? 'put' : 'post';
      
      const response = await axiosInstance[method](url, formData);
      
      toast.success(template ? 'Template updated successfully' : 'Template created successfully');
      onSave(response.data?.data);
      onClose();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0  bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {template ? 'Edit Template Name' : 'Create Template Name'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Template Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter template name"
                required
              />
            </div>
             {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter description"
              />
            </div> */}
          </div>

          {/* Diagnosis and Notes */}
          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Diagnosis
              </label>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => handleInputChange('diagnosis', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter diagnosis"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notes"
                rows="3"
              />
            </div>
          </div> */}

          {/* Medicines Section */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medicines
            </label>
            
            {/* Medicine Search */}
            {/* <div className="mb-4"> */} 
              {/* <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search medicines..."
                />
              </div> */}
              
              {/* {searchQuery && filteredMedicines.length > 0 && (
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg">
                  {filteredMedicines.map((medicine) => (
                    <div
                      key={medicine._id}
                      onClick={() => handleMedicineSelect(medicine)}
                      className="p-2 hover:bg-gray-100 cursor-pointer border-b border-gray-200 last:border-b-0"
                    >
                      <div className="font-medium">{medicine.name}</div>
                      <div className="text-sm text-gray-600">{medicine.genericName}</div>
                    </div>
                  ))}
                </div>
              )} */}
            {/* </div> */}

            {/* Selected Medicines */}
            {/* {formData.medicines.map((med, index) => ( */}
              {/* // <div key={index} className="border border-gray-300 rounded-lg p-4 mb-4">
              //   <div className="flex justify-between items-start mb-3">
              //     <div className="flex-1">
              //       <h4 className="font-medium">{med.medicine.name}</h4>
              //       <p className="text-sm text-gray-600">{med.medicine.genericName}</p>
              //     </div> */}
                  {/* <button
                    type="button"
                    onClick={() => handleRemoveMedicine(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 size={20} />
                  </button> */}
                {/* </div> */}
                
                {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dosage *
                    </label>
                    <input
                      type="text"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, 'dosage', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 500mg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, 'duration', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 7 days"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tapering
                    </label>
                    <input
                      type="text"
                      value={med.tapering}
                      onChange={(e) => handleMedicineChange(index, 'timing', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Twice daily"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Instructions
                    </label>
                    <input
                      type="text"
                      value={med.instructions}
                      onChange={(e) => handleMedicineChange(index, 'instructions', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Take after meals"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          {/* Lab Tests */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lab Tests
            </label>
            {formData.labTest.map((test, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={test}
                  onChange={(e) => handleLabTestChange(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lab test"
                /> */}
                {/* <button
                  type="button"
                  onClick={() => handleRemoveLabTest(index)}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button> */}
              {/* </div>
            ))} */}
            {/* <button
              type="button"
              onClick={handleAddLabTest}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
            >
              <Plus size={20} />
              Add Lab Test
            </button> */}
          {/* </div> */}

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (template ? 'Update Name' : 'Create Name')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TemplateModal; 