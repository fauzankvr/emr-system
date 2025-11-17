// ProceduresPage.tsx (Final Working Version)
import React, { useEffect, useState, useMemo } from "react";
import { axiosInstance } from "../../API/axiosInstance";
import {
    FaSearch,
    FaChevronLeft,
    FaChevronRight,
    FaInbox,
    FaRupeeSign,
    FaTimes,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface ProcedureItem {
    name: string;
    price: string | number;
}

interface Prescription {
    _id: string;
    patient: {
        name: string;
        phone?: string;
    };
    procedures: ProcedureItem[];
    updatedAt: string;
    totalAmount?: number;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
}

function ProceduresPage() {
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
    const [meta, setMeta] = useState<Meta | null>(null);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<"updatedAt" | "totalAmount">("updatedAt");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    // Date Range
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const limit = 50;

    // Fetch Procedures
    const fetchProcedures = async (resetPage = false) => {
        try {
            setLoading(true);
            const currentPage = resetPage ? 1 : page;

            const params = new URLSearchParams({
                page: String(currentPage),
                limit: String(limit),
                search: searchQuery.trim(),
                sort: sortBy,
                order: order,
            });

            if (startDate) {
                params.append("startDate", startDate.toISOString().split("T")[0]);
            }
            if (endDate) {
                params.append("endDate", endDate.toISOString().split("T")[0]);
            }

            const res = await axiosInstance.get(`/api/prescription/procedures?${params}`);
            setPrescriptions(res.data.data || []);
            setMeta(res.data.meta || null);
            if (resetPage) setPage(1);
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to load procedures");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProcedures(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    useEffect(() => {
        fetchProcedures(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery, sortBy, order, startDate, endDate]);

    // Normalize procedures
    const normalizeProcedures = (pres: Prescription): ProcedureItem[] => {
        return pres.procedures || [];
    };

    // CORRECT TOTAL AMOUNT CALCULATION
    const totalAmount = useMemo(() => {
        return prescriptions.reduce((sum, pres) => {
            const presTotal = normalizeProcedures(pres).reduce((acc, proc) => {
                const price = parseFloat(proc.price as string);
                return acc + (isNaN(price) ? 0 : price);
            }, 0);
            return sum + presTotal;
        }, 0);
    }, [prescriptions]);

    const clearDates = () => {
        setStartDate(null);
        setEndDate(null);
    };

    const sortOptions = [
        { value: "updatedAt-desc", label: "Date: Newest First" },
        { value: "updatedAt-asc", label: "Date: Oldest First" },
        { value: "totalAmount-desc", label: "Price: High to Low" },
        { value: "totalAmount-asc", label: "Price: Low to High" },
    ];

    const Pagination = () => {
        if (!meta || meta.totalPages <= 1) return null;

        const pages: (number | string)[] = [];
        if (meta.totalPages <= 7) {
            for (let i = 1; i <= meta.totalPages; i++) pages.push(i);
        } else {
            pages.push(1);
            if (meta.page > 4) pages.push("...");
            for (let i = Math.max(2, meta.page - 2); i <= Math.min(meta.totalPages - 1, meta.page + 2); i++) {
                pages.push(i);
            }
            if (meta.page < meta.totalPages - 3) pages.push("...");
            pages.push(meta.totalPages);
        }

        return (
            <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                    Showing {(meta.page - 1) * meta.limit + 1} to{" "}
                    {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} entries
                </div>

                <div className="flex gap-1">
                    <button
                        onClick={() => setPage(p => p - 1)}
                        disabled={!meta.hasPrev}
                        className="p-2 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaChevronLeft className="h-4 w-4" />
                    </button>

                    {pages.map((pg, i) => (
                        pg === "..." ? (
                            <span key={i} className="px-3 py-1">...</span>
                        ) : (
                            <button
                                key={pg}
                                onClick={() => setPage(pg as number)}
                                className={`px-3 py-1 rounded text-sm font-medium ${pg === meta.page
                                    ? "bg-blue-600 text-white"
                                    : "hover:bg-gray-100 text-gray-700"
                                    }`}
                            >
                                {pg}
                            </button>
                        )
                    ))}

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

    return (
        <div className="min-h-screen p-4 sm:p-8 bg-gray-50">
            <ToastContainer />

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Procedures History
                </h1>
                <p className="text-gray-600">View all procedures performed with pricing</p>
            </div>

            {/* Total Amount Card */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl shadow-lg p-6 mb-8">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-blue-100 text-sm font-medium">Total Procedures Amount</p>
                        <p className="text-4xl font-bold mt-2 flex items-center">
                            <FaRupeeSign className="mr-2" />
                            {totalAmount.toLocaleString("en-IN")}
                        </p>
                        {(startDate || endDate) && (
                            <p className="text-blue-200 text-sm mt-2">
                                Filtered: {startDate?.toLocaleDateString("en-IN")} →{" "}
                                {endDate?.toLocaleDateString("en-IN") || "Today"}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* Search */}
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaSearch className="text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search patient or procedure..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Sort */}
                <select
                    value={`${sortBy}-${order}`}
                    onChange={(e) => {
                        const [newSort, newOrder] = e.target.value.split("-");
                        setSortBy(newSort as any);
                        setOrder(newOrder as any);
                    }}
                    className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {sortOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>

                {/* Date Range */}
                <div className="flex gap-2">
                    <DatePicker
                        selected={startDate}
                        onChange={setStartDate}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        maxDate={new Date()}
                        placeholderText="From Date"
                        dateFormat="dd/MM/yyyy"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center bg-gray-50"
                    />
                    <DatePicker
                        selected={endDate}
                        onChange={setEndDate}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate || undefined}
                        maxDate={new Date()}
                        placeholderText="To Date"
                        dateFormat="dd/MM/yyyy"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center bg-gray-50"
                    />
                    {(startDate || endDate) && (
                        <button
                            onClick={clearDates}
                            className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                            title="Clear dates"
                        >
                            <FaTimes className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-600" />
                    </div>
                ) : prescriptions.length === 0 ? (
                    <div className="text-center py-20">
                        <FaInbox className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                        <h3 className="text-xl font-semibold text-gray-700">No Procedures Found</h3>
                        <p className="text-gray-500 mt-2">
                            {searchQuery || startDate || endDate
                                ? "Try adjusting your filters"
                                : "No procedures performed yet"}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Patient
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Procedure
                                        </th>
                                        <th className="px-6 py-4 text-right text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {prescriptions.map((pres) => {
                                        const procedures = normalizeProcedures(pres);
                                        return procedures.map((proc, idx) => (
                                            <tr key={`${pres._id}-${idx}`} className="hover:bg-gray-50">
                                                {idx === 0 && (
                                                    <td rowSpan={procedures.length} className="px-6 py-4 whitespace-nowrap">
                                                        <div className="font-semibold">{pres.patient?.name}</div>
                                                        <div className="text-gray-500 text-xs">{pres.patient?.phone || "—"}</div>
                                                    </td>
                                                )}
                                                <td className="px-6 py-4 text-sm text-gray-800">{proc.name}</td>
                                                <td className="px-6 py-4 text-sm text-right font-medium">
                                                    <span className="text-green-600 flex items-center justify-end">
                                                        <FaRupeeSign className="inline mr-1 text-xs" />
                                                        {parseFloat(proc.price as string || "0").toLocaleString("en-IN")}
                                                    </span>
                                                </td>
                                                {idx === 0 && (
                                                    <td rowSpan={procedures.length} className="px-6 py-4 text-sm text-gray-500">
                                                        {new Intl.DateTimeFormat("en-IN", {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        }).format(new Date(pres.updatedAt))}
                                                    </td>
                                                )}
                                            </tr>
                                        ));
                                    })}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t">
                            <Pagination />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProceduresPage;