import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../API/axiosInstance';
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaEye,
  FaSearch,
  FaFile,
  FaCalendarAlt,
  FaPills,
  FaVial,
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TemplateModal from '../../Components/doctor/models/TemplateModal';
import { useNavigate } from 'react-router-dom';

function TemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  /* ------------------------------------------------------------------ */
  /*  FETCH TEMPLATES                                                   */
  /* ------------------------------------------------------------------ */
  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/template');
      setTemplates(data?.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------------------------------------------------ */
  /*  DELETE TEMPLATE (with confirm toast)                              */
  /* ------------------------------------------------------------------ */
  const handleDeleteTemplate = (templateId) => {
    const ConfirmToast = ({ closeToast }) => (
      <div className="p-2">
        <p className="mb-3">Delete this template permanently?</p>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-gray-300 rounded"
            onClick={closeToast}
          >
            Cancel
          </button>
          <button
            className="px-3 py-1 bg-red-600 text-white rounded"
            onClick={async () => {
              closeToast();
              try {
                await axiosInstance.delete(`/api/template/${templateId}`);
                setTemplates((prev) =>
                  prev.filter((t) => t._id !== templateId)
                );
                toast.success('Template deleted');
              } catch (e) {
                console.error(e);
                toast.error('Failed to delete');
              }
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );

    toast.info(<ConfirmToast />, {
      position: 'top-center',
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
    });
  };

  /* ------------------------------------------------------------------ */
  /*  EDIT / CREATE HANDLERS                                            */
  /* ------------------------------------------------------------------ */
  const openEdit = (template) => {
    setEditingTemplate(template);
    setShowCreateModal(true);
  };

  const closeModal = () => {
    setShowCreateModal(false);
    setEditingTemplate(null);
  };

  const handleTemplateSave = (saved) => {
    if (editingTemplate) {
      setTemplates((prev) =>
        prev.map((t) => (t._id === saved._id ? saved : t))
      );
    } else {
      setTemplates((prev) => [saved, ...prev]);
    }
    closeModal();
  };

  const handleUseTemplate = (template) => {
    navigate(`/doctor/prescription?templateId=${template._id}`);
  };

  /* ------------------------------------------------------------------ */
  /*  FILTER BY SEARCH                                                  */
  /* ------------------------------------------------------------------ */
  const filtered = templates.filter(
    (t) =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.diagnosis && t.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  /* ------------------------------------------------------------------ */
  /*  RENDER                                                            */
  /* ------------------------------------------------------------------ */
  return (
    <div className="p-6">
      <ToastContainer />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
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
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name, description, or diagnosis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        {loading ? (
          <div className="flex justify-center p-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-700"></div>
          </div>
        ) : filtered.length === 0 ? (
          /* Empty State */
          <div className="text-center py-12">
            <FaFile size={64} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No templates match your search' : 'No templates yet'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? 'Try different keywords'
                : 'Start by creating your first template'}
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
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            {/* Desktop Header */}
            <thead className="bg-gray-50 hidden md:table-header-group">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Medicines
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Diagnosis
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lab Tests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {filtered.map((template) => (
                <tr
                  key={template._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* ---------- Desktop Cells ---------- */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 hidden md:table-cell">
                    {template.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell max-w-xs truncate">
                    {template.description || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <FaPills className="text-gray-400" />
                      {template.medicines?.length ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">
                    {template.diagnosis || '—'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      <FaVial className="text-gray-400" />
                      {template.labTest?.length ?? 0}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                    <div className="flex items-center gap-1">
                      {/* <FaCalendarAlt className="text-gray-400" /> */}
                      {new Date(template.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "2-digit",
                      })}
                    </div>
                  </td>

                  {/* ---------- Actions (always visible) ---------- */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUseTemplate(template)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Use Template"
                      >
                        <FaEye size={16} />
                      </button>
                      <button
                        onClick={() => openEdit(template)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Edit"
                      >
                        <FaEdit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteTemplate(template._id)}
                        className="text-red-600 hover:text-red-800"
                        title="Delete"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>
                  </td>

                  {/* ---------- Mobile Stacked View ---------- */}
                  <td className="md:hidden px-4 py-4 text-left">
                    <div className="flex flex-col gap-2">
                      {/* Name */}
                      <div className="font-medium text-gray-900">{template.name}</div>

                      {/* Description */}
                      {template.description && (
                        <div className="text-sm text-gray-600">{template.description}</div>
                      )}

                      {/* Quick stats */}
                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <FaPills />
                          {template.medicines?.length ?? 0}
                        </span>
                        {template.diagnosis && (
                          <span className="flex items-center gap-1">
                            <strong>Diag:</strong> {template.diagnosis}
                          </span>
                        )}
                        <span className="flex items-center gap-1">
                          <FaVial />
                          {template.labTest?.length ?? 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <FaCalendarAlt />
                          {new Date(template.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Mobile actions */}
                      <div className="flex gap-3 mt-2">
                        <button
                          onClick={() => handleUseTemplate(template)}
                          className="text-blue-600"
                        >
                          Use
                        </button>
                        <button
                          onClick={() => openEdit(template)}
                          className="text-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template._id)}
                          className="text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showCreateModal && (
        <TemplateModal
          isOpen={showCreateModal}
          onClose={closeModal}
          template={editingTemplate}
          onSave={handleTemplateSave}
        />
      )}
    </div>
  );
}

export default TemplatesPage;