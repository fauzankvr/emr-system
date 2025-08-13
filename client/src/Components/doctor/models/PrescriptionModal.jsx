import React, { useState, useEffect, memo } from "react";
import { PDFViewer, PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { axiosInstance } from "../../../API/axiosInstance";
import { toast } from "react-toastify";
import { Download, MessageCircle, X, Phone } from "lucide-react";

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

// Phone Number Modal Component
const PhoneNumberModal = ({ isOpen, onClose, onSubmit, currentPhone }) => {
  const [phoneNumber, setPhoneNumber] = useState(currentPhone || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!phoneNumber.trim()) {
      toast.error("Please enter a valid phone number");
      return;
    }

    // Basic phone number validation
    const cleanPhone = phoneNumber.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(phoneNumber);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center">
            <Phone size={20} className="mr-2 text-green-600" />
            Enter WhatsApp Number
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={isSubmitting}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient's WhatsApp Number
            </label>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Enter 10-digit mobile number"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              disabled={isSubmitting}
              autoFocus
            />
            <p className="text-xs text-gray-500 mt-1">
              Example: 9876543210 or +919876543210
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center justify-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <>
                  <MessageCircle size={16} className="mr-1" />
                  Send to WhatsApp
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// PDF Styles (keeping your existing styles)
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 12,
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
    bottom: 50,
    right: 20,
    textAlign: "right",
  },
});

// PrescriptionPDF Component (keeping your existing component)
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

// Enhanced PrescriptionModal Component with improved WhatsApp functionality
const PrescriptionModal = ({ prescriptionId, onClose }) => {
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

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

  const formatPhoneNumber = (phone) => {
    if (!phone) return "";
    // Remove all non-digits
    const cleaned = phone.replace(/\D/g, "");
    // If it doesn't start with country code, add Indian country code
    if (cleaned.length === 10) {
      return `91${cleaned}`;
    }
    // If it already has country code but no +, add it
    if (cleaned.length > 10 && !cleaned.startsWith("+")) {
      return cleaned;
    }
    return cleaned;
  };

  const generatePDFBlob = async () => {
    try {
      const doc = (
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
      );

      const blob = await pdf(doc).toBlob();
      return blob;
    } catch (error) {
      console.error("Error generating PDF:", error);
      throw error;
    }
  };

  // Enhanced WhatsApp sharing function - focuses on direct sharing without downloads
  const sendToWhatsApp = async (phoneNumber) => {
    try {
      setSendingWhatsApp(true);
      
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      if (!formattedPhone) {
        toast.error("Invalid phone number");
        return;
      }

      // Generate PDF blob
      const pdfBlob = await generatePDFBlob();
      
      // Create message text
      const message = `Hi ${prescription.patient.name},\n\nYour prescription from Dr. ${prescription.doctor.name} is ready.\n\nDate: ${new Date().toLocaleDateString()}\n\nPlease find your prescription attached.\n\nBest regards,\nClinic Management System`;
      
      // Check if Web Share API is supported
      const canShare = navigator.share && navigator.canShare;
      
      if (canShare) {
        try {
          // Create a File object from the PDF blob
          const pdfFile = new File(
            [pdfBlob], 
            `${prescription.patient.name}-prescription.pdf`, 
            { type: 'application/pdf' }
          );
          
          const shareData = {
            title: 'Medical Prescription',
            text: message,
            files: [pdfFile]
          };
          
          // Check if the specific data can be shared
          if (navigator.canShare(shareData)) {
            await navigator.share(shareData);
            toast.success("Prescription shared successfully via WhatsApp!");
            setShowPhoneModal(false);
            return;
          }
        } catch (shareError) {
          // If user cancels, don't show error
          if (shareError.name === 'AbortError') {
            setShowPhoneModal(false);
            return;
          }
          console.log("Web Share API failed:", shareError);
          // Continue to fallback method
        }
      }

      // Fallback method - use WhatsApp URL with message only
      // Note: WhatsApp URL doesn't support file attachment directly
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      
      // Create a temporary download for the PDF (user can manually attach)
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Simplified message for URL fallback
      const urlMessage = `Hi ${prescription.patient.name}, your prescription from Dr. ${prescription.doctor.name} is ready. Date: ${new Date().toLocaleDateString()}`;
      
      if (isMobile) {
        // Try different WhatsApp URL schemes for mobile
        const whatsappUrls = [
          `whatsapp://send?phone=${formattedPhone}&text=${encodeURIComponent(urlMessage)}`,
          `https://api.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(urlMessage)}`,
        ];
        
        // Try to open WhatsApp app first, then web version
        let opened = false;
        for (const url of whatsappUrls) {
          try {
            window.open(url, '_blank');
            opened = true;
            break;
          } catch (error) {
            console.log(`Failed to open ${url}:`, error);
          }
        }
        
        if (opened) {
          // Create a download link for the PDF
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = `${prescription.patient.name}-prescription.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          toast.info("WhatsApp opened with message. PDF downloaded - please attach it to your message.", {
            duration: 5000,
          });
        }
      } else {
        // Desktop: Open WhatsApp Web
        const whatsappWebUrl = `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encodeURIComponent(urlMessage)}`;
        window.open(whatsappWebUrl, '_blank');
        
        // Download PDF for manual attachment
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.download = `${prescription.patient.name}-prescription.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.info("WhatsApp Web opened with message. PDF downloaded - please attach it to your message.", {
          duration: 5000,
        });
      }
      
      setShowPhoneModal(false);
      
      // Clean up the temporary URL
      setTimeout(() => {
        URL.revokeObjectURL(pdfUrl);
      }, 30000); // Give more time for user to use the file
      
    } catch (error) {
      console.error("Error sending to WhatsApp:", error);
      toast.error("Failed to send to WhatsApp. Please try again.");
    } finally {
      setSendingWhatsApp(false);
    }
  };

  const handleWhatsAppClick = () => {
    const patientPhone = prescription?.patient?.phone || prescription?.patient?.mobile;
    
    if (patientPhone && patientPhone !== "-") {
      // Phone number exists, send directly
      sendToWhatsApp(patientPhone);
    } else {
      // No phone number, show modal
      setShowPhoneModal(true);
    }
  };

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
    <>
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
              <PDFViewer width="100%" height="100%">
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
            
            {/* Action Buttons */}
            <div className="flex justify-end mt-4 gap-3">
              {/* WhatsApp Send Button */}
              <button
                onClick={handleWhatsAppClick}
                disabled={sendingWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center disabled:opacity-50 transition-colors"
              >
                {sendingWhatsApp ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <MessageCircle size={16} className="mr-2" />
                )}
                {sendingWhatsApp ? "Sharing..." : "Share via WhatsApp"}
              </button>

              {/* PDF Download Button */}
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
                    <button className="bg-blue-400 text-white px-4 py-2 rounded-md flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </button>
                  ) : (
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors">
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

      {/* Phone Number Modal */}
      <PhoneNumberModal
        isOpen={showPhoneModal}
        onClose={() => setShowPhoneModal(false)}
        onSubmit={sendToWhatsApp}
        currentPhone={prescription?.patient?.phone || prescription?.patient?.mobile}
      />
    </>
  );
};

export default PrescriptionModal;
