import React, { useState } from 'react';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { axiosInstance } from '../../../API/axiosInstance';
import { toast, ToastContainer } from 'react-toastify';
import ConfirmToast from '../ConfirmModal';

const AddItemModal = ({ 
  isOpen, 
  onClose, 
  type, 
  onItemAdded,
  editItem = null,
  onItemUpdated 
}) => {
  const [formData, setFormData] = useState({
    name: '',
    dosageForm: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [existingItems, setExistingItems] = useState([]);
  const [showExistingItems, setShowExistingItems] = useState(false);

  // Reset form when modal opens/closes or editItem changes
  React.useEffect(() => {
    if (isOpen) {
      if (editItem) {
        setFormData({
          name: editItem.name || '',
          dosageForm: editItem.dosageForm || '',
          content: editItem.content || '',
        });
        setShowExistingItems(false);
      } else {
        setFormData({
          name: '',
          dosageForm: '',
          content: '',
        });
        setShowExistingItems(true);
        fetchExistingItems();
      }
    }
  }, [isOpen, editItem]);

  const fetchExistingItems = async () => {
    try {
      const endpoint = getApiEndpoint();
      const response = await axiosInstance.get(endpoint);
      setExistingItems(response.data.data || []);
    } catch (error) {
      console.error('Error fetching existing items:', error);
    }
  };

  const getTitle = () => {
    const action = editItem ? 'Edit' : 'Add';
    switch (type) {
      case 'diagnosis':
        return `${action} Diagnosis`;
      case 'frequency':
        return `${action} Frequency`;
      case 'instruction':
        return `${action} Instruction`;
      case 'days':
        return `${action} Duration`;
      case 'dosage':
        return `${action} Dosage`;
      case 'medicine':
        return `${action} Medicine`;
      default:
        return `${action} Item`;
    }
  };

  const getApiEndpoint = () => {
    switch (type) {
      case 'diagnosis':
        return '/api/diagnosis';
      case 'frequency':
        return '/api/frequency';
      case 'instruction':
        return '/api/instruction';
      case 'days':
        return '/api/days';
      case 'dosage':
        return '/api/dosage';
      case 'medicine':
        return '/api/medicine';
      default:
        return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setLoading(true);
    try {
      const endpoint = getApiEndpoint();
      let response;

      // Prepare data to send (omit empty optional fields for medicine)
      const dataToSend = { name: formData.name };
      if (type === 'medicine') {
        if (formData.dosageForm.trim()) dataToSend.dosageForm = formData.dosageForm;
        if (formData.content.trim()) dataToSend.content = formData.content;
      }

      if (editItem) {
        // Update existing item
        response = await axiosInstance.put(`${endpoint}/${editItem._id}`, dataToSend);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated successfully`);
        onItemUpdated(response.data.data);
      } else {
        // Create new item
        response = await axiosInstance.post(endpoint, dataToSend);
        toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} added successfully`);
        if (type === 'medicine') {
          onItemAdded(response.data)
        }else{
          onItemAdded(response.data.data);
        }
      }

      onClose();
    } catch (error) {
      console.error('Error saving item:', error);
      toast.error(error.response?.data?.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editItem) return;
  
    return new Promise((resolve) => {
      const confirmToast = toast.info(
        <ConfirmToast
          message="Are you sure you want to delete this item?"
          onConfirm={async () => {
            toast.dismiss(confirmToast);
            setLoading(true);
            try {
              const endpoint = getApiEndpoint();
              await axiosInstance.delete(`${endpoint}/${editItem._id}`);
              toast.success(
                `${type.charAt(0).toUpperCase() + type.slice(1)} deleted successfully`
              );
              onItemUpdated(null);
              onClose();
            } catch (error) {
              console.error("Error deleting item:", error);
              toast.error(error.response?.data?.message || "Failed to delete item");
            } finally {
              setLoading(false);
              resolve();
            }
          }}
          onCancel={() => {
            toast.dismiss(confirmToast);
            resolve();
          }}
        />,
        {
          position: "top-center",
          autoClose: false,
          closeOnClick: false,
          closeButton: false,
          draggable: false,
        }
      );
    });
  };
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <ToastContainer/>
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800">{getTitle()}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {editItem ? (
          // Edit mode - show form
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Enter ${type} name`}
                required
              />
            </div>

            {/* Dosage Form and Content Fields for Medicine */}
            {type === 'medicine' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dosage Form
                  </label>
                  <input
                    type="text"
                    value={formData.dosageForm}
                    onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter dosage form (e.g., Tablet, Syrup)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content
                  </label>
                  <input
                    type="text"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter content (e.g., 500mg)"
                  />
                </div>
              </>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white rounded-md flex items-center"
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Edit size={16} className="mr-2" />
                    Update
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          // Add mode - show add form
          <div className="space-y-4">
            {/* Add New Form */}
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">
                Add New {type.charAt(0).toUpperCase() + type.slice(1)}
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Field */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Enter ${type} name`}
                    required
                  />
                </div>

                {/* Dosage Form and Content Fields for Medicine */}
                {type === 'medicine' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dosage Form
                      </label>
                      <input
                        type="text"
                        value={formData.dosageForm}
                        onChange={(e) => setFormData({ ...formData, dosageForm: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter dosage form (e.g., Tablet, Syrup)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Content
                      </label>
                      <input
                        type="text"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter content (e.g., 500mg)"
                      />
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={loading}
                    className="px-4 py-2 bg-gray-300 hover:bg-gray-400 disabled:bg-gray-200 text-gray-700 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md flex items-center"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Plus size={16} className="mr-2" />
                        Save
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddItemModal;