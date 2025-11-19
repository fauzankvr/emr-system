// src/pages/LabReportsDashboard.jsx
import React, { useState, useEffect } from 'react';
import { FileUp, Eye, X, Loader2, Upload, ExternalLink } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Pagination } from '../doctor/PatientHIstory';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

// Axios instance with auth interceptor (works perfectly in JS)
const api = axios.create({
  baseURL: backendUrl,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("labAccessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("labAccessToken");
      localStorage.removeItem("labRefreshToken");
      toast.error("Session expired. Redirecting to login...");
      setTimeout(() => window.location.href = "/", 1500);
    }
    return Promise.reject(error);
  }
);

// === View Modal ===
const ViewModal = ({ report, onClose }) => {
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-screen overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Lab Report Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={28} />
            </button>
          </div>

          {/* Patient Info */}
          <div>
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Patient Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm bg-gray-50 p-4 rounded-lg">
              <div><span className="font-medium">Name:</span> {report.patient.name}</div>
              <div><span className="font-medium">Email:</span> {report.patient.email || '—'}</div>
              <div><span className="font-medium">Phone:</span> {report.patient.phone}</div>
              <div><span className="font-medium">Gender:</span> {report.patient.gender || '—'}</div>
              <div><span className="font-medium">Age:</span> {report.patient.age || '—'}</div>
              <div><span className="font-medium">DOB:</span> {report.patient.dob ? fmt(report.patient.dob) : '—'}</div>
            </div>
          </div>

          {/* Report Details */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-3">Report Details</h3>
            <div className="space-y-3 text-sm bg-gray-50 p-4 rounded-lg">
              <div><span className="font-medium">Report Name:</span> <strong>{report.name || '—'}</strong></div>
              <div><span className="font-medium">Report Date:</span> {fmt(report.reportDate)}</div>
              {/* <div><span className="font-medium">Values:</span> {report.values || '—'}</div> */}
              <div>
                <span className="font-medium">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-bold ${report.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {report.status}
                </span>
              </div>
            </div>
          </div>

          {/* Uploaded File */}
          {report.reportImageUrl ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-3">Uploaded Report</h3>
              <a href={report.reportImageUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 shadow-md transition">
                <Eye size={18} /> View Report <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <div className="mt-6 text-sm text-gray-500 italic">No report uploaded yet</div>
          )}

          <div className="mt-6 text-xs text-gray-500 border-t pt-4">
            <p>Created: {fmt(report.createdAt)}</p>
            <p>Updated: {fmt(report.updatedAt)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// === Upload Modal (100% working in JS) ===
const UploadModal = ({ report, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("reportFile", file);

      const upRes = await api.post("/api/prescription/upload-lab-report", form);
      const { reportImageUrl } = upRes.data.data;

      await api.patch(`/api/lab/report-image/${report._id}`, {
        prescriptionId: report.prescriptionId,
        reportImageUrl,
        reportDate: new Date(),
      });

      await api.patch(`/api/lab/status/${report._id}`, {
        status: "Completed",
        prescriptionId: report.prescriptionId,
      });

      onSuccess(report._id, reportImageUrl);
      toast.success("Lab report uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  bg-opacity-50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Upload Lab Report</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          For <strong>{report.patient.name}</strong> — {report.name || "Report"}
        </p>

        {report.reportImageUrl && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-800 mb-2">Current Report:</p>
            <a href={report.reportImageUrl} target="_blank" rel="noopener noreferrer"
              className="text-blue-600 underline text-sm flex items-center gap-1">
              <ExternalLink size={14} /> View Current Report
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition">
            <input
              type="file"
              id="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />
            <label htmlFor="file" className="cursor-pointer">
              {file ? (
                <div>
                  <FileUp size={40} className="mx-auto text-blue-600 mb-2" />
                  <p className="text-sm font-medium text-blue-600">{file.name}</p>
                  <p className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
                </div>
              ) : (
                <div>
                  <Upload size={40} className="mx-auto text-gray-400 mb-2" />
                  <p className="text-blue-600 font-medium">Click to upload</p>
                  <p className="text-xs text-gray-500">PDF, JPG, PNG (Max 10MB)</p>
                </div>
              )}
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200 transition">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file || uploading}
              className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center gap-2 transition shadow"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? "Uploading…" : "Upload Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// === Table ===
const LabReportTable = ({ reports, onStatusChange, onView, onUpload }) => {
  const fmt = (d) => new Date(d).toLocaleDateString('en-IN');

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Patient</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Report Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reports.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-gray-500 text-lg">
                  No lab reports found
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r._id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-sm text-gray-700">{fmt(r.reportDate)}</td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-gray-900">{r.patient.name}</div>
                    <div className="text-xs text-gray-500">{r.patient.phone}</div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800 max-w-xs truncate">
                    {r.name || '—'}
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={r.status}
                      onChange={(e) => onStatusChange(r._id, e.target.value, r.prescriptionId)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-full border-0 cursor-pointer transition ${
                        r.status === 'Completed'
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                      }`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button onClick={() => onView(r)}
                      className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition flex items-center gap-1 text-xs font-medium">
                      <Eye size={14} /> View
                    </button>
                    <button onClick={() => onUpload(r)}
                      className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition flex items-center gap-1 text-xs font-medium">
                      <FileUp size={14} /> {r.reportImageUrl ? 'Re-upload' : 'Upload'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// === MAIN COMPONENT ===
export default function LabReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("reportDate");
  const [order, setOrder] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [viewReport, setViewReport] = useState(null);
  const [uploadReport, setUploadReport] = useState(null);

  const limit = 20;

  const fetchReports = async (resetPage = false) => {
    try {
      setLoading(true);
      const curPage = resetPage ? 1 : page;

      const params = new URLSearchParams({
        page: String(curPage),
        limit: String(limit),
        search: searchQuery.trim(),
        sort: sortBy,
        order,
      });

      if (startDate) params.append("startDate", startDate.toISOString().split("T")[0]);
      if (endDate) params.append("endDate", endDate.toISOString().split("T")[0]);

      const res = await api.get(`/api/lab?${params}`);
      setReports(res.data.data?.data || []);
      setMeta(res.data.data?.meta || null);
      if (resetPage) setPage(1);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(false);
  }, [page]);

  useEffect(() => {
    setPage(1);
    fetchReports(true);
  }, [searchQuery, sortBy, order, startDate, endDate]);

  const updateStatus = async (id, status, prescriptionId) => {
    try {
      await api.patch(`/api/lab/status/${id}`, { status, prescriptionId });
      setReports(prev => prev.map(r => (r._id === id ? { ...r, status } : r)));
      toast.success("Status updated");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to update status");
    }
  };

  const handleUploadSuccess = (id, url) => {
    setReports(prev => prev.map(r => (r._id === id ? { ...r, reportImageUrl: url, status: 'Completed' } : r)));
  };

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <ToastContainer position="top-right" />
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Lab Reports Dashboard</h1>
          <div className="flex gap-3">
            <button onClick={() => fetchReports()} className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2">
              <Loader2 size={18} className={loading ? 'animate-spin' : 'hidden'} />
              Refresh
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("labAccessToken");
                localStorage.removeItem("labRefreshToken");
                window.location.href = "/";
              }}
              className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search patient / report..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={`${sortBy}-${order}`}
            onChange={e => {
              const [s, o] = e.target.value.split("-");
              setSortBy(s);
              setOrder(o);
            }}
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="reportDate-desc">Date: Newest First</option>
            <option value="reportDate-asc">Date: Oldest First</option>
            <option value="name-desc">Name: Z to A</option>
            <option value="name-asc">Name: A to Z</option>
          </select>

          <div className="flex gap-2">
            <DatePicker selected={startDate} onChange={setStartDate} selectsStart startDate={startDate} endDate={endDate}
              maxDate={new Date()} placeholderText="From" dateFormat="dd/MM/yyyy"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
            <DatePicker selected={endDate} onChange={setEndDate} selectsEnd startDate={startDate} endDate={endDate}
              minDate={startDate ?? undefined} maxDate={new Date()} placeholderText="To" dateFormat="dd/MM/yyyy"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center" />
            {(startDate || endDate) && (
              <button onClick={clearDates} className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition flex items-center justify-center">
                <FaTimes className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Table or Loader */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={56} className="animate-spin text-blue-600" />
          </div>
        ) : (
          <>
            <LabReportTable
              reports={reports}
              onStatusChange={updateStatus}
              onView={setViewReport}
              onUpload={setUploadReport}
            />
            {meta && <div className="mt-6"><Pagination meta={meta} setPage={setPage} /></div>}
          </>
        )}
      </div>

      {/* Modals */}
      {viewReport && <ViewModal report={viewReport} onClose={() => setViewReport(null)} />}
      {uploadReport && (
        <UploadModal
          report={uploadReport}
          onClose={() => setUploadReport(null)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}