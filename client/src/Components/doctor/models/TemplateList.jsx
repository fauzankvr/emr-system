import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../../API/axiosInstance';
import { FaEdit, FaTrash, FaPlus, FaEye } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import react-toastify CSS
import TemplateModal from './TemplateModal';

const TemplateList = ({ isOpen, onClose, onTemplateSelect }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/template');
      setTemplates(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTemplate = (templateId) => {
    const ConfirmToast = ({ closeToast }) => (
      <div>
        <p>Are you sure you want to delete this template?</p>
        <div className="mt-2 flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
            onClick={closeToast}
          >
            No
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
            onClick={async () => {
              closeToast();
              try {
                await axiosInstance.delete(`/api/template/${templateId}`);
                setTemplates((prev) => prev.filter((template) => template._id !== templateId));
                toast.success('Template deleted successfully');
              } catch (error) {
                console.error('Error deleting template:', error);
                toast.error('Failed to delete template');
              }
            }}
          >
            Yes, Delete
          </button>
        </div>
      </div>
    );

    toast.info(<ConfirmToast />, {
      position: 'top-center',
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  };

  const handleEditTemplate = (template) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const handleTemplateSave = (savedTemplate) => {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((template) =>
          template._id === savedTemplate._id ? savedTemplate : template
        )
      );
      setEditingTemplate(null);
    } else {
      setTemplates((prev) => [savedTemplate, ...prev]);
    }
    setShowCreateModal(false);
  };

  const handleTemplateSelect = (template) => {
    onTemplateSelect(template);
    onClose();
  };

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isOpen) return null;

  return (
    <>
            <ToastContainer position="top-center" />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Prescription Templates</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FaPlus size={16} />
                Create Template
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Templates List */}
          {loading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
            </div>
          ) : filteredTemplates.length > 0 ? (
            <div className="space-y-3">
              {filteredTemplates.map((template) => (
                <div
                  key={template._id}
                  className="border border-gray-300 rounded-lg p-4 hover:bg-gray-50"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg">{template.name}</h3>
                      {template.description && (
                        <p className="text-gray-600 mt-1">{template.description}</p>
                      )}
                      <div className="flex gap-4 mt-2 text-sm text-gray-500">
                        <span>Medicines: {template.medicines?.length || 0}</span>
                        {template.diagnosis && <span>Diagnosis: {template.diagnosis}</span>}
                        <span>Created: {new Date(template.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleTemplateSelect(template)}
                        className="text-blue-600 hover:text-blue-800 p-2"
                        title="Use Template"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => handleEditTemplate(template)}
                        className="text-yellow-600 hover:text-yellow-800 p-2"
                        title="Edit Template"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template._id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete Template"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No templates found matching your search' : 'No templates created yet'}
            </div>
          )}

          {/* Template Modal */}
          {showCreateModal && (
            <TemplateModal
              isOpen={showCreateModal}
              onClose={() => {
                setShowCreateModal(false);
                setEditingTemplate(null);
              }}
              template={editingTemplate}
              onSave={handleTemplateSave}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TemplateList;