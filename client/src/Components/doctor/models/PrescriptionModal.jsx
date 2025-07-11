import React, { useState, useEffect, memo } from "react";
import { PDFViewer, PDFDownloadLink } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { axiosInstance } from "../../../API/axiosInstance";
import { toast } from "react-toastify";
import { Download } from "lucide-react";

// Enhanced Error Boundary Component
class PDFErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    console.error("PDFErrorBoundary caught error:", error); // Log error for debugging
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PDFErrorBoundary error info:", errorInfo); // Log additional error info
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          Error rendering PDF: {this.state.error?.message || "Unknown error"}
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="ml-4 px-2 py-1 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// PDF Styles (unchanged)
const styles = StyleSheet.create({
  page: {
    padding: 15,
    fontFamily: "Helvetica",
    fontSize: 12,
    backgroundColor: "#FFFFFF",
  },
  header: {
    backgroundColor: "#009688",
    padding: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 10,
    marginTop: 2,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 13,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  table: {
    borderWidth: 0.4,
    borderColor: "#787878",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.4,
    borderColor: "#787878",
  },
  tableColHeader: {
    backgroundColor: "#F0F0F0",
    padding: 5,
    borderRightWidth: 0.4,
    borderColor: "#787878",
    textAlign: "center",
  },
  tableCol: {
    padding: 5,
    borderRightWidth: 0.4,
    borderColor: "#787878",
    textAlign: "center",
  },
  tableCellHeader: {
    fontWeight: "bold",
    fontSize: 11,
  },
  tableCell: {
    fontSize: 11,
  },
  TapringHed: {
    fontSize: 10,
  },
  TapringP: {
    fontSize: 10,
  },
  label: {
    fontWeight: "bold",
  },
  hr: {
    borderBottomWidth: 0.4,
    borderColor: "#787878",
    marginVertical: 6,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 15,
    right: 15,
    backgroundColor: "#FAFAFA",
    padding: 5,
    fontSize: 10,
  },
  signature: {
    position: "absolute",
    bottom: 40,
    right: 15,
    textAlign: "right",
  },
});

// PrescriptionPDF Component
const PrescriptionPDF = memo(
  ({
    doctor = {
      name: "Dr MANSOOR ALI.VP",
      regNo: "35083",
      contact: "9895353078",
    },
    patient = { name: "John Doe", mobile: "1234567890", age: "30" },
    diagnosis = "Fever",
    medicines = [],
    labReports = [],
    labTest = [],
    vitals = {
      spo2: "98%",
      bp: "120/80",
      pulse: "72",
      temp: "37.5°C",
      weight: "70kg",
    },
  }) => {
    const today = new Date();
    const formattedDate = today.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return (
      <Document>
        <Page size="A4" style={styles.page}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerText}>
              Dr.{doctor.name}, MD (PHYSICIAN)
            </Text>
            <Text style={styles.subHeaderText}>
              General Practitioner | Reg No: 35083 | +91 9895353078
            </Text>
            <Text style={styles.subHeaderText}>
              Pathappiriyam | BOOKING NO: +918606344694
            </Text>
          </View>

          {/* Patient Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Information</Text>
            <View style={styles.row}>
              <View style={{ width: "60%" }}>
                <Text>
                  <Text style={styles.label}>Name:</Text> {patient.name}
                </Text>
                <Text>
                  <Text style={styles.label}>Phone:</Text>{" "}
                  {patient.mobile || patient.phone}
                </Text>
                <Text>
                  <Text style={styles.label}>Age:</Text> {patient.age}
                </Text>
                <Text>
                  <Text style={styles.label}>Diagnosis:</Text>{" "}
                  {diagnosis || "N/A"}
                </Text>
                <Text>
                  <Text style={styles.label}>Date & Time:</Text> {formattedDate}
                </Text>
              </View>
              <View style={{ width: "30%" }}>
                <Text>
                  <Text style={styles.label}>SpO2:</Text> {vitals.spo2}
                </Text>
                <Text>
                  <Text style={styles.label}>BP:</Text> {vitals.bp}
                </Text>
                <Text>
                  <Text style={styles.label}>Pulse:</Text> {vitals.pulse}
                </Text>
                <Text>
                  <Text style={styles.label}>Temp:</Text> {vitals.temp}
                </Text>
                <Text>
                  <Text style={styles.label}>Weight:</Text> {vitals.weight}
                </Text>
              </View>
            </View>
          </View>

          {/* Lab Report */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lab Report</Text>
            {labReports.length > 0 ? (
              labReports.map((report, index) => (
                <View key={index} style={{ marginBottom: 10 }}>
                  <Text>
                    <Text style={styles.label}>Report Type:</Text>{" "}
                    {report.reportType}
                  </Text>
                  <Text>
                    <Text style={styles.label}>Findings:</Text>{" "}
                    {report.findings || "-"}
                  </Text>
                </View>
              ))
            ) : (
              <Text>-</Text>
            )}
          </View>

          <View style={styles.hr} />

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Medicines</Text>
            <View style={styles.table}>
              {/* Table Header */}
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: "10%" }]}>
                  <Text style={styles.tableCellHeader}>Sl</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "35%" }]}>
                  <Text style={styles.tableCellHeader}>Medicine</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "15%" }]}>
                  <Text style={styles.tableCellHeader}>Type</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "15%" }]}>
                  <Text style={styles.tableCellHeader}>Dosage</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "10%" }]}>
                  <Text style={styles.tableCellHeader}>Duration</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "15%" }]}>
                  <Text style={styles.tableCellHeader}>Instructions</Text>
                </View>
              </View>

              {/* Table Rows */}
              {medicines.length > 0 ? (
                medicines.map((med, index) => (
                  <View key={index}>
                    {/* Main Row */}
                    <View style={styles.tableRow}>
                      <View style={[styles.tableCol, { width: "10%" }]}>
                        <Text style={styles.tableCell}>{index + 1}</Text>
                      </View>

                      {/* Medicine Name + Content + Tapering */}
                      <View style={[styles.tableCol, { width: "35%" }]}>
                        <Text style={styles.tableCell}>
                          {med.medicine?.name || "-"}
                        </Text>

                        {/* Content (Note) */}
                        {med.medicine?.content && (
                          <Text
                            style={[
                              styles.TapringHed,
                              {
                                fontStyle: "italic",
                                color: "#4B5563",
                                marginTop: 2,
                              },
                            ]}
                          >
                            Note: {med.medicine.content}
                          </Text>
                        )}

                        {/* Tapering Schedule */}
                        {med.isTapering && med.tapering?.length > 0 && (
                          <>
                            <Text
                              style={[
                                styles.TapringP,
                                {
                                  fontWeight: "bold",
                                  marginTop: 4,
                                  color: "#374151",
                                },
                              ]}
                            >
                              Tapering:
                            </Text>
                            {med.tapering.map((taper, tIndex) => (
                              <Text
                                key={tIndex}
                                style={[
                                  styles.TapringP,
                                  { color: "#6B7280", marginLeft: 6 },
                                ]}
                              >
                                - {taper.dosage || "-"} for {taper.days || "-"}
                              </Text>
                            ))}
                          </>
                        )}
                      </View>

                      {/* Other Columns */}
                      <View style={[styles.tableCol, { width: "15%" }]}>
                        <Text style={styles.tableCell}>
                          {med.medicine?.dosageForm || "-"}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, { width: "15%" }]}>
                        <Text style={styles.tableCell}>
                          {med.dosage || "-"}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, { width: "10%" }]}>
                        <Text style={styles.tableCell}>
                          {med.duration || "-"}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, { width: "15%" }]}>
                        <Text style={styles.tableCell}>
                          {med.instructions || "-"}
                        </Text>
                      </View>
                    </View>
                  </View>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <View style={[styles.tableCol, { width: "100%" }]}>
                    <Text style={styles.tableCell}>No Medicines</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Lab Tests for Next Visit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Lab Tests On Next Visit</Text>
            {Array.isArray(labTest) && labTest.length > 0 ? (
              labTest.map((val, idx) => <Text key={idx}>• {val}</Text>)
            ) : (
              <Text>-</Text>
            )}
          </View>

          {/* Signature Placeholder */}
          <View style={styles.signature}>
            <Text style={{ fontStyle: "italic" }}>
              Signature: _____________________
            </Text>
            <Text style={{ fontWeight: "bold" }}>DR MANSOOR ALI V.P</Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text>Prescription Generated by Suhaim Software</Text>
            <Text>Visit us: www.clinicppm.site</Text>
          </View>
        </Page>
      </Document>
    );
  }
);

// PrescriptionModal Component
const PrescriptionModal = ({ patientId, onClose, date }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/prescription/patient/${patientId}`
        );
        const prescriptionData = response.data.data || [];

        // Sort prescriptions by createdAt date (descending)
        const sortedPrescriptions = prescriptionData.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setPrescriptions(sortedPrescriptions);

        if (sortedPrescriptions.length > 0) {
          if (date) {
            const inputDate = new Date(date).toISOString().split("T")[0];
            const matched = sortedPrescriptions.find((val) => {
              const createdAtDate = new Date(val.createdAt)
                .toISOString()
                .split("T")[0];
              return createdAtDate === inputDate;
            });
            setSelectedPrescription(matched || sortedPrescriptions[0]);
          } else {
            setSelectedPrescription(sortedPrescriptions[0]);
          }
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching prescriptions:", err);
        setError("Failed to load prescriptions. Please try again.");
        setLoading(false);
        toast.error("Failed to load prescriptions.");
      }
    };

    if (patientId) {
      fetchPrescriptions();
    }
  }, [patientId, date]);

  // Debounced handler for select change
  // const handleSelectChange = useCallback(
  //   (e) => {
  //     const selected = prescriptions.find((p) => p._id === e.target.value);
  //     setSelectedPrescription(selected);
  //   },
  //   [prescriptions]
  // );

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </div>
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Prescription Details</h2>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-700 hover:bg-red-800 text-white rounded"
          >
            Close
          </button>
        </div>

        {prescriptions.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No prescriptions found for this patient.
          </div>
        ) : (
          <>
            {/* Prescription Selector */}
            {/* <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Prescription
              </label>
              <select
                value={selectedPrescription?._id || ""}
                onChange={handleSelectChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>
                  Select a prescription
                </option>
                {prescriptions.map((prescription) => (
                  <option key={prescription._id} value={prescription._id}>
                    Prescription -{" "}
                    {new Date(prescription.createdAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )}
                  </option>
                ))}
              </select>
            </div> */}

            {/* PDF Viewer */}
            {selectedPrescription ? (
              <PDFErrorBoundary>
                <div className="h-[500px] overflow-auto">
                  <PDFViewer width="100%" height="100%" showToolbar={false}>
                    <PrescriptionPDF
                      key={selectedPrescription._id} // Add key to force re-render
                      doctor={selectedPrescription.doctor}
                      patient={selectedPrescription.patient}
                      diagnosis={selectedPrescription.diagnosis}
                      medicines={selectedPrescription.medicines}
                      labReports={selectedPrescription.labReports}
                      labTest={selectedPrescription.labTest}
                      vitals={selectedPrescription.vitals}
                    />
                  </PDFViewer>
                </div>
                <div className="flex justify-end mt-4">
                  <PDFDownloadLink
                    document={
                      <PrescriptionPDF
                        doctor={selectedPrescription.doctor}
                        patient={selectedPrescription.patient}
                        diagnosis={selectedPrescription.diagnosis}
                        medicines={selectedPrescription.medicines}
                        labReports={selectedPrescription.labReports}
                        labTest={selectedPrescription.labTest}
                        vitals={selectedPrescription.vitals}
                      />
                    }
                    fileName={`prescription-${selectedPrescription._id}.pdf`}
                  >
                    {({ loading }) =>
                      loading ? (
                        "Loading document..."
                      ) : (
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center">
                          <Download size={16} className="mr-2" />
                          Download PDF
                        </button>
                      )
                    }
                  </PDFDownloadLink>
                </div>
              </PDFErrorBoundary>
            ) : (
              <div className="text-center py-4 text-gray-500">
                Please select a prescription to view.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PrescriptionModal;
