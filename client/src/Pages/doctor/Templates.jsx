import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../API/axiosInstance';
import { FaEdit, FaTrash, FaPlus, FaEye, FaSearch, FaFile } from 'react-icons/fa'; // Changed FaFileAlt to FaFile
import { toast ,ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; 
import TemplateModal from '../../Components/doctor/models/TemplateModal';
import { useNavigate } from 'react-router-dom';

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTemplates();
  }, []);

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
                await axiosInstance.delete(`/api/template/${templateId}`);
                setTemplates(prev => prev.filter(template => template._id !== templateId));
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
      position: "top-center",
      autoClose: false,
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
      setTemplates(prev => 
        prev.map(template => 
          template._id === savedTemplate._id ? savedTemplate : template
        )
      );
      setEditingTemplate(null);
    } else {
      setTemplates(prev => [savedTemplate, ...prev]);
    }
    setShowCreateModal(false);
  };

  const handleUseTemplate = (template) => {
    // Navigate to prescription page with template data
    navigate(`/doctor/prescription?templateId=${template._id}`);
  };

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (template.description && template.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (template.diagnosis && template.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="p-6">
      <ToastContainer />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Prescription Templates</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <FaPlus size={16} />
          Create Template
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search templates by name, description, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Templates Grid */}
      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
        </div>
      ) : filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template._id}
              className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-medium text-lg text-gray-900">{template.name}</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUseTemplate(template)}
                    className="text-blue-600 hover:text-blue-800 p-1"
                    title="Use Template"
                  >
                    <FaEye size={16} />
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="text-yellow-600 hover:text-yellow-800 p-1"
                    title="Edit Template"
                  >
                    <FaEdit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template._id)}
                    className="text-red-600 hover:text-red-800 p-1"
                    title="Delete Template"
                  >
                    <FaTrash size={16} />
                  </button>
                </div>
              </div>

              {template.description && (
                <p className="text-gray-600 mb-3 text-sm">{template.description}</p>
              )}

              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex justify-between">
                  <span>Medicines:</span>
                  <span className="font-medium">{template.medicines?.length || 0}</span>
                </div>
                {template.diagnosis && (
                  <div className="flex justify-between">
                    <span>Diagnosis:</span>
                    <span className="font-medium text-gray-700">{template.diagnosis}</span>
                  </div>
                )}
                {template.labTest && template.labTest.length > 0 && (
                  <div className="flex justify-between">
                    <span>Lab Tests:</span>
                    <span className="font-medium">{template.labTest.length}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Created:</span>
                  <span className="font-medium">{new Date(template.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleUseTemplate(template)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FaFile size={64} className="mx-auto" /> {/* Changed FaFileAlt to FaFile */}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No templates found' : 'No templates created yet'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchQuery 
              ? 'Try adjusting your search terms' 
              : 'Create your first prescription template to get started'
            }
          </p>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Create Template
            </button>
          )}
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
  );
}

export default TemplatesPage;