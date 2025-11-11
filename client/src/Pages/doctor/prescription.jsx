import React, { useState, useEffect } from "react";
import { Search, Plus, Trash2, FileText, Download, Pencil, Send } from "lucide-react";
import { axiosInstance } from "../../API/axiosInstance";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import TemplateModal from "../../Components/doctor/models/TemplateModal";
import AddItemModal from "../../Components/doctor/models/AddItemModal";
// const backendUrl = import.meta.env.VITE_BACKEND_URL;

import { useRef } from 'react';

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


const PrescriptionPDF = ({
  doctor = { name: "Dr MANSOOR ALI.VP", regNo: "35083", contact: "9895353078" },
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
  date = new Date()
}) => {
  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    timeZone: "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(date));

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
                {bookingNotes && (
                  <Text>
                    <Text style={styles.label}>Booking Notes:</Text> {bookingNotes}
                  </Text>
                )}
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
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: "UTC",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).format(new Date(report.reportDate)) || "-"}
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

                      {/* Other Columns */}
                      <View style={[styles.tableCol, { width: "12%" }]}>
                        <Text style={styles.tableCell}>
                          {med.medicine?.dosageForm || "-"}
                        </Text>
                      </View>
                      <View style={[styles.tableCol, { width: "12%" }]}>
                        <Text style={styles.tableCell}>{med.dosage || "-"}</Text>
                      </View>
                      <View style={[styles.tableCol, { width: "10%" }]}>
                        <Text style={styles.tableCell}>
                          {med.duration || "-"}
                        </Text>
                      </View>
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

          {/* Investigations for Next Visit */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Investigation On Next Visit</Text>
            {labTest.map((val) => (
              <Text key={val}>{val.name}</Text>
            ))}
          </View>
        </View>

        {/* Signature Placeholder */}
        <View style={styles.signature}>
          <Text style={{ fontStyle: "italic" }}>
            Signed by
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
};

const Prescription = () => {
  const [loading, setLoading] = useState(false);
  const [labReportLoading, setLabReportLoading] = useState(false);
  const [prescriptionId, setPrescriptionId] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [patient, setPatient] = useState(null);
  const [diagnosis, setDiagnosis] = useState("");
  const [customDiagnosis, setCustomDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date())

  const [medicines, setMedicines] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [vitals, setVitals] = useState({
    spo2: "",
    bp: "",
    pulse: "",
    temp: "",
    unit: "F",
    weight: "",
  });
  const [availableMedicines, setAvailableMedicines] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [showPDFModal, setShowPDFModal] = useState(false);
  const location = useLocation();
  const [labTest, setLabTest] = useState([""])
  const [editMedicineIndex, setEditMedicineIndex] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  // const [showPatientModal, setShowPatientModal] = useState(false);
  // const [showDoctorModal, setShowDoctorModal] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [doctorId, setDoctorId] = useState(null);

  // New state for dynamic data
  const [diagnoses, setDiagnoses] = useState([]);
  const [frequencies, setFrequencies] = useState([]);
  const [instructions, setInstructions] = useState([]);
  const [days, setDays] = useState([]);
  const [dosages, setDosages] = useState([]);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editItem, setEditItem] = useState(null);
  const [availablePatients, setAvailablePatients] = useState([]);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  // const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Additional state for search functionality
  const [frequencySearchTerm, setFrequencySearchTerm] = useState('');
  const [durationSearchTerm, setDurationSearchTerm] = useState('');
  const [instructionsSearchTerm, setInstructionsSearchTerm] = useState('');
  const [dosageSearchTerm, setDosageSearchTerm] = useState('');

  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);
  const [showInstructionsDropdown, setShowInstructionsDropdown] = useState(false);
  const [showDosageDropdown, setShowDosageDropdown] = useState(false);

  // For tapering sections
  const [taperingFrequencySearchTerms, setTaperingFrequencySearchTerms] = useState([]);
  const [taperingDaysSearchTerms, setTaperingDaysSearchTerms] = useState([]);
  const [showTaperingFrequencyDropdowns, setShowTaperingFrequencyDropdowns] = useState({});
  const [showTaperingDaysDropdowns, setShowTaperingDaysDropdowns] = useState({});

  const [diagnosisSearchTerm, setDiagnosisSearchTerm] = useState('');
  const [showDiagnosisDropdown, setShowDiagnosisDropdown] = useState(false);
  const [selectedDiagnosis, setSelectedDiagnosis] = useState({ name: '' });



  // Add these refs
  const medicineDropdownRef = useRef(null);
  const dosageDropdownRef = useRef(null);
  const frequencyDropdownRef = useRef(null);
  const durationDropdownRef = useRef(null);
  const instructionsDropdownRef = useRef(null);
  // Add these refs for tapering dropdowns
  const taperingFrequencyDropdownRefs = useRef({});
  const taperingDaysDropdownRefs = useRef({});
  const diagnosisDropdownRef = useRef(null);



  // Add these new states for keyboard navigation
  const [highlightedMedicineIndex, setHighlightedMedicineIndex] = useState(-1);
  const [highlightedFrequencyIndex, setHighlightedFrequencyIndex] = useState(-1);
  const [highlightedDurationIndex, setHighlightedDurationIndex] = useState(-1);
  const [highlightedInstructionsIndex, setHighlightedInstructionsIndex] = useState(-1);
  const [highlightedDosageIndex, setHighlightedDosageIndex] = useState(-1);
  const [highlightedDiagnosisIndex, setHighlightedDiagnosisIndex] = useState(-1);
  // Add these states for tapering keyboard navigation
  const [highlightedTaperingFrequencyIndices, setHighlightedTaperingFrequencyIndices] = useState({});
  const [highlightedTaperingDaysIndices, setHighlightedTaperingDaysIndices] = useState({});


  const handleKeyDown = (e, items, highlightedIndex, setHighlightedIndex, onSelect, closeDropdown) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < items.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : items.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && items[highlightedIndex]) {
          onSelect(items[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        closeDropdown();
        break;
      default:
        break;
    }
  };

  // Auto-scroll for medicine dropdown
  useEffect(() => {
    if (highlightedMedicineIndex >= 0 && medicineDropdownRef.current) {
      const dropdown = medicineDropdownRef.current;
      const highlightedItem = dropdown.children[highlightedMedicineIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedMedicineIndex]);

  // Auto-scroll for dosage dropdown
  useEffect(() => {
    if (highlightedDosageIndex >= 0 && dosageDropdownRef.current) {
      const dropdown = dosageDropdownRef.current;
      const highlightedItem = dropdown.children[highlightedDosageIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedDosageIndex]);

  // Auto-scroll for frequency dropdown
  useEffect(() => {
    if (highlightedFrequencyIndex >= 0 && frequencyDropdownRef.current) {
      const dropdown = frequencyDropdownRef.current;
      const highlightedItem = dropdown.children[highlightedFrequencyIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedFrequencyIndex]);

  // Auto-scroll for duration dropdown
  useEffect(() => {
    if (highlightedDurationIndex >= 0 && durationDropdownRef.current) {
      const dropdown = durationDropdownRef.current;
      const highlightedItem = dropdown.children[highlightedDurationIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedDurationIndex]);

  // Auto-scroll for instructions dropdown
  useEffect(() => {
    if (highlightedInstructionsIndex >= 0 && instructionsDropdownRef.current) {
      const dropdown = instructionsDropdownRef.current;
      const highlightedItem = dropdown.children[highlightedInstructionsIndex];
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [highlightedInstructionsIndex]);


  // SINGLE auto-scroll for tapering frequency dropdowns - USE THIS ONLY
  useEffect(() => {
    const handleScroll = () => {
      Object.keys(highlightedTaperingFrequencyIndices).forEach(scheduleIndex => {
        const highlightedIndex = highlightedTaperingFrequencyIndices[scheduleIndex];

        if (highlightedIndex >= 0 &&
          taperingFrequencyDropdownRefs.current?.[scheduleIndex]) {

          const dropdown = taperingFrequencyDropdownRefs.current[scheduleIndex];

          if (dropdown?.children?.[highlightedIndex]) {
            const highlightedItem = dropdown.children[highlightedIndex];

            // Simple, reliable scrolling
            const itemTop = highlightedItem.offsetTop;
            const itemHeight = highlightedItem.offsetHeight;
            const dropdownHeight = dropdown.clientHeight;
            const currentScroll = dropdown.scrollTop;

            // Check if item is out of view
            if (itemTop < currentScroll) {
              dropdown.scrollTop = itemTop;
            } else if (itemTop + itemHeight > currentScroll + dropdownHeight) {
              dropdown.scrollTop = itemTop - dropdownHeight + itemHeight;
            }
          }
        }
      });
    };

    // Use requestAnimationFrame for smooth performance
    const rafId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId);
  }, [highlightedTaperingFrequencyIndices]);

  // SINGLE auto-scroll for tapering days dropdowns - USE THIS ONLY
  useEffect(() => {
    const handleScroll = () => {
      Object.keys(highlightedTaperingDaysIndices).forEach(scheduleIndex => {
        const highlightedIndex = highlightedTaperingDaysIndices[scheduleIndex];

        if (highlightedIndex >= 0 &&
          taperingDaysDropdownRefs.current?.[scheduleIndex]) {

          const dropdown = taperingDaysDropdownRefs.current[scheduleIndex];

          if (dropdown?.children?.[highlightedIndex]) {
            const highlightedItem = dropdown.children[highlightedIndex];

            const itemTop = highlightedItem.offsetTop;
            const itemHeight = highlightedItem.offsetHeight;
            const dropdownHeight = dropdown.clientHeight;
            const currentScroll = dropdown.scrollTop;

            if (itemTop < currentScroll) {
              dropdown.scrollTop = itemTop;
            } else if (itemTop + itemHeight > currentScroll + dropdownHeight) {
              dropdown.scrollTop = itemTop - dropdownHeight + itemHeight;
            }
          }
        }
      });
    };

    const rafId = requestAnimationFrame(handleScroll);
    return () => cancelAnimationFrame(rafId);
  }, [highlightedTaperingDaysIndices]);


  // COMPLETELY REWRITTEN handleTaperingKeyDown function
  const handleTaperingKeyDown = (e, items, scheduleIndex, highlightedIndices, setHighlightedIndices, onSelect, closeDropdown) => {
    // Prevent default for navigation keys
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Get current highlighted index with proper fallback
    const currentHighlighted = highlightedIndices[scheduleIndex] ?? -1;

    // Ensure we have items to navigate
    if (!items || items.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        const nextIndex = currentHighlighted >= items.length - 1 ? 0 : currentHighlighted + 1;
        setHighlightedIndices(prev => ({
          ...prev,
          [scheduleIndex]: nextIndex
        }));
        break;

      case 'ArrowUp':
        const prevIndex = currentHighlighted <= 0 ? items.length - 1 : currentHighlighted - 1;
        setHighlightedIndices(prev => ({
          ...prev,
          [scheduleIndex]: prevIndex
        }));
        break;

      case 'Enter':
        if (currentHighlighted >= 0 &&
          currentHighlighted < items.length &&
          items[currentHighlighted]) {
          onSelect(items[currentHighlighted]);
          setHighlightedIndices(prev => {
            const newIndices = { ...prev };
            delete newIndices[scheduleIndex];
            return newIndices;
          });
        }
        break;

      case 'Escape':
        closeDropdown();
        setHighlightedIndices(prev => {
          const newIndices = { ...prev };
          delete newIndices[scheduleIndex];
          return newIndices;
        });
        break;

      default:
        break;
    }
  };



  const filteredDiagnoses = diagnoses.filter(diag =>
    diag.name.toLowerCase().includes(diagnosisSearchTerm.toLowerCase())
  );

  // Filtered data based on search terms
  const filteredFrequencies = frequencies.filter(freq =>
    freq.name.toLowerCase().includes(frequencySearchTerm.toLowerCase())
  );

  const filteredDays = days.filter(day =>
    day.name.toLowerCase().includes(durationSearchTerm.toLowerCase())
  );

  const filteredInstructions = instructions.filter(inst =>
    inst.name.toLowerCase().includes(instructionsSearchTerm.toLowerCase())
  );

  const filteredDosages = dosages.filter(dosage =>
    dosage.name.toLowerCase().includes(dosageSearchTerm.toLowerCase())
  );

  // Helper functions for tapering filtered data
  const getTaperingFilteredFrequencies = (index) => {
    const searchTerm = taperingFrequencySearchTerms[index] || '';
    return frequencies.filter(freq =>
      freq.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getTaperingFilteredDays = (index) => {
    const searchTerm = taperingDaysSearchTerms[index] || '';
    return days.filter(day =>
      day.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const [newMedicine, setNewMedicine] = useState({
    medicine: "",
    dosageAmount: "",
    dosage: "",
    duration: "",
    instructions: "",
    isTapering: false,
    tapering: [{ dosage: "", days: "" }],
  });

  const [newLabReport, setNewLabReport] = useState({
    name: "",
    values: "",
    reportDate: "",
  });

  const [newLabReportFile, setNewLabReportFile] = useState(null);
  const [oldDescriptions, setOldDescriptions] = useState([]);

  const diagnosisOptions = [
    "Abdominal Pain",
    "Acne Vulgaris",
    "Acute Bronchitis",
    "Acute Gastritis",
    "Allergic Rhinitis",
    "Anemia",
    "Anxiety Disorder",
    "Asthma",
    "Back Pain",
    "Bacterial Infection",
    "Bipolar Disorder",
    "Bronchial Asthma",
    "BPH (Benign Prostatic Hyperplasia)",
    "Burns",
    "Cancer",
    "Chickenpox",
    "Chronic Kidney Disease",
    "COPD (Chronic Obstructive Pulmonary Disease)",
    "Common Cold",
    "Conjunctivitis",
    "Constipation",
    "COVID-19",
    "Dengue Fever",
    "Depression",
    "Diabetes Mellitus (Type 1 / Type 2)",
    "Diarrhea",
    "Dizziness",
    "Dyspepsia",
    "Ear Infection",
    "Eczema",
    "Epilepsy",
    "Erectile Dysfunction",
    "Eye Strain",
    "Fatty Liver",
    "Febrile Illness",
    "Fibromyalgia",
    "Food Poisoning",
    "Fracture",
    "Fungal Infection",
    "Gallstones",
    "Gastric Ulcer",
    "Gastroenteritis",
    "GERD (Gastroesophageal Reflux Disease)",
    "Glaucoma",
  ];

  const symptomOptions = [
    "Fever",
    "Cough",
    "Headache",
    "Sore Throat",
    "Fatigue",
    "Nausea",
    "Vomiting",
    "Diarrhea",
    "Shortness of Breath",
    "Chest Pain",
    "Dizziness",
    "Skin Rash",
    "Muscle Pain",
    "Joint Pain",
    "Abdominal Pain",
    "Back Pain",
    "Loss of Smell",
    "Loss of Taste",
  ];

  const [taperingCustomModes, setTaperingCustomModes] = useState([]);

  const [bookingNotes, setBookingNotes] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const patientIdParams = queryParams.get("patientId");
    const doctorIdParams = queryParams.get("doctorId");

    if (patientIdParams) {
      setPatientId(patientIdParams);
    }
    if (doctorIdParams) {
      setDoctorId(doctorIdParams);
    }
  }, [location.search]);

  const queryParams = new URLSearchParams(location.search);
  const appointmentId = queryParams.get("appointmentId");
  const templateId = queryParams.get("templateId");
  const saveAsTemplate = queryParams.get("saveAsTemplate");

  useEffect(() => {
    async function fetchData() {
      if (doctorId) {
        const doctorResponse = await axiosInstance.get(
          `/api/doctor/${doctorId}`
        );
        setDoctor(doctorResponse.data.data);
      }

      if (patientId) {
        const patientResponse = await axiosInstance.get(
          `/api/patient/${patientId}`
        );
        setPatient(patientResponse.data.data);

        // Fetch patient’s old descriptions (based on doctorId)
        const descResponse = await axiosInstance.get(
          `/api/prescription/patient/${patientId}`
        );
        setOldDescriptions(descResponse.data.data || []);

        if (patientResponse?.data?.data?.vitals) {
          const vitalsData = patientResponse.data.data.vitals;
          let tempUnit = "F";
          if (vitalsData.temp) {
            // Match number + unit separately (e.g., "10C" -> ["10", "C"])
            const match = vitalsData.temp.match(/^([\d.]+)\s*([CF])$/i);
            if (match) {
              tempUnit = match[2].toUpperCase();
            }
          }

          setVitals({
            ...vitalsData,
            temp: vitalsData.temp,
            unit: tempUnit,
          });
        }
      }
    }
    fetchData()
  }, [doctorId, patientId])

  let urlParams = new URLSearchParams(window.location.search);
  useEffect(() => {
    if (availableDoctors.length > 0 && !doctorId) {
      const firstDoctor = availableDoctors[0];
      setDoctor(firstDoctor);
      setDoctorId(firstDoctor._id);
    }
  }, [availableDoctors]);

  function handleShowOldData(data) {
    urlParams.set("isOld", "true");
    window.history.replaceState(
      {},
      "",
      `${window.location.pathname}?${urlParams.toString()}`
    );
    setDiagnosis(data?.diagnoses)
    setBookingNotes(data?.bookingNotes);
    setLabTest(data?.labTest)
    setLabReports(data?.labReports)
    setMedicines(data?.medicines);
    setSelectedDate(data?.createdAt)
    setShowPDFModal(true)
  }

  function handleAddOldData(data) {
    toast.success("Added successfully");
    setLabTest(data?.labTest);
    setLabReports(data?.labReports);
    setMedicines(data?.medicines)
  }
  useEffect(() => {
    const fetchInitialData = async () => {
      if (saveAsTemplate === 'true') {
        setShowTemplateModal(true);
      }
      setLoading(true);
      try {
        const medicinesResponse = await axiosInstance.get("/api/medicine");
        setAvailableMedicines(medicinesResponse.data);

        // Fetch dynamic data from backend
        const [diagnosesResponse, frequenciesResponse, instructionsResponse, daysResponse, dosagesResponse] = await Promise.all([
          axiosInstance.get("/api/diagnosis"),
          axiosInstance.get("/api/frequency"),
          axiosInstance.get("/api/instruction"),
          axiosInstance.get("/api/days"),
          axiosInstance.get("/api/dosage")
        ]);

        setDiagnoses(diagnosesResponse.data.data || []);
        setFrequencies(frequenciesResponse.data.data || []);
        setInstructions(instructionsResponse.data.data || []);
        setDays(daysResponse.data.data || []);
        setDosages(dosagesResponse.data.data || []);

        const prescId = urlParams.get("id") || localStorage.getItem("prescription");

        if (prescId) {
          const prescriptionResponse = await axiosInstance.get(`/api/prescription/${prescId}`);
          const prescData = prescriptionResponse.data.data;

          setPrescriptionId(prescData._id);
          setBookingNotes(prescData.bookingNotes)
          setDiagnosis(prescData.diagnosis || "");
          if (!diagnosisOptions.includes(prescData.diagnosis)) {
            setCustomDiagnosis(prescData.diagnosis);
            setDiagnosis("Custom");
          }
          setSelectedDiagnosis({
            name: prescData.diagnosis || "",
            notes: prescData.notes || ""
          });
          setDiagnosisSearchTerm(prescData.diagnosis || "");
          setNotes(prescData.notes || "");
          setMedicines(prescData.medicines || []);
          setLabReports(prescData.labReports || []);
          setLabTest(prescData.labTest || []);
        }

        // Load template data if templateId is provided
        if (templateId) {
          const templateResponse = await axiosInstance.get(`/api/template/${templateId}`);
          const templateData = templateResponse.data.data;
          setDiagnosis(templateData.diagnosis || "");
          if (templateData.diagnosis && !diagnosisOptions.includes(templateData.diagnosis)) {
            setCustomDiagnosis(templateData.diagnosis);
            setDiagnosis("Custom");
          }
          setSelectedDiagnosis({
            name: templateData.diagnosis || "",
            notes: templateData.notes || ""
          });
          setDiagnosisSearchTerm(templateData.diagnosis || "");
          setNotes(templateData.notes || "");
          setMedicines(templateData.medicines || []);
          setLabReports(templateData.labReports || []);
          setLabTest(templateData.labTest || []);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredResults = availableMedicines.filter((medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [searchTerm, availableMedicines]);

  useEffect(() => {
    if (appointmentId) {
      axiosInstance.get(`/api/booking/${appointmentId}`)
        .then(res => {
          if (res.data?.data?.notes) {
            setBookingNotes(res.data.data.notes);
          }
        })
        .catch(err => {
          console.error("Error fetching booking data:", err);
        });
    }
  }, [appointmentId]);

  const handleMedicineSelect = (medicine) => {
    setNewMedicine({
      ...newMedicine,
      medicine: {
        _id: medicine._id,
        name: medicine.name,
        content: medicine.content,
        dosageForm: medicine.dosageForm,
        strength: medicine.strength,
      },
      dosageAmount: medicine.strength || "",
    });
    setSearchTerm(medicine.name);
    setShowMedicineDropdown(false);
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.medicine) {
      toast.error("Please select a medicine");
      return;
    }

    if (newMedicine.isTapering) {
      const invalidSchedule = newMedicine.tapering.some(
        (schedule, tIdx) =>
          !(taperingCustomModes[tIdx]?.freq ? taperingCustomModes[tIdx].freqVal : schedule.dosage) ||
          !(taperingCustomModes[tIdx]?.days ? taperingCustomModes[tIdx].daysVal : schedule.days)
      );
      if (invalidSchedule) {
        toast.error("Please fill all tapering schedule fields (dosage and days)");
        return;
      }
    }

    const frequencyValue = newMedicine.dosage;
    const durationValue = newMedicine.duration;
    const instructionsValue = newMedicine.instructions;
    const dosageValue = newMedicine.dosageAmount;
    const taperingValue = newMedicine.isTapering && newMedicine.tapering
      ? newMedicine.tapering.map((tap, tIdx) => ({
        ...tap,
        dosage: taperingCustomModes[tIdx]?.freq ? taperingCustomModes[tIdx].freqVal : tap.dosage,
        days: taperingCustomModes[tIdx]?.days ? taperingCustomModes[tIdx].daysVal : tap.days,
      }))
      : newMedicine.tapering;

    const medicineToAdd = {
      medicine: {
        _id: newMedicine.medicine._id,
        name: newMedicine.medicine.name,
        content: newMedicine.medicine.content,
        dosageForm: newMedicine.medicine.dosageForm,
        strength: newMedicine.medicine.strength,
      },
      dosageAmount: dosageValue,
      dosage: frequencyValue,
      duration: durationValue,
      instructions: instructionsValue,
      isTapering: newMedicine.isTapering,
      ...(newMedicine.isTapering && { tapering: taperingValue }),
    };

    setMedicines([...medicines, medicineToAdd]);
    setNewMedicine({
      medicine: "",
      dosageAmount: "",
      dosage: "",
      duration: "",
      instructions: "",
      isTapering: false,
      tapering: [{ dosage: "", days: "" }],
    });
    setSearchTerm("");
    setDosageSearchTerm("");
    setFrequencySearchTerm("");
    setDurationSearchTerm("");
    setInstructionsSearchTerm("");
    setTaperingCustomModes([]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleAddTaperingSchedule = () => {
    setNewMedicine({
      ...newMedicine,
      tapering: [...newMedicine.tapering, { dosage: "", days: "" }],
    });
    setTaperingCustomModes([...taperingCustomModes, { freq: false, days: false, freqVal: '', daysVal: '' }]);
  };

  const handleUpdateTaperingSchedule = (index, field, value) => {
    const updatedTapering = [...newMedicine.tapering];
    updatedTapering[index] = { ...updatedTapering[index], [field]: value };
    setNewMedicine({ ...newMedicine, tapering: updatedTapering });
  };

  const handleRemoveTaperingSchedule = (index) => {
    setNewMedicine({
      ...newMedicine,
      tapering: newMedicine.tapering.filter((_, i) => i !== index),
    });
    setTaperingCustomModes(taperingCustomModes.filter((_, i) => i !== index));
  };

  const handleAddLabReport = async () => {
    // if (!newLabReport.name || !newLabReport.values) {
    //   toast.error("Please provide both report name and value");
    //   return;
    // }

    setLabReportLoading(true);
    try {
      let reportImageUrl = "";
      if (newLabReportFile) {
        try {
          const formData = new FormData();
          formData.append("reportFile", newLabReportFile);

          const response = await axiosInstance.post("/api/prescription/upload-lab-report", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          if (response.data.success) {
            reportImageUrl = response.data.data.reportImageUrl;
          } else {
            toast.error("Failed to upload file");
            return;
          }
        } catch (error) {
          console.error("File upload error:", error);
          toast.error("Failed to upload file");
          return;
        }
      }

      const labReportToAdd = {
        name: newLabReport.name,
        values: newLabReport.values,
        reportDate: newLabReport.reportDate,
        reportImageUrl,
      };

      setLabReports([...labReports, labReportToAdd]);
      setNewLabReport({ name: "", values: "", reportDate: "" });
      setNewLabReportFile(null);
    } catch (error) {
      console.error("Error adding lab report:", error);
      toast.error("Failed to add lab report");
    } finally {
      setLabReportLoading(false);
    }
  };

  const handleRemoveLabReport = (index) => {
    setLabReports(labReports.filter((_, i) => i !== index));
  };

  const handleEditLabReport = (index) => {
    const report = labReports[index];
    setNewLabReport({
      name: report.name || "",
      values: report.values || "",
      reportDate: report.reportDate || "",
    });
    setLabReports(labReports.filter((_, i) => i !== index));
  };

  const handleEditMedicine = (index) => {
    const med = medicines[index];
    setNewMedicine({
      medicine: med.medicine,
      dosageAmount: med.dosageAmount,
      dosage: med.dosage,
      duration: med.duration,
      instructions: med.instructions,
      isTapering: med.isTapering || false,
      tapering: med.tapering ? [...med.tapering] : [{ dosage: '', days: '' }],
    });
    setEditMedicineIndex(index);
    setSearchTerm(med.medicine.name);
    setDosageSearchTerm(med.dosageAmount || '');
    setFrequencySearchTerm(med.dosage || '');
    setDurationSearchTerm(med.duration || '');
    setInstructionsSearchTerm(med.instructions || '');
  };

  const handleSaveMedicine = () => {
    const frequencyValue = newMedicine.dosage;
    const durationValue = newMedicine.duration;
    const instructionsValue = newMedicine.instructions;
    const dosageValue = newMedicine.dosageAmount;

    const taperingValue = newMedicine.isTapering
      ? newMedicine.tapering.map((tap, tIdx) => ({
        dosage: taperingCustomModes[tIdx]?.freq
          ? taperingCustomModes[tIdx].freqVal
          : tap.dosage,
        days: taperingCustomModes[tIdx]?.days
          ? taperingCustomModes[tIdx].daysVal
          : tap.days,
      }))
      : [];

    const medicineToAdd = {
      medicine: {
        _id: newMedicine.medicine._id,
        name: newMedicine.medicine.name,
        content: newMedicine.medicine.content,
        dosageForm: newMedicine.medicine.dosageForm,
        strength: newMedicine.medicine.strength,
      },
      dosageAmount: dosageValue,
      dosage: frequencyValue,
      duration: durationValue || "",
      instructions: instructionsValue || "",
      isTapering: newMedicine.isTapering,
      ...(newMedicine.isTapering && { tapering: taperingValue }),
    };

    if (editMedicineIndex !== null) {
      const updatedMedicines = [...medicines];
      updatedMedicines[editMedicineIndex] = medicineToAdd;
      setMedicines(updatedMedicines);
      setEditMedicineIndex(null);
    } else {
      setMedicines([...medicines, medicineToAdd]);
    }

    setNewMedicine({
      medicine: "",
      dosageAmount: "",
      dosage: "",
      duration: "",
      instructions: "",
      isTapering: false,
      tapering: [{ dosage: "", days: "" }],
    });
    setSearchTerm("");
    setDosageSearchTerm("");
    setFrequencySearchTerm("");
    setDurationSearchTerm("");
    setInstructionsSearchTerm("");
    setTaperingCustomModes([]);
  };

  const handleSavePrescription = async () => {
    if (!doctorId || !patientId) {
      toast.error("Doctor or Patient ID is missing");
      return;
    }

    const diagnosisValue = diagnosis;

    try {
      await axiosInstance.patch(`/api/patient/${patientId}/vitals`, { vitals });
    } catch (error) {
      console.error("Error updating patient vitals:", error);
      toast.error("Failed to update patient vitals");
      return;
    }

    const prescriptionData = {
      doctor: doctorId,
      patient: patientId,
      diagnosis: diagnosisValue,
      notes,
      medicines: medicines.map((med) => ({
        medicine: med.medicine,
        dosageAmount: med.dosageAmount,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions,
        isTapering: med.isTapering,
        ...(med.isTapering && { tapering: med.tapering }),
      })),
      labReports: labReports.map(r => ({ ...r, values: r.values || r.value })),
      labTest
    };

    try {
      let response;
      if (prescriptionId) {
        response = await axiosInstance.put(
          `/api/prescription/${prescriptionId}`,
          prescriptionData
        );
        toast.success("Prescription updated successfully");
      } else {
        response = await axiosInstance.post(
          "/api/prescription",
          prescriptionData
        );
        await axiosInstance.patch(`/api/booking/complete/${appointmentId}`);
        localStorage.setItem("currentPrescriptionId", response.data._id);
        toast.success("Prescription saved successfully");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast.error("Failed to save prescription");
    }
  };

  const handleSave = async () => {
    if (!doctorId || !patientId) {
      toast.error("Doctor or Patient ID is missing");
      return;
    }

    const diagnosisValue = diagnosis;

    try {
      await axiosInstance.patch(`/api/patient/${patientId}/vitals`, { vitals });
    } catch (error) {
      console.error("Error updating patient vitals:", error);
      toast.error("Failed to update patient vitals");
      return;
    }

    const prescriptionData = {
      doctor: doctorId,
      patient: patientId,
      diagnosis: selectedDiagnosis.name || "",
      notes: selectedDiagnosis.notes || notes,
      bookingNotes: bookingNotes,
      medicines: medicines.map((med) => ({
        medicine: med.medicine,
        dosageAmount: med.dosageAmount,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions,
        isTapering: med.isTapering,
        ...(med.isTapering && { tapering: med.tapering }),
      })),
      labReports: labReports.map(r => ({ ...r, values: r.values || r.value })),
      labTest
    };

    try {
      let response;
      if (prescriptionId) {
        response = await axiosInstance.put(
          `/api/prescription/${prescriptionId}`,
          prescriptionData
        );
        toast.success("Prescription updated successfully");
      } else {
        response = await axiosInstance.post(
          "/api/prescription/save",
          prescriptionData
        );
        if (appointmentId) {
          await axiosInstance.patch(`/api/booking/complete/${appointmentId}`);
        } else {
          await axiosInstance.patch(`/api/booking/complete/${patientId}`);
        }
        localStorage.setItem("currentPrescriptionId", response.data.data._id);
        setPrescriptionId(response.data.data._id);
        toast.success("Prescription saved successfully");
      }
    } catch (error) {
      console.error("Error saving prescription:", error);
      toast.error("Failed to save prescription");
    }
  };

  const handleUpdate = async () => {
    if (!prescriptionId) {
      toast.error("No prescription ID found for update");
      return;
    }

    if (!doctorId || !patientId) {
      toast.error("Doctor or Patient ID is missing");
      return;
    }

    const diagnosisValue = diagnosis;

    try {
      await axiosInstance.patch(`/api/patient/${patientId}/vitals`, { vitals });
    } catch (error) {
      console.error("Error updating patient vitals:", error);
      toast.error("Failed to update patient vitals");
      return;
    }

    const prescriptionData = {
      doctor: doctorId,
      patient: patientId,
      diagnosis: selectedDiagnosis.name || "",
      notes: selectedDiagnosis.notes || notes,
      bookingNotes: bookingNotes,
      medicines: medicines.map((med) => ({
        medicine: med.medicine,
        dosageAmount: med.dosageAmount,
        dosage: med.dosage,
        duration: med.duration,
        instructions: med.instructions,
        isTapering: med.isTapering,
        ...(med.isTapering && { tapering: med.tapering }),
      })),
      labReports: labReports.map(r => ({ ...r, values: r.values || r.value })),
      labTest
    };

    try {
      const response = await axiosInstance.put(
        `/api/prescription/${prescriptionId}`,
        prescriptionData
      );
      toast.success("Prescription updated successfully");
    } catch (error) {
      console.error("Error updating prescription:", error);
      toast.error("Failed to update prescription");
    }
  };

  const handleSend = async () => {
    const currentPrescriptionId = prescriptionId || localStorage.getItem("currentPrescriptionId");

    if (!currentPrescriptionId) {
      toast.error("No prescription found to send. Please save the prescription first.");
      return;
    }

    try {
      const response = await axiosInstance.post(
        `/api/prescription/${currentPrescriptionId}/send-email`
      );
      toast.success("Prescription email sent successfully");
    } catch (error) {
      console.error("Error sending prescription email:", error);
      toast.error("Failed to send prescription email");
    }
  };

  const handleSaveAsTemplate = () => {
    if (medicines.length === 0) {
      toast.error("At least one medicine is required to save as template");
      return;
    }
    setShowTemplateModal(true);
  };

  const fetchDoctors = async (query = '') => {
    try {
      const response = await axiosInstance.get('/api/doctor', {
        params: query ? { q: query } : {},
      });
      setAvailableDoctors(response.data.data || []);
    } catch (error) {
      toast.error('Failed to fetch doctors');
    }
  };

  // Add this new state at the top with your other states
  const [allBookings, setAllBookings] = useState([]);

  // Updated fetchPatients function
  const fetchPatients = async (query = '') => {
    try {

      // Only fetch from API if we don't have data yet
      let bookingsToFilter = allBookings;

      if (allBookings.length === 0) {
        const response = await axiosInstance.get("/api/booking");
        const freshBookings = response.data.data.filter(
          (val) => val.patientId !== null && val.status === "booked"
        );
        setAllBookings(freshBookings);
        bookingsToFilter = freshBookings;
      }

      if (!query.trim()) {
        // No query: show all bookings
        setAvailablePatients(bookingsToFilter);
      } else {
        // Query exists: filter bookings by patient name or email
        const lowerQuery = query.toLowerCase();
        const filtered = bookingsToFilter.filter((booking) =>
          booking.patientId?.name?.toLowerCase().includes(lowerQuery) ||
          booking.patientId?.email?.toLowerCase().includes(lowerQuery)
        );
        setAvailablePatients(filtered);
      }
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast.error('Failed to fetch patients');
    }
  };


  const handleOpenAddModal = (type) => {
    setModalType(type);
    setEditItem(null);
    setShowAddModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setEditItem(null);
    setModalType('');
  };

  const handleItemAdded = (newItem) => {
    switch (modalType) {
      case 'medicine':
        setAvailableMedicines([...availableMedicines, newItem]);
        break;
      case 'diagnosis':
        setDiagnoses([...diagnoses, newItem]);
        break;
      case 'frequency':
        setFrequencies([...frequencies, newItem]);
        break;
      case 'instruction':
        setInstructions([...instructions, newItem]);
        break;
      case 'days':
        setDays([...days, newItem]);
        break;
      case 'dosage':
        setDosages([...dosages, newItem]);
        break;
      default:
        break;
    }
  };

  const handleItemUpdated = (updatedItem) => {
    if (!updatedItem) {
      switch (modalType) {
        case 'medicine':
          setAvailableMedicines(availableMedicines.filter(item => item._id !== editItem._id));
          break;
        case 'diagnosis':
          setDiagnoses(diagnoses.filter(item => item._id !== editItem._id));
          break;
        case 'frequency':
          setFrequencies(frequencies.filter(item => item._id !== editItem._id));
          break;
        case 'instruction':
          setInstructions(instructions.filter(item => item._id !== editItem._id));
          break;
        case 'days':
          setDays(days.filter(item => item._id !== editItem._id));
          break;
        case 'dosage':
          setDosages(dosages.filter(item => item._id !== editItem._id));
          break;
        default:
          break;
      }
    } else {
      switch (modalType) {
        case 'medicine':
          setAvailableMedicines(availableMedicines.map(item => item._id === updatedItem._id ? updatedItem : item));
          break;
        case 'diagnosis':
          setDiagnoses(diagnoses.map(item => item._id === updatedItem._id ? updatedItem : item));
          break;
        case 'frequency':
          setFrequencies(frequencies.map(item => item._id === updatedItem._id ? updatedItem : item));
          break;
        case 'instruction':
          setInstructions(instructions.map(item => item._id === updatedItem._id ? updatedItem : item));
          break;
        case 'days':
          setDays(days.map(item => item._id === updatedItem._id ? updatedItem : item));
          break;
        case 'dosage':
          setDosages(dosages.map(item => item._id === updatedItem._id ? updatedItem : item));
          break;
        default:
          break;
      }
    }
  };

  const handleEditItem = (item, type) => {
    setEditItem(item);
    setModalType(type);
    setShowAddModal(true);
  };

  useEffect(() => {
    if (templateId) {
      fetchDoctors();
      fetchPatients();
    }
  }, [templateId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="bg-gray-50 min-h-screen p-2 md:p-4">
        <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-blue-600 text-white p-2 md:p-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-lg font-bold">Medical Prescription</h1>
                <p className="text-blue-100 mt-1 text-sm">
                  {prescriptionId
                    ? "Edit Prescription"
                    : "Create New Prescription"}
                </p>
              </div>
              {/* <div className="flex space-x-1 mt-2 md:mt-0">
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={prescriptionId ? handleUpdate : handleSave}
                disabled={templateId && (!doctor || !patient)}
              >
                <FileText size={14} className="mr-1" />
                {prescriptionId ? "Update" : "Save"}
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={handleSend}
                disabled={!prescriptionId && !localStorage.getItem("currentPrescriptionId")}
              >
                <Send size={14} className="mr-1" />
                Send
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={handleSaveAsTemplate}
              >
                <Plus size={14} className="mr-1" />
                Save as Template
              </button>
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={() => setShowPDFModal(true)}
              >
                <Download size={14} className="mr-1" />
                PDF
              </button>
            </div> */}
            </div>
          </div>

          {/* Doctor and Patient Information */}
          <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Doctor Selection */}
            <div className="border rounded-lg p-2 bg-gray-50">
              {oldDescriptions ? (
                <>
                  {/* 🔹 Old Patient Descriptions Section */}
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">
                    Old Prescription
                  </h3>

                  {oldDescriptions.length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {oldDescriptions.map((desc) => (
                        <div
                          key={desc._id}
                          className="border rounded p-2 bg-white shadow-sm flex justify-between items-center"
                        >
                          {/* Left side - Date */}
                          <p className="text-xs text-gray-600 m-0">
                            <span className="font-medium">Date:</span>{" "}
                            {new Date(desc.createdAt).toLocaleString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                              timeZone: "UTC",
                              hour12: true,
                            })}
                          </p>

                          {/* Right side - Buttons */}
                          <div className="flex gap-2">
                            <button
                              className="text-xs px-2 py-1 bg-blue-500 text-white rounded cursor-pointer"
                              onClick={() => handleShowOldData(desc)}
                            >
                              Show
                            </button>
                            <button
                              className="text-xs px-2 py-1 bg-green-500 text-white rounded cursor-pointer"
                              onClick={() => handleAddOldData(desc)}
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No old prescription found.
                    </p>
                  )}
                </>
              ) : (
                <p className="text-gray-500 text-sm">Loading...</p>
              )}
            </div>

            {/* Patient Selection */}
            <div className="border rounded-lg p-2 bg-gray-50">
              <h2 className="text-sm font-semibold text-gray-700 mb-2">
                Patient
              </h2>
              {!patient && templateId ? (
                <>
                  <input
                    type="text"
                    placeholder="Search patient..."
                    value={patientSearchQuery}
                    onChange={(e) => {
                      setPatientSearchQuery(e.target.value);
                      fetchPatients(e.target.value);
                    }}
                    className="w-full p-1 border border-gray-300 rounded-lg mb-1 text-sm"
                  />
                  <div className="max-h-32 overflow-y-auto">
                    {availablePatients.map((pat) => (
                      <div
                        key={pat.patientId._id}
                        className="p-1 hover:bg-blue-100 cursor-pointer rounded text-sm"
                        onClick={() => {
                          setPatient(pat.patientId);
                          setPatientId(pat.patientId._id);
                          setBookingNotes(pat.notes);
                          if (pat.patientId.vitals) {
                            setVitals(pat.patientId.vitals);
                          }
                        }}
                      >
                        <span className="font-medium">
                          {pat.patientId.name}
                        </span>
                        <span className="ml-1 text-xs text-gray-500">
                          {pat.patientId.email}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : patient ? (
                <div className="space-y-1">
                  <p className="text-gray-800 text-sm">
                    <span className="font-medium">Name:</span> {patient.name}
                  </p>
                  <p className="text-gray-800 text-sm">
                    <span className="font-medium">ID:</span> {patient._id}
                  </p>
                  {patient.age && (
                    <p className="text-gray-800 text-sm">
                      <span className="font-medium">Age:</span> {patient.age}
                    </p>
                  )}
                  {patient.gender && (
                    <p className="text-gray-800 text-sm">
                      <span className="font-medium">Gender:</span>{" "}
                      {patient.gender}
                    </p>
                  )}
                  {patient.contact && (
                    <p className="text-gray-800 text-sm">
                      <span className="font-medium">Contact:</span>{" "}
                      {patient.contact}
                    </p>
                  )}

                  <button
                    onClick={() => {
                      setPatient(null);
                      setBookingNotes("");
                      setPatientId(null);
                      setVitals({
                        spo2: "",
                        bp: "",
                        pulse: "",
                        temp: "",
                        unit: "F",
                        weight: "",
                      });
                    }}
                    className="mt-2 px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                  >
                    Remove Patient
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  Loading patient details...
                </p>
              )}
            </div>
          </div>

          {/* Vitals */}
          <div className="p-2 md:p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Vitals</h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 mb-2">
              <div>
                <label
                  htmlFor="spo2"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  SpO2 (%)
                </label>
                <input
                  type="text"
                  id="spo2"
                  value={vitals?.spo2}
                  onChange={(e) =>
                    setVitals({ ...vitals, spo2: e.target.value })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. 98%"
                />
              </div>
              <div>
                <label
                  htmlFor="bp"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  BP (mmHg)
                </label>
                <input
                  type="text"
                  id="bp"
                  value={vitals.bp}
                  onChange={(e) => setVitals({ ...vitals, bp: e.target.value })}
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. 120/80"
                />
              </div>
              <div>
                <label
                  htmlFor="pulse"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Pulse (bpm)
                </label>
                <input
                  type="text"
                  id="pulse"
                  value={vitals.pulse}
                  onChange={(e) =>
                    setVitals({ ...vitals, pulse: e.target.value })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. 72"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Temperature
                </label>
                <div className="relative flex items-center">
                  <input
                    id="temp"
                    className="w-full px-2 py-1 pr-12 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    value={vitals.temp ? vitals.temp.replace(/[°CF]/g, "") : ""}
                    onChange={(e) =>
                      setVitals({
                        ...vitals,
                        temp: e.target.value
                          ? `${e.target.value}${vitals.unit || "F"}`
                          : "",
                      })
                    }
                    placeholder="e.g. 37.5"
                  />
                  <select
                    value={vitals.unit || "F"}
                    onChange={(e) =>
                      setVitals({
                        ...vitals,
                        unit: e.target.value,
                        temp: vitals.temp
                          ? `${vitals.temp.replace(/[°CF]/g, "")}${e.target.value
                          }`
                          : "",
                      })
                    }
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-6 px-1 border-l border-gray-300 bg-gray-50 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs"
                  >
                    <option value="C">°C</option>
                    <option value="F">°F</option>
                  </select>
                </div>
              </div>
              <div>
                <label
                  htmlFor="weight"
                  className="block text-xs font-medium text-gray-700 mb-1"
                >
                  Weight (kg)
                </label>
                <input
                  type="text"
                  id="weight"
                  value={vitals.weight}
                  onChange={(e) =>
                    setVitals({ ...vitals, weight: e.target.value })
                  }
                  className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  placeholder="e.g. 70kg"
                />
              </div>
            </div>
          </div>

          {/* Diagnosis and Notes */}
          <div className="p-2 md:p-4 border-t">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                {/* Diagnosis Input */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-1">
                    <label
                      htmlFor="diagnosis"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Diagnosis
                    </label>
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal("diagnosis")}
                      className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                    >
                      <Plus size={12} className="mr-1" />
                      Add New
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      id="diagnosis"
                      autoComplete="off"
                      value={diagnosisSearchTerm}
                      onChange={(e) => {
                        setDiagnosisSearchTerm(e.target.value);
                        setSelectedDiagnosis({
                          ...selectedDiagnosis,
                          name: e.target.value,
                        });
                        setShowDiagnosisDropdown(true);
                        setHighlightedDiagnosisIndex(-1);
                      }}
                      onFocus={() => {
                        setShowDiagnosisDropdown(true);
                        setHighlightedDiagnosisIndex(-1);
                      }}
                      onBlur={() =>
                        setTimeout(() => setShowDiagnosisDropdown(false), 200)
                      }
                      onKeyDown={(e) =>
                        handleKeyDown(
                          e,
                          filteredDiagnoses,
                          highlightedDiagnosisIndex,
                          setHighlightedDiagnosisIndex,
                          (diagnosis) => {
                            setSelectedDiagnosis({
                              ...selectedDiagnosis,
                              name: diagnosis.name,
                            });
                            setDiagnosisSearchTerm(diagnosis.name);
                            setShowDiagnosisDropdown(false);
                          },
                          () => setShowDiagnosisDropdown(false)
                        )
                      }
                      className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Search diagnosis"
                    />
                    <Search
                      size={14}
                      className="absolute left-2 top-2 text-gray-400"
                    />
                    <div className="absolute right-1 top-1.5 flex space-x-1">
                      <button
                        type="button"
                        className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                        onClick={() => {
                          const selectedDiag = diagnoses.find(
                            (d) => d.name === selectedDiagnosis.name
                          );
                          if (selectedDiag) {
                            handleEditItem(selectedDiag, "diagnosis");
                          }
                        }}
                      >
                        <Pencil size={10} />
                      </button>
                    </div>
                    {showDiagnosisDropdown && filteredDiagnoses.length > 0 && (
                      <div
                        ref={diagnosisDropdownRef}
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                      >
                        {filteredDiagnoses.map((diagnosis, index) => (
                          <div
                            key={diagnosis._id}
                            onClick={() => {
                              setSelectedDiagnosis({
                                ...selectedDiagnosis,
                                name: diagnosis.name,
                              });
                              setDiagnosisSearchTerm(diagnosis.name);
                              setShowDiagnosisDropdown(false);
                            }}
                            className={`px-3 py-1 cursor-pointer text-sm ${index === highlightedDiagnosisIndex
                              ? "bg-blue-100 text-blue-900"
                              : "hover:bg-gray-100"
                              }`}
                            onMouseEnter={() =>
                              setHighlightedDiagnosisIndex(index)
                            }
                          >
                            <div className="font-medium">{diagnosis.name}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Booking Note Input - Moved to Left Column */}
                <div>
                  <label
                    htmlFor="bookingNote"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Booking Note
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="bookingNote"
                      autoComplete="off"
                      value={bookingNotes || ""}
                      onChange={(e) => setBookingNotes(e.target.value)} // Note: Consider using setSelectedDiagnosis if bookingNote should be stored there
                      placeholder="Enter Booking Note"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
              <div>
                {/* Additional Notes Input */}
                <div className="mb-2">
                  <label
                    htmlFor="symptom"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Additional Notes
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedDiagnosis.notes || ""}
                      onChange={(e) =>
                        setSelectedDiagnosis({
                          ...selectedDiagnosis,
                          notes: e.target.value,
                        })
                      }
                      placeholder="Enter Additional Notes"
                      className="w-full px-2 py-1 border border-gray-300 rounded-md text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Medicines */}
          <div className="p-2 md:p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Medicines
            </h2>
            <div className="mb-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={newMedicine.isTapering}
                  onChange={(e) =>
                    setNewMedicine({
                      ...newMedicine,
                      isTapering: e.target.checked,
                    })
                  }
                  className="h-3 w-3 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-1 text-xs text-gray-700">Is Tapering</span>
              </label>
            </div>

            {/* First Div: Medicine, Dosage, Frequency */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
              {/* Medicine Search */}
              {/* Medicine Search - Updated with keyboard navigation */}
              <div className="relative">
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="medicine"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Medicine
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal("medicine")}
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <Plus size={12} className="mr-1" />
                    Add New
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="medicine"
                    autoComplete="off"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setShowMedicineDropdown(true);
                      setHighlightedMedicineIndex(-1); // Reset highlighted index
                    }}
                    onFocus={() => {
                      setShowMedicineDropdown(true);
                      setHighlightedMedicineIndex(-1);
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowMedicineDropdown(false), 200)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        e,
                        searchResults,
                        highlightedMedicineIndex,
                        setHighlightedMedicineIndex,
                        handleMedicineSelect,
                        () => setShowMedicineDropdown(false)
                      )
                    }
                    className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search medicine"
                  />
                  <Search
                    size={14}
                    className="absolute left-2 top-2 text-gray-400"
                  />
                  <div className="absolute right-1 top-1.5 flex space-x-1">
                    <button
                      type="button"
                      className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                      onClick={() => {
                        const selectedMedicine = searchResults.find(
                          (m) => m.name === searchTerm
                        );
                        if (selectedMedicine) {
                          handleEditItem(selectedMedicine, "medicine");
                        }
                      }}
                    >
                      <Pencil size={10} />
                    </button>
                  </div>
                  {showMedicineDropdown && searchResults.length > 0 && (
                    <div
                      ref={medicineDropdownRef}
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                    >
                      {searchResults.map((medicine, index) => (
                        <div
                          key={medicine._id}
                          onClick={() => handleMedicineSelect(medicine)}
                          className={`px-3 py-1 cursor-pointer text-sm ${index === highlightedMedicineIndex
                            ? "bg-blue-100 text-blue-900"
                            : "hover:bg-gray-100"
                            }`}
                          onMouseEnter={() =>
                            setHighlightedMedicineIndex(index)
                          }
                        >
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-xs text-gray-500">
                            {medicine.dosageForm} | {medicine.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dosage Search */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="dosage"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Dosage
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal("dosage")}
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <Plus size={12} className="mr-1" />
                    Add New
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="dosage"
                    autoComplete="off"
                    value={dosageSearchTerm}
                    onChange={(e) => {
                      setDosageSearchTerm(e.target.value);
                      setNewMedicine({
                        ...newMedicine,
                        dosageAmount: e.target.value,
                      });
                      setShowDosageDropdown(true);
                      setHighlightedDosageIndex(-1); // Add this
                    }}
                    onFocus={() => {
                      setShowDosageDropdown(true);
                      setHighlightedDosageIndex(-1); // Add this
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowDosageDropdown(false), 200)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        // Add this
                        e,
                        filteredDosages,
                        highlightedDosageIndex,
                        setHighlightedDosageIndex,
                        (dosage) => {
                          setNewMedicine({
                            ...newMedicine,
                            dosageAmount: dosage.name,
                          });
                          setDosageSearchTerm(dosage.name);
                          setShowDosageDropdown(false);
                        },
                        () => setShowDosageDropdown(false)
                      )
                    }
                    className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search dosage"
                  />

                  <Search
                    size={14}
                    className="absolute left-2 top-2 text-gray-400"
                  />
                  <div className="absolute right-1 top-1.5 flex space-x-1">
                    <button
                      type="button"
                      className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                      onClick={() => {
                        const selectedDosage = dosages.find(
                          (d) => d.name === newMedicine.dosageAmount
                        );
                        if (selectedDosage) {
                          handleEditItem(selectedDosage, "dosage");
                        }
                      }}
                    >
                      <Pencil size={10} />
                    </button>
                  </div>
                  {showDosageDropdown && filteredDosages.length > 0 && (
                    <div
                      ref={dosageDropdownRef} // Add this
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                    >
                      {filteredDosages.map(
                        (
                          dosage,
                          index // Add index
                        ) => (
                          <div
                            key={dosage._id}
                            onClick={() => {
                              setNewMedicine({
                                ...newMedicine,
                                dosageAmount: dosage.name,
                              });
                              setDosageSearchTerm(dosage.name);
                              setShowDosageDropdown(false);
                            }}
                            className={`px-3 py-1 cursor-pointer text-sm ${
                              // Update this
                              index === highlightedDosageIndex
                                ? "bg-blue-100 text-blue-900"
                                : "hover:bg-gray-100"
                              }`}
                            onMouseEnter={() =>
                              setHighlightedDosageIndex(index)
                            } // Add this
                          >
                            <div className="font-medium">{dosage.name}</div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Frequency Search */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="frequency"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Frequency
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal("frequency")}
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <Plus size={12} className="mr-1" />
                    Add New
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="frequency"
                    autoComplete="off"
                    value={frequencySearchTerm}
                    onChange={(e) => {
                      setFrequencySearchTerm(e.target.value);
                      setShowFrequencyDropdown(true);
                      setHighlightedFrequencyIndex(-1); // Add this
                    }}
                    onFocus={() => {
                      setShowFrequencyDropdown(true);
                      setHighlightedFrequencyIndex(-1); // Add this
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowFrequencyDropdown(false), 200)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        // Add this
                        e,
                        filteredFrequencies,
                        highlightedFrequencyIndex,
                        setHighlightedFrequencyIndex,
                        (frequency) => {
                          setNewMedicine({
                            ...newMedicine,
                            dosage: frequency.name,
                          });
                          setFrequencySearchTerm(frequency.name);
                          setShowFrequencyDropdown(false);
                        },
                        () => setShowFrequencyDropdown(false)
                      )
                    }
                    className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search frequency"
                  />
                  <Search
                    size={14}
                    className="absolute left-2 top-2 text-gray-400"
                  />
                  <div className="absolute right-1 top-1.5 flex space-x-1">
                    <button
                      type="button"
                      className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                      onClick={() => {
                        const selectedFreq = frequencies.find(
                          (f) => f.name === newMedicine.dosage
                        );
                        if (selectedFreq) {
                          handleEditItem(selectedFreq, "frequency");
                        }
                      }}
                    >
                      <Pencil size={10} />
                    </button>
                  </div>
                  {showFrequencyDropdown && filteredFrequencies.length > 0 && (
                    <div
                      ref={frequencyDropdownRef} // Add this
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                    >
                      {filteredFrequencies.map(
                        (
                          frequency,
                          index // Add index
                        ) => (
                          <div
                            key={frequency._id}
                            onClick={() => {
                              setNewMedicine({
                                ...newMedicine,
                                dosage: frequency.name,
                              });
                              setFrequencySearchTerm(frequency.name);
                              setShowFrequencyDropdown(false);
                            }}
                            className={`px-3 py-1 cursor-pointer text-sm ${
                              // Update this
                              index === highlightedFrequencyIndex
                                ? "bg-blue-100 text-blue-900"
                                : "hover:bg-gray-100"
                              }`}
                            onMouseEnter={() =>
                              setHighlightedFrequencyIndex(index)
                            } // Add this
                          >
                            <div className="font-medium">{frequency.name}</div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Second Div: Duration, Instructions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
              {/* Duration Search */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="duration"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Duration
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal("days")}
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <Plus size={12} className="mr-1" />
                    Add New
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="duration"
                    autoComplete="off"
                    value={durationSearchTerm}
                    onChange={(e) => {
                      setDurationSearchTerm(e.target.value);
                      setShowDurationDropdown(true);
                      setHighlightedDurationIndex(-1); // Add this
                    }}
                    onFocus={() => {
                      setShowDurationDropdown(true);
                      setHighlightedDurationIndex(-1); // Add this
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowDurationDropdown(false), 200)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        // Add this
                        e,
                        filteredDays,
                        highlightedDurationIndex,
                        setHighlightedDurationIndex,
                        (day) => {
                          setNewMedicine({
                            ...newMedicine,
                            duration: day.name,
                          });
                          setDurationSearchTerm(day.name);
                          setShowDurationDropdown(false);
                        },
                        () => setShowDurationDropdown(false)
                      )
                    }
                    className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search duration"
                  />
                  <Search
                    size={14}
                    className="absolute left-2 top-2 text-gray-400"
                  />
                  <div className="absolute right-1 top-1.5 flex space-x-1">
                    <button
                      type="button"
                      className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                      onClick={() => {
                        const selectedDay = days.find(
                          (d) => d.name === newMedicine.duration
                        );
                        if (selectedDay) {
                          handleEditItem(selectedDay, "days");
                        }
                      }}
                    >
                      <Pencil size={10} />
                    </button>
                  </div>
                  {showDurationDropdown && filteredDays.length > 0 && (
                    <div
                      ref={durationDropdownRef} // Add this
                      className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                    >
                      {filteredDays.map(
                        (
                          day,
                          index // Add index parameter
                        ) => (
                          <div
                            key={day._id}
                            onClick={() => {
                              setNewMedicine({
                                ...newMedicine,
                                duration: day.name,
                              });
                              setDurationSearchTerm(day.name);
                              setShowDurationDropdown(false);
                            }}
                            className={`px-3 py-1 cursor-pointer text-sm ${
                              // Update className with highlight logic
                              index === highlightedDurationIndex
                                ? "bg-blue-100 text-blue-900"
                                : "hover:bg-gray-100"
                              }`}
                            onMouseEnter={() =>
                              setHighlightedDurationIndex(index)
                            } // Add this
                          >
                            <div className="font-medium">{day.name}</div>
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions Search */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label
                    htmlFor="instructions"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Instructions
                  </label>
                  <button
                    type="button"
                    onClick={() => handleOpenAddModal("instruction")}
                    className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                  >
                    <Plus size={12} className="mr-1" />
                    Add New
                  </button>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    id="instructions"
                    autoComplete="off"
                    value={instructionsSearchTerm}
                    onChange={(e) => {
                      setInstructionsSearchTerm(e.target.value);
                      setShowInstructionsDropdown(true);
                      setHighlightedInstructionsIndex(-1); // Add this
                    }}
                    onFocus={() => {
                      setShowInstructionsDropdown(true);
                      setHighlightedInstructionsIndex(-1); // Add this
                    }}
                    onBlur={() =>
                      setTimeout(() => setShowInstructionsDropdown(false), 200)
                    }
                    onKeyDown={(e) =>
                      handleKeyDown(
                        // Add this
                        e,
                        filteredInstructions,
                        highlightedInstructionsIndex,
                        setHighlightedInstructionsIndex,
                        (instruction) => {
                          setNewMedicine({
                            ...newMedicine,
                            instructions: instruction.name,
                          });
                          setInstructionsSearchTerm(instruction.name);
                          setShowInstructionsDropdown(false);
                        },
                        () => setShowInstructionsDropdown(false)
                      )
                    }
                    className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Search instructions"
                  />
                  <Search
                    size={14}
                    className="absolute left-2 top-2 text-gray-400"
                  />
                  <div className="absolute right-1 top-1.5 flex space-x-1">
                    <button
                      type="button"
                      className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                      onClick={() => {
                        const selectedInst = instructions.find(
                          (i) => i.name === newMedicine.instructions
                        );
                        if (selectedInst) {
                          handleEditItem(selectedInst, "instruction");
                        }
                      }}
                    >
                      <Pencil size={10} />
                    </button>
                  </div>
                  {showInstructionsDropdown &&
                    filteredInstructions.length > 0 && (
                      <div
                        ref={instructionsDropdownRef} // Add this
                        className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                      >
                        {filteredInstructions.map(
                          (
                            instruction,
                            index // Add index parameter
                          ) => (
                            <div
                              key={instruction._id}
                              onClick={() => {
                                setNewMedicine({
                                  ...newMedicine,
                                  instructions: instruction.name,
                                });
                                setInstructionsSearchTerm(instruction.name);
                                setShowInstructionsDropdown(false);
                              }}
                              className={`px-3 py-1 cursor-pointer text-sm ${
                                // Update className with highlight logic
                                index === highlightedInstructionsIndex
                                  ? "bg-blue-100 text-blue-900"
                                  : "hover:bg-gray-100"
                                }`}
                              onMouseEnter={() =>
                                setHighlightedInstructionsIndex(index)
                              } // Add this
                            >
                              <div className="font-medium">
                                {instruction.name}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                </div>
              </div>
            </div>

            {/* Tapering Schedule Section */}
            {newMedicine.isTapering && (
              <div className="mt-2">
                <h3 className="text-xs font-medium text-gray-700 mb-1">
                  Tapering Schedule
                </h3>
                {newMedicine.tapering.map((schedule, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2"
                  >
                    {/* Tapering Frequency Search */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={`tapering-frequency-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Frequency
                        </label>
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal("frequency")}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          <Plus size={12} className="mr-1" />
                          Add New
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          id={`tapering-frequency-${index}`}
                          autoComplete="off"
                          value={taperingFrequencySearchTerms[index] || ""}
                          onChange={(e) => {
                            const newTerms = [...taperingFrequencySearchTerms];
                            newTerms[index] = e.target.value;
                            setTaperingFrequencySearchTerms(newTerms);
                            setShowTaperingFrequencyDropdowns((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setHighlightedTaperingFrequencyIndices((prev) => ({
                              ...prev,
                              [index]: -1,
                            })); // Add this
                          }}
                          onFocus={() => {
                            setShowTaperingFrequencyDropdowns((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setHighlightedTaperingFrequencyIndices((prev) => ({
                              ...prev,
                              [index]: -1,
                            })); // Add this
                          }}
                          onBlur={() =>
                            setTimeout(
                              () =>
                                setShowTaperingFrequencyDropdowns((prev) => ({
                                  ...prev,
                                  [index]: false,
                                })),
                              200
                            )
                          }
                          onKeyDown={(e) =>
                            handleTaperingKeyDown(
                              // Add this
                              e,
                              getTaperingFilteredFrequencies(index),
                              index,
                              highlightedTaperingFrequencyIndices,
                              setHighlightedTaperingFrequencyIndices,
                              (frequency) => {
                                handleUpdateTaperingSchedule(
                                  index,
                                  "dosage",
                                  frequency.name
                                );
                                const newTerms = [
                                  ...taperingFrequencySearchTerms,
                                ];
                                newTerms[index] = frequency.name;
                                setTaperingFrequencySearchTerms(newTerms);
                                setShowTaperingFrequencyDropdowns((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }));
                              },
                              () =>
                                setShowTaperingFrequencyDropdowns((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }))
                            )
                          }
                          className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Search frequency"
                        />
                        <Search
                          size={14}
                          className="absolute left-2 top-2 text-gray-400"
                        />
                        <div className="absolute right-1 top-1.5 flex space-x-1">
                          <button
                            type="button"
                            className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                            onClick={() => {
                              const selectedFreq = frequencies.find(
                                (f) => f.name === schedule.dosage
                              );
                              if (selectedFreq) {
                                handleEditItem(selectedFreq, "frequency");
                              }
                            }}
                          >
                            <Pencil size={10} />
                          </button>
                        </div>
                        {showTaperingFrequencyDropdowns[index] &&
                          getTaperingFilteredFrequencies(index).length > 0 && (
                            <div
                              ref={(el) =>
                              (taperingFrequencyDropdownRefs.current[index] =
                                el)
                              } // Add this
                              className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                            >
                              {getTaperingFilteredFrequencies(index).map(
                                (
                                  frequency,
                                  freqIndex // Add freqIndex
                                ) => (
                                  <div
                                    key={frequency._id}
                                    onClick={() => {
                                      handleUpdateTaperingSchedule(
                                        index,
                                        "dosage",
                                        frequency.name
                                      );
                                      const newTerms = [
                                        ...taperingFrequencySearchTerms,
                                      ];
                                      newTerms[index] = frequency.name;
                                      setTaperingFrequencySearchTerms(newTerms);
                                      setShowTaperingFrequencyDropdowns(
                                        (prev) => ({ ...prev, [index]: false })
                                      );
                                    }}
                                    className={`px-3 py-1 cursor-pointer text-sm ${
                                      // Update className with highlight logic
                                      freqIndex ===
                                        (highlightedTaperingFrequencyIndices[
                                          index
                                        ] || -1)
                                        ? "bg-blue-100 text-blue-900"
                                        : "hover:bg-gray-100"
                                      }`}
                                    onMouseEnter={() =>
                                      setHighlightedTaperingFrequencyIndices(
                                        (prev) => ({
                                          ...prev,
                                          [index]: freqIndex,
                                        })
                                      )
                                    } // Add this
                                  >
                                    <div className="font-medium">
                                      {frequency.name}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Tapering Days Search */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label
                          htmlFor={`tapering-days-${index}`}
                          className="block text-xs font-medium text-gray-700"
                        >
                          Days
                        </label>
                        <button
                          type="button"
                          onClick={() => handleOpenAddModal("days")}
                          className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                        >
                          <Plus size={12} className="mr-1" />
                          Add New
                        </button>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          id={`tapering-days-${index}`}
                          autoComplete="off"
                          value={taperingDaysSearchTerms[index] || ""}
                          onChange={(e) => {
                            const newTerms = [...taperingDaysSearchTerms];
                            newTerms[index] = e.target.value;
                            setTaperingDaysSearchTerms(newTerms);
                            setShowTaperingDaysDropdowns((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setHighlightedTaperingDaysIndices((prev) => ({
                              ...prev,
                              [index]: -1,
                            })); // Add this
                          }}
                          onFocus={() => {
                            setShowTaperingDaysDropdowns((prev) => ({
                              ...prev,
                              [index]: true,
                            }));
                            setHighlightedTaperingDaysIndices((prev) => ({
                              ...prev,
                              [index]: -1,
                            })); // Add this
                          }}
                          onBlur={() =>
                            setTimeout(
                              () =>
                                setShowTaperingDaysDropdowns((prev) => ({
                                  ...prev,
                                  [index]: false,
                                })),
                              200
                            )
                          }
                          onKeyDown={(e) =>
                            handleTaperingKeyDown(
                              // Add this
                              e,
                              getTaperingFilteredDays(index),
                              index,
                              highlightedTaperingDaysIndices,
                              setHighlightedTaperingDaysIndices,
                              (day) => {
                                handleUpdateTaperingSchedule(
                                  index,
                                  "days",
                                  day.name
                                );
                                const newTerms = [...taperingDaysSearchTerms];
                                newTerms[index] = day.name;
                                setTaperingDaysSearchTerms(newTerms);
                                setShowTaperingDaysDropdowns((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }));
                              },
                              () =>
                                setShowTaperingDaysDropdowns((prev) => ({
                                  ...prev,
                                  [index]: false,
                                }))
                            )
                          }
                          className="w-full pl-8 pr-8 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          placeholder="Search days"
                        />
                        <Search
                          size={14}
                          className="absolute left-2 top-2 text-gray-400"
                        />
                        <div className="absolute right-1 top-1.5 flex space-x-1">
                          <button
                            type="button"
                            className="text-xs px-1 py-1 bg-blue-200 rounded hover:bg-blue-300"
                            onClick={() => {
                              const selectedDay = days.find(
                                (d) => d.name === schedule.days
                              );
                              if (selectedDay) {
                                handleEditItem(selectedDay, "days");
                              }
                            }}
                          >
                            <Pencil size={10} />
                          </button>
                        </div>
                        {showTaperingDaysDropdowns[index] &&
                          getTaperingFilteredDays(index).length > 0 && (
                            <div
                              ref={(el) =>
                                (taperingDaysDropdownRefs.current[index] = el)
                              } // Add this
                              className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md max-h-40 overflow-auto"
                            >
                              {getTaperingFilteredDays(index).map(
                                (
                                  day,
                                  dayIndex // Add dayIndex
                                ) => (
                                  <div
                                    key={day._id}
                                    onClick={() => {
                                      handleUpdateTaperingSchedule(
                                        index,
                                        "days",
                                        day.name
                                      );
                                      const newTerms = [
                                        ...taperingDaysSearchTerms,
                                      ];
                                      newTerms[index] = day.name;
                                      setTaperingDaysSearchTerms(newTerms);
                                      setShowTaperingDaysDropdowns((prev) => ({
                                        ...prev,
                                        [index]: false,
                                      }));
                                    }}
                                    className={`px-3 py-1 cursor-pointer text-sm ${
                                      // Update className with highlight logic
                                      dayIndex ===
                                        (highlightedTaperingDaysIndices[index] ||
                                          -1)
                                        ? "bg-blue-100 text-blue-900"
                                        : "hover:bg-gray-100"
                                      }`}
                                    onMouseEnter={() =>
                                      setHighlightedTaperingDaysIndices(
                                        (prev) => ({
                                          ...prev,
                                          [index]: dayIndex,
                                        })
                                      )
                                    } // Add this
                                  >
                                    <div className="font-medium">
                                      {day.name}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                      </div>
                    </div>

                    {/* Remove button */}
                    <div className="flex items-end">
                      <button
                        onClick={() => handleRemoveTaperingSchedule(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={handleAddTaperingSchedule}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center mb-2 text-sm"
                >
                  <Plus size={14} className="mr-1" />
                  Add Tapering Schedule
                </button>
              </div>
            )}

            {/* Save/Add Medicine Button */}
            <div className="flex items-end">
              <button
                onClick={handleSaveMedicine}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center justify-center text-sm"
              >
                {editMedicineIndex !== null ? (
                  <>
                    <Pencil size={14} className="mr-1" />
                    Save Medicine
                  </>
                ) : (
                  <>
                    <Plus size={14} className="mr-1" />
                    Add Medicine
                  </>
                )}
              </button>
            </div>

            {/* Medicines Table */}
            <div className="overflow-x-auto mt-4">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medicine
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dosage
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Frequency
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Instructions
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tapering
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {medicines.length === 0 ? (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-3 py-2 text-center text-gray-500 text-sm"
                      >
                        No medicines added yet
                      </td>
                    </tr>
                  ) : (
                    medicines.map((medicine, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <div className="text-xs font-medium text-gray-900">
                            {medicine.medicine.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {medicine.medicine.dosageForm}
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {medicine.dosageAmount || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {medicine.dosage || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {medicine.duration || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {medicine.instructions || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {medicine.isTapering && medicine.tapering?.length > 0
                            ? medicine.tapering
                              .map(
                                (schedule) =>
                                  `${schedule.dosage} for ${schedule.days}`
                              )
                              .join(", ")
                            : "No"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium space-x-1">
                          <button
                            onClick={() => handleEditMedicine(index)}
                            className="text-yellow-600 hover:text-yellow-800 mr-1"
                            title="Edit Medicine"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveMedicine(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Reports */}
          <div className="p-2 md:p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Lab Reports
            </h2>
            <div className="mb-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                <div>
                  <label
                    htmlFor="reportName"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Report Name
                  </label>
                  <input
                    type="text"
                    id="reportName"
                    value={newLabReport.name}
                    onChange={(e) =>
                      setNewLabReport({ ...newLabReport, name: e.target.value })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. Blood Test"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reportValue"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Value
                  </label>
                  <input
                    type="text"
                    id="reportValue"
                    value={newLabReport.values}
                    onChange={(e) =>
                      setNewLabReport({
                        ...newLabReport,
                        values: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="e.g. 220 mg/dL"
                  />
                </div>
                <div>
                  <label
                    htmlFor="reportDate"
                    className="block text-xs font-medium text-gray-700 mb-1"
                  >
                    Report Date
                  </label>
                  <input
                    type="date"
                    id="reportDate"
                    value={newLabReport.reportDate}
                    onChange={(e) =>
                      setNewLabReport({
                        ...newLabReport,
                        reportDate: e.target.value,
                      })
                    }
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Report File (Image or PDF)
                  </label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={(e) => setNewLabReportFile(e.target.files[0])}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  {newLabReportFile && (
                    <div className="mt-1 text-xs text-gray-500">
                      Selected: {newLabReportFile.name}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleAddLabReport}
                  disabled={labReportLoading}
                  className={`w-full px-3 py-1 rounded-md flex items-center justify-center text-sm ${labReportLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                    } text-white`}
                >
                  {labReportLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                      Loading...
                    </>
                  ) : (
                    <>
                      <Plus size={14} className="mr-1" />
                      Add Lab Report
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Name
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report Date
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report File
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {labReports.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-3 py-2 text-center text-gray-500 text-sm"
                      >
                        No lab reports added yet
                      </td>
                    </tr>
                  ) : (
                    labReports.map((report, index) => (
                      <tr key={index}>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {report.name || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {report.values || "-"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap text-xs text-gray-500">
                          {report.reportDate
                            ? new Date(report.reportDate).toLocaleDateString()
                            : "-"}
                        </td>
                        <td>
                          {report.reportImageUrl && (
                            <a
                              href={report.reportImageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline ml-1 text-xs"
                            >
                              {report.reportImageUrl
                                .toLowerCase()
                                .includes(".pdf")
                                ? "View PDF"
                                : "View File"}
                            </a>
                          )}
                        </td>

                        <td className="px-3 py-2 whitespace-nowrap text-right text-xs font-medium space-x-1">
                          <button
                            onClick={() => handleEditLabReport(index)}
                            className="text-blue-600 hover:text-blue-800 mr-1"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleRemoveLabReport(index)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Lab Test Advised */}
          <div className="p-2 md:p-4 border-t">
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              Investigation On Next Visit
            </h2>

            {(() => {
              // Normalize labTest to always be array of {name, price}
              const normalizedTests = Array.isArray(labTest)
                ? labTest.map(item => {
                  if (typeof item === "string") {
                    return { name: item, price: "" };
                  }
                  return { name: item.name || "", price: item.price || "" };
                })
                : [];

              return (
                <>
                  {normalizedTests.map((test, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <input
                        type="text"
                        value={test.name}
                        onChange={(e) => {
                          const updated = [...labTest];
                          if (typeof updated[index] === "string") {
                            updated[index] = { name: e.target.value, price: "" };
                          } else {
                            updated[index] = { ...updated[index], name: e.target.value };
                          }
                          setLabTest(updated);
                        }}
                        placeholder={`Test ${index + 1} Name`}
                        className="flex-1 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />

                      <input
                        type="text"
                        value={test.price}
                        onChange={(e) => {
                          const updated = [...labTest];
                          if (typeof updated[index] === "string") {
                            updated[index] = { name: updated[index], price: e.target.value };
                          } else {
                            updated[index] = { ...updated[index], price: e.target.value };
                          }
                          setLabTest(updated);
                        }}
                        placeholder="Price (optional)"
                        className="w-64 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      />

                      <button
                        onClick={() => {
                          const updated = [...labTest];
                          updated.splice(index, 1);
                          setLabTest(updated);
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => setLabTest([...labTest, { name: "", price: "" }])}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                  >
                    <Plus size={14} className="mr-1" />
                    Add Test
                  </button>
                </>
              );
            })()}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-2 py-2 sm:px-4 border-t flex justify-end">
            <div className="flex space-x-1 mt-2 mr-1 md:mt-0">
              <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={prescriptionId ? handleUpdate : handleSave}
                disabled={templateId && (!doctor || !patient)}
              >
                <FileText size={14} className="mr-1" />
                {prescriptionId ? "Update" : "Save"}
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={handleSend}
                disabled={
                  !prescriptionId &&
                  !localStorage.getItem("currentPrescriptionId")
                }
              >
                <Send size={14} className="mr-1" />
                Send
              </button>
              <button
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={handleSaveAsTemplate}
              >
                <Plus size={14} className="mr-1" />
                Save as Template
              </button>
              {/* <button
                className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-1 rounded-md flex items-center text-sm"
                onClick={() => setShowPDFModal(true)}
              >
                <Download size={14} className="mr-1" />
                PDF
              </button> */}
            </div>
            <button
              onClick={() => setShowPDFModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-md font-medium flex items-center text-sm"
            >
              <FileText size={14} className="mr-1" />
              See Preview
            </button>
          </div>
        </div>
      </div>

      {/* PDF Modal */}
      {showPDFModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-4xl">
            <div className="flex flex-wrap justify-between items-center gap-1 mb-2">
              <h2 className="text-sm font-semibold text-gray-800">
                Prescription PDF Preview
              </h2>
              <div className="flex gap-1">
                <PDFDownloadLink
                  document={
                    <PrescriptionPDF
                      doctor={doctor}
                      patient={patient}
                      diagnosis={selectedDiagnosis.name || diagnosis}
                      notes={selectedDiagnosis.notes || notes}
                      medicines={medicines}
                      labReports={labReports}
                      labTest={labTest}
                      vitals={vitals}
                      bookingNotes={bookingNotes}
                    />
                  }
                  fileName={`${patient?.name || "patient"}-prescription.pdf`}
                >
                  {({ loading }) =>
                    loading ? (
                      "Loading document..."
                    ) : (
                      <button className="flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition text-sm">
                        <Download size={14} className="mr-1" />
                        Download PDF
                      </button>
                    )
                  }
                </PDFDownloadLink>
                <button
                  onClick={() => {
                    if (urlParams.get("isOld") == 'true') {
                      setDiagnosis("");
                      setBookingNotes("");
                      setLabTest([""]);
                      setLabReports([]);
                      setMedicines([]);
                    }
                    urlParams.set("isOld", "false");
                    window.history.replaceState(
                      {},
                      "",
                      `${window.location.pathname}?${urlParams.toString()}`
                    );
                    setShowPDFModal(false);
                  }}
                  className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md transition text-sm"
                >
                  Close
                </button>
              </div>
            </div>
            <div className="h-[500px] overflow-auto">
              <PDFViewer width="100%" height="100%">
                <PrescriptionPDF
                  doctor={doctor}
                  patient={patient}
                  diagnosis={selectedDiagnosis.name || diagnosis}
                  notes={selectedDiagnosis.notes || notes}
                  medicines={medicines}
                  labReports={labReports}
                  labTest={labTest}
                  vitals={vitals}
                  bookingNotes={bookingNotes}
                  date={selectedDate}
                />
              </PDFViewer>
            </div>
          </div>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <TemplateModal
          isOpen={showTemplateModal}
          onClose={() => setShowTemplateModal(false)}
          prescriptionData={{
            medicines,
            diagnosis: selectedDiagnosis.name || diagnosis,
            notes: selectedDiagnosis.notes || notes,
            labReports,
            labTest,
          }}
          onSave={(template) => {
            toast.success("Template saved successfully!");
            setShowTemplateModal(false);
          }}
        />
      )}

      {/* Add Item Modal */}
      {showAddModal && (
        <AddItemModal
          isOpen={showAddModal}
          onClose={handleCloseAddModal}
          type={modalType}
          onItemAdded={handleItemAdded}
          editItem={editItem}
          onItemUpdated={handleItemUpdated}
        />
      )}
    </>
  );
}

export default Prescription;
