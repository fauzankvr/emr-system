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
    console.error("PDFErrorBoundary caught error:", error);
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("PDFErrorBoundary error info:", errorInfo);
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
/// PDF Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12, // increased from 10
    backgroundColor: "#FFFFFF",
  },
  container: {
    padding: 10,
  },
  header: {
    backgroundColor: "#009688",
    padding: 10,
    textAlign: "center",
    color: "#FFFFFF",
  },
  headerText: {
    fontSize: 16, // increased from 14
    fontWeight: "bold",
  },
  subHeaderText: {
    fontSize: 10, // increased from 8
    marginTop: 2,
  },
  section: {
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 13, // increased from 11
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
    fontSize: 11, // increased from 9
  },
  tableCell: {
    fontSize: 11, // increased from 9
  },
  TapringHed: {
    fontSize: 10, // increased from 8
  },
  TapringP: {
    fontSize: 10, // increased from 8
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
    fontSize: 10, // increased from 8
  },
  signature: {
    position: "absolute",
    bottom: 50,
    right: 20,
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
    patient = { name: "-", mobile: "-", age: "-" },
    diagnosis = "-",
    notes = "-",
    medicines = [],
    labReports = [],
    labTest = [],
    vitals = {
      spo2: "-",
      bp: "-",
      pulse: "-",
      temp: "-",
      weight: "-",
    },
    bookingNotes = "",
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

          {/* Container for other elements with padding */}
          <View style={styles.container}>
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
                    {patient.mobile || patient.contact}
                  </Text>
                  <Text>
                    <Text style={styles.label}>Age:</Text> {patient.age}
                  </Text>
                  <Text>
                    <Text style={styles.label}>Booking Notes:</Text> {bookingNotes}
                  </Text>
                  <Text>
                    <Text style={styles.label}>Diagnosis:</Text>{" "}
                    {diagnosis || "N/A"}
                  </Text>
                  <Text>
                    <Text style={styles.label}>Additional Notes:</Text>{" "}
                    {notes || "N/A"}
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
                      <Text style={styles.label}>Report Name:</Text> {report.name}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Value:</Text>{" "}
                      {report.values || "-"}
                    </Text>
                    <Text>
                      <Text style={styles.label}>Report Date:</Text>{" "}
                      {report.reportDate || "-"}
                    </Text>
                  </View>
                ))
              ) : (
                <Text>-</Text>
              )}
            </View>

            <View style={styles.hr} />

            {/* Medicines */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Medicines</Text>
              <View style={styles.table}>
                {/* Table Header */}
                <View style={styles.tableRow}>
                  <View style={[styles.tableColHeader, { width: "8%" }]}>
                    <Text style={styles.tableCellHeader}>Sl</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: "25%" }]}>
                    <Text style={styles.tableCellHeader}>Medicine</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: "12%" }]}>
                    <Text style={styles.tableCellHeader}>Dosage</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: "12%" }]}>
                    <Text style={styles.tableCellHeader}>Type</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: "12%" }]}>
                    <Text style={styles.tableCellHeader}>Frequency</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: "10%" }]}>
                    <Text style={styles.tableCellHeader}>Duration</Text>
                  </View>
                  <View style={[styles.tableColHeader, { width: "21%" }]}>
                    <Text style={styles.tableCellHeader}>Instructions</Text>
                  </View>
                </View>

                {/* Table Rows */}
                {medicines.length > 0 ? (
                  medicines.map((med, index) => (
                    <View key={index}>
                      {/* Main Row */}
                      <View style={styles.tableRow}>
                        <View style={[styles.tableCol, { width: "8%" }]}>
                          <Text style={styles.tableCell}>{index + 1}</Text>
                        </View>

                        {/* Medicine Name + Content + Tapering */}
                        <View style={[styles.tableCol, { width: "25%" }]}>
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
                              Content: {med.medicine.content}
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
                                  {taper.dosage || "-"} for {taper.days || "-"}
                                </Text>
                              ))}
                            </>
                          )}
                        </View>

                        {/* Dosage Column */}
                        <View style={[styles.tableCol, { width: "12%" }]}>
                          <Text style={styles.tableCell}>
                            {med.dosageAmount || "-"}
                          </Text>
                        </View>

                        {/* Type (Dosage Form) Column */}
                        <View style={[styles.tableCol, { width: "12%" }]}>
                          <Text style={styles.tableCell}>
                            {med.medicine?.dosageForm || "-"}
                          </Text>
                        </View>

                        {/* Frequency Column */}
                        <View style={[styles.tableCol, { width: "12%" }]}>
                          <Text style={styles.tableCell}>{med.dosage || "-"}</Text>
                        </View>

                        {/* Duration Column */}
                        <View style={[styles.tableCol, { width: "10%" }]}>
                          <Text style={styles.tableCell}>
                            {med.duration || "-"}
                          </Text>
                        </View>

                        {/* Instructions Column */}
                        <View style={[styles.tableCol, { width: "21%" }]}>
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
              {Array.isArray(labTest) && labTest.length > 0 && labTest[0] !== "" ? (
                labTest.map((val, idx) => (
                  <Text key={idx}>• {val}</Text>
                ))
              ) : (
                <Text>-</Text>
              )}
            </View>
          </View>

          {/* Signature Placeholder */}
          <View style={styles.signature}>
            <Text style={{ fontStyle: "italic" }}>Signed by</Text>
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
const PrescriptionModal = ({ prescriptionId, onClose }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPrescription = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/api/prescription/${prescriptionId}`
        );
        const prescriptionData = response.data.data;
        setPrescription(prescriptionData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching prescription:", err);
        setError("Failed to load prescription. Please try again.");
        setLoading(false);
        toast.error("Failed to load prescription.");
      }
    };

    fetchPrescription();
  }, [prescriptionId]);

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

  if (!prescription) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="text-center py-4 text-gray-500">
            No prescription found.
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

        <PDFErrorBoundary>
          <div className="h-[500px] overflow-auto">
            <PDFViewer width="100%" height="100%" >
              <PrescriptionPDF
                key={prescription._id}
                doctor={{
                  name: prescription.doctor.name,
                  regNo: "35083",
                  contact: prescription.doctor.phone,
                }}
                patient={{
                  name: prescription.patient.name,
                  mobile: prescription.patient.phone,
                  age: prescription.patient.age,
                }}
                diagnosis={prescription.diagnosis}
                notes={prescription.notes}
                medicines={prescription.medicines}
                labReports={prescription.labReports}
                labTest={prescription.labTest}
                vitals={prescription.patient.vitals}
                bookingNotes={prescription.bookingNotes}
              />
            </PDFViewer>
          </div>
          <div className="flex justify-end mt-4">
            <PDFDownloadLink
              document={
                <PrescriptionPDF
                  doctor={{
                    name: prescription.doctor.name,
                    regNo: "35083",
                    contact: prescription.doctor.phone,
                  }}
                  patient={{
                    name: prescription.patient.name,
                    mobile: prescription.patient.phone,
                    age: prescription.patient.age,
                  }}
                  diagnosis={prescription.diagnosis}
                  notes={prescription.notes}
                  medicines={prescription.medicines}
                  labReports={prescription.labReports}
                  labTest={prescription.labTest}
                  vitals={prescription.patient.vitals}
                  bookingNotes={prescription.bookingNotes}
                />
              }
              fileName={`${prescription.patient.name}-prescription.pdf`}
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
      </div>
    </div>
  );
};

export default PrescriptionModal;