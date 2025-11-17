// BookAppoiment.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Calendar,
  Clock,
  User,
  Users,
  FileText,
  Check,
  X,
  Loader,
} from "lucide-react";
import { axiosInstance } from "../../API/axiosInstance";
import html2canvas from "html2canvas";

export default function BookAppoiment() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [bookingNotes, setBookingNotes] = useState("");
  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [showIdCard, setShowIdCard] = useState(false);

  const [newPatient, setNewPatient] = useState({
    name: "", email: "", phone: "", gender: "male", age: "", dob: "",
  });

  const [vitals, setVitals] = useState({
    spo2: "", bp: "", pulse: "", temp: "", weight: "", unit: "F",
  });

  const idCardRef = useRef(null);
  const IMGBB_API_KEY = import.meta.env.VITE_IMGBB_KEY || "YOUR_KEY";

  useEffect(() => { fetchDoctors(); }, []);

  const uploadIdCardToCloudinary = async (
    dataUrl,
    patientId
  ) => {
    const base64 = dataUrl.split(",")[1];
    const blob = await (await fetch(`data:image/png;base64,${base64}`)).blob();
    const form = new FormData();
    form.append("cardFile", blob, `${patientId}_id.png`);

    const { data } = await axiosInstance.post(
      `/api/patient/${patientId}/card`,
      form,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    setSelectedPatient(prev => ({ ...prev, cardUrl: data.data.cardUrl }));
    return data.data.cardUrl;   // <-- Cloudinary URL
  };

  const searchPatients = async () => {
    if (!searchQuery.trim()) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(`/api/patient/search?q=${searchQuery}`);
      setSearchResults(data.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/api/doctor");
      setDoctors(data.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    setLoading(true);
    try {
      const { data } = await axiosInstance.get(
        `/api/booking/slots?doctorId=${selectedDoctor._id}&date=${selectedDate}`
      );
      setAvailableSlots(data.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handlePatientSelect = (patient) => {
    setVitals({
      spo2: patient.vitals?.spo2 || "",
      bp: patient.vitals?.bp || "",
      pulse: patient.vitals?.pulse || "",
      temp: patient.vitals?.temp?.replace(/[°CF]/g, "") || "",
      weight: patient.vitals?.weight || "",
      unit: patient.vitals?.temp?.includes("C") ? "C" : "F",
    });
    setSelectedPatient(patient);
    setShowNewPatientForm(false);
    setShowIdCard(true);
  };

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const addNewPatient = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axiosInstance.post("/api/patient", newPatient);
      setSelectedPatient(data.data);
      setShowNewPatientForm(false);
      setShowIdCard(true);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);
    setStep(3);
  };

  const bookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedSlot) {
      setBookingError("Please complete all required fields");
      return;
    }
    setLoading(true);
    try {
      if (selectedPatient._id) {
        const updated = {
          ...vitals,
          temp: vitals.temp ? `${vitals.temp}${vitals.unit}` : "",
        };
        await axiosInstance.patch(`/api/patient/${selectedPatient._id}/vitals`, { vitals: updated });
      }

      const payload = {
        patientId: selectedPatient._id,
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        status: "booked",
        notes: bookingNotes,
      };
      await axiosInstance.post("/api/booking", payload);
      setBookingSuccess(true);
    } catch (e) {
      console.error(e);
      setBookingError(e.response?.data?.message || "Failed to book.");
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setStep(1); setSelectedPatient(null); setSelectedDoctor(null);
    setSelectedSlot(null); setBookingNotes(""); setSearchQuery("");
    setSearchResults([]); setBookingSuccess(false); setBookingError("");
    setShowNewPatientForm(false); setShowIdCard(false); setSelectedDate("");
    setVitals({ spo2: "", bp: "", pulse: "", temp: "", weight: "", unit: "F" });
  };

  // PNG GENERATION — CLEAN NODE
  const generatePng = async () => {
    const node = idCardRef.current;
    if (!node) return null;

    // Clone + remove Tailwind classes
    const clone = node.cloneNode(true);
    clone.removeAttribute("class");
    clone.style.cssText = node.style.cssText;

    const tempDiv = document.createElement("div");
    tempDiv.style.position = "absolute";
    tempDiv.style.left = "-9999px";
    tempDiv.appendChild(clone);
    document.body.appendChild(tempDiv);

    try {
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false,
      });
      return canvas.toDataURL("image/png");
    } finally {
      document.body.removeChild(tempDiv);
    }
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      const dataUrl = await generatePng();
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${selectedPatient.name.replace(/\s+/g, "_")}_ID.png`;
      a.click();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const uploadToImgbb = async (dataUrl) => {
    const base64 = dataUrl.split(",")[1];
    const form = new FormData();
    form.append("image", base64);
    const res = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
      method: "POST", body: form,
    });
    const json = await res.json();
    return json.data?.url;
  };

  const sendWhatsApp = async () => {
    if (!selectedPatient?.phone) return;
    setLoading(true);
    try {
      // 1. Generate PNG
      const dataUrl = await generatePng();
      if (!dataUrl) throw new Error("Canvas failed");

      // 2. Upload to Cloudinary (only if we don’t already have a URL)
      let cardUrl = selectedPatient.cardUrl;
      if (!cardUrl) {
        cardUrl = await uploadIdCardToCloudinary(dataUrl, selectedPatient._id);
      }

      // 3. Clean phone & build message
      let cleanPhone = selectedPatient.phone.replace(/[^0-9]/g, "");
      if (cleanPhone.length === 10) cleanPhone = "91" + cleanPhone;
      else if (cleanPhone.length === 12 && cleanPhone.startsWith("91")) { /* ok */ }
      else if (cleanPhone.length === 13 && cleanPhone.startsWith("91"))
        cleanPhone = cleanPhone.substring(1);
      else throw new Error("Invalid phone number");

      const msg = `Hello ${selectedPatient.name},\n\nYour *Daya Homeopathy* ID Card:\n\n*ID:* ${selectedPatient.cardId || selectedPatient._id.slice(-8).toUpperCase()
        }\n*Name:* ${selectedPatient.name}\n*Phone:* ${selectedPatient.phone}\n\nView: ${cardUrl}\n\nContact: +918606344694\nThank you!`;

      const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(msg)}`;
      window.open(waUrl, "_blank");
    } catch (e) {
      console.error(e);
      alert("Share failed – try Download.");
    } finally {
      setLoading(false);
    }
  };

  if (bookingSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-xl p-8">
        <div className="text-center py-10">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Check className="text-green-600 w-14 h-14" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Appointment Booked Successfully
          </h2>
          <p className="text-gray-600 mb-8">
            {selectedPatient.name} has been scheduled with Dr. {selectedDoctor.name}
          </p>
          <button
            onClick={resetForm}
            className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
      {/* HEADER — USE HEX COLORS */}
      <div style={{ background: "linear-gradient(to right, #2563eb, #1d4ed8)" }} className="text-white p-6">
        <h1 className="text-2xl font-bold">Appointment Booking</h1>
      </div>

      {/* PROGRESS */}
      <div className="px-6 pt-6">
        <div className="flex items-center mb-4">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${step >= i ? "bg-[#2563eb] text-white" : "bg-gray-200 text-gray-600"}`}>
                {i}
              </div>
              {i < 3 && <div className={`h-1 flex-1 mx-3 ${step > i ? "bg-[#2563eb]" : "bg-gray-200"}`} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
  <div className="p-6">
    {/* MAIN GRID: 2 EQUAL COLUMNS ON DESKTOP */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* LEFT COLUMN: Patient + Doctor + Date */}
      <div className="space-y-8">

        {/* PATIENT SEARCH */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <User className="mr-2 w-5 h-5" style={{ color: "#2563eb" }} />
            Patient
          </h2>

          {!selectedPatient && !showNewPatientForm && (
            <div className="flex gap-3 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Search Patient by Name or Phone"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full border rounded-lg py-2.5 pl-10 pr-4 focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb]"
                />
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              </div>
              <button onClick={searchPatients} disabled={loading}
                className="bg-[#2563eb] text-white px-6 py-2.5 rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 whitespace-nowrap">
                {loading ? "..." : "Search"}
              </button>
            </div>
          )}

          {searchResults.length > 0 && !selectedPatient && (
            <div className="border rounded-lg mb-4 max-h-60 overflow-y-auto">
              <div className="bg-gray-50 px-4 py-2 border-b">
                <h3 className="font-medium">Results</h3>
              </div>
              <ul className="divide-y">
                {searchResults.map(p => (
                  <li key={p._id} onClick={() => handlePatientSelect(p)}
                    className="px-4 py-3 hover:bg-[#ebf4ff] cursor-pointer transition">
                    <div className="font-medium">{p.name} <span>( Id : {p.cardId || p._id?.slice(-8).toUpperCase()})</span></div>
                    <div className="text-sm text-gray-600">Phone: {p.phone}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedPatient && (
            <div className="border-2 border-[#2563eb] rounded-lg p-4 bg-[#ebf4ff]/50 mb-4 flex justify-between items-center">
              <div>
                <div className="font-bold text-lg text-[#2563eb]">{selectedPatient.name} <span>( Id : {selectedPatient.cardId || selectedPatient._id?.slice(-8).toUpperCase()})</span></div>
                <div className="text-sm text-gray-700">Phone: {selectedPatient.phone}</div>
              </div>
              <button onClick={() => { setSelectedPatient(null); setShowIdCard(false); }}
                className="text-red-600 hover:text-red-800"><X className="w-6 h-6" /></button>
            </div>
          )}

          {!selectedPatient && !showNewPatientForm && (
            <button onClick={() => setShowNewPatientForm(true)}
              className="text-[#2563eb] font-semibold flex items-center gap-2 hover:gap-3 transition-all">
              <User className="w-5 h-5" /> Add New Patient
            </button>
          )}

          {showNewPatientForm && (
            <div className="border rounded-lg p-6 mt-4 bg-gray-50 shadow-md">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-lg">New Patient</h3>
                <button onClick={() => setShowNewPatientForm(false)}><X className="w-6 h-6 text-gray-500" /></button>
              </div>
              <form onSubmit={addNewPatient} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { l: "Name*", n: "name", t: "text" },
                  { l: "Phone*", n: "phone", t: "tel" },
                  { l: "Email", n: "email", t: "email" },
                  { l: "Gender*", n: "gender", t: "select", o: [{ v: "male", t: "Male" }, { v: "female", t: "Female" }, { v: "other", t: "Other" }] },
                  { l: "Age*", n: "age", t: "text" },
                  { l: "DOB", n: "dob", t: "date" },
                ].map(f => (
                  <div key={f.n}>
                    <label className="block text-sm font-medium mb-1">{f.l}</label>
                    {f.t === "select" ? (
                      <select name={f.n} value={newPatient[f.n]} onChange={handleNewPatientChange}
                        className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-[#2563eb]">
                        {f.o.map(o => <option key={o.v} value={o.v}>{o.t}</option>)}
                      </select>
                    ) : (
                      <input type={f.t} name={f.n} value={newPatient[f.n]} onChange={handleNewPatientChange}
                        required={f.l.includes("*")} className="w-full border rounded-md p-2.5 focus:ring-2 focus:ring-[#2563eb]" />
                    )}
                  </div>
                ))}
                <div className="col-span-2 flex justify-end gap-3 mt-4">
                  <button type="button" onClick={() => setShowNewPatientForm(false)}
                    className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={loading}
                    className="bg-[#2563eb] text-white px-8 py-2.5 rounded-lg hover:bg-[#1d4ed8] disabled:opacity-50 font-medium">
                    {loading ? "Adding..." : "Add Patient"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </section>

        {/* DOCTOR SELECTION */}
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Users className="mr-2 w-5 h-5" style={{ color: "#2563eb" }} />
            Doctor
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {doctors.map(d => (
              <div key={d._id} onClick={() => handleDoctorSelect(d)}
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all text-center
                  ${selectedDoctor?._id === d._id 
                    ? "border-[#2563eb] bg-[#ebf4ff] shadow-lg scale-105" 
                    : "border-gray-300 hover:border-[#2563eb] hover:shadow-md"
                  }`}>
                <div className="font-bold text-lg">Dr. {d.name}</div>
                <div className="text-sm text-gray-600 mt-1">{d.specialization}</div>
              </div>
            ))}
          </div>

          <div className="max-w-xs">
            <label className="block text-sm font-medium mb-2">Select Date</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={e => setSelectedDate(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] text-base"
            />
          </div>
        </section>

        {/* CONTINUE BUTTON */}
        <div className="flex justify-end mt-10">
          <button 
            onClick={() => { 
              if (selectedPatient && selectedDoctor && selectedDate) { 
                fetchAvailableSlots(); 
                setStep(2); 
              } 
            }}
            disabled={!selectedPatient || !selectedDoctor || !selectedDate}
            className="bg-[#2563eb] text-white py-3.5 px-12 rounded-xl hover:bg-[#1d4ed8] disabled:opacity-50 disabled:cursor-not-allowed font-bold text-lg shadow-lg transition-all hover:shadow-xl"
          >
            Continue →
          </button>
        </div>
      </div>

      {/* RIGHT COLUMN: ID CARD (Only shows when patient selected) */}
      {showIdCard && selectedPatient && (
        <div className="lg:sticky lg:top-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Patient ID Card</h3>
          
          <div
            ref={idCardRef}
            style={{
              background: "linear-gradient(135deg, #0d9488 0%, #134e4a 100%)",
              color: "#ffffff",
              padding: "20px",
              borderRadius: "16px",
              boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
              width: "500px",
              height: "350px",
              fontFamily: "'Roboto', sans-serif",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* Background decoration */}
            <div style={{ position: "absolute", top: -50, left: -50, width: 150, height: 150, background: "rgba(255,255,255,0.1)", borderRadius: "50%" }}></div>

            {/* Header */}
            <h1 style={{ textAlign: "center", fontSize: "18px", fontWeight: "bold", letterSpacing: "2px", marginBottom: "12px" }}>
              ID CARD
            </h1>

            <div style={{ display: "flex", gap: "16px", marginBottom: "12px" }}>
              <div style={{
                background: "#fff",
                borderRadius: "50%",
                padding: "10px",
                width: "76px",
                height: "76px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                
                <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24"><g fill="#34e4a"><path d="M12 11a4 4 0 1 0 0-8a4 4 0 0 0 0 8"></path><path fillRule="evenodd" d="M7.777 12A4.777 4.777 0 0 0 3 16.777V21h18v-4.223A4.777 4.777 0 0 0 16.223 12c-.302 0-.6.07-.87.205l-.111.056a7 7 0 0 1-3.13.739h-.223a7 7 0 0 1-3.13-.739l-.112-.056a1.94 1.94 0 0 0-.87-.205m-.982 2.179A2.78 2.78 0 0 0 5 16.777V19h14v-2.223c0-1.36-.977-2.49-2.267-2.73c.066.347.079.686.058 1.004l-.014.199h.267a.76.76 0 0 1 .688.439l.691 1.48a.76.76 0 0 1-.689 1.081H16.65v-1.4a.1.1 0 0 0-.1-.1H15.5a.1.1 0 0 0-.1.1v1.4h-1.134a.76.76 0 0 1-.689-1.081l.69-1.48a.76.76 0 0 1 .69-.439h.317l.02-.3a2.5 2.5 0 0 0-.018-.525A9 9 0 0 1 12.11 15h-.223a9 9 0 0 1-3.582-.744c-.06.267-.068.536-.041.796q.022.203.066.386a1.5 1.5 0 1 1-1.46.345a5 5 0 0 1-.098-.575a4 4 0 0 1 .022-1.03" clipRule="evenodd"></path></g></svg>
              </div>

              <div style={{ flex: 1, fontSize: "13.5px", lineHeight: "1.6" }}>
                <div style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "4px 10px" }}>
                  <span style={{ fontWeight: "bold", opacity: 0.9, fontSize: "15.5px", }}>PATIENT NAME:</span>
                  <span style={{ fontWeight: "bold", opacity: 0.9 , fontSize: "15.5px",}}>: {selectedPatient.name}</span>
                  <span style={{ fontWeight: "bold", opacity: 0.9, fontSize: "15.5px", }}>ID NO:</span>
                  <span style={{ fontWeight: "bold", opacity: 0.9 , fontSize: "15.5px", }}>: {selectedPatient.cardId || selectedPatient._id?.slice(-8).toUpperCase()}</span>
                  <span style={{ fontWeight: "bold", opacity: 0.9 }}>AGE/GENDER:</span>
                  <span>: {selectedPatient.age || "?"} Yrs / {selectedPatient.gender?.charAt(0).toUpperCase() + selectedPatient.gender?.slice(1)}</span>
                  <span style={{ fontWeight: "bold", opacity: 0.9 }}>PHONE:</span>
                  <span>: {selectedPatient.phone}</span>
                </div>
              </div>
            </div>

            <div style={{ height: "3px", background: "#fbbf24", margin: "12px 0" }}></div>

            <div style={{ textAlign: "center" }}>
              <p style={{ fontSize: "11px", opacity: 0.9, marginBottom: "4px" }}>CONSULTANT DOCTOR:</p>
              <h2 style={{ fontSize: "19px", fontWeight: "bold", fontStyle: "italic", margin: "0" }}>
                Dr. Mansoor Ali V. P.
              </h2>
              <p style={{ color: "#fbbf24", fontWeight: "bold", fontSize: "15px", margin: "4px 0 12px" }}>
                PATHAPPIRIYAM
              </p>
            </div>

            <div style={{
              background: "#ffffff",
              color: "#134e4a",
              padding: "10px 16px",
              borderRadius: "8px",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "14px",
              margin: "0 auto 8px",
              width: "fit-content",
            }}>
              APPOINTMENT BOOKING: +91 8606344694
            </div>

            {/* <div style={{ textAlign: "center", fontSize: "11px" }}>
              <p style={{ margin: 0, opacity: 0.9 }}>clinicppm@gmail.com</p>
              <p style={{ margin: "4px 0 0", opacity: 0.7 }}>Valid ID for all visits</p>
            </div> */}
          </div>

          {/* Download & WhatsApp Buttons */}
          <div className="mt-6 flex gap-3">
            <button onClick={handleDownload} disabled={loading}
              className="flex-1 bg-white text-[#134e4a] border-2 border-[#134e4a] py-3.5 rounded-xl hover:bg-[#ecfeff] font-bold text-sm transition-all">
              {loading ? "Generating..." : "Download PNG"}
            </button>
            <button onClick={sendWhatsApp} disabled={loading}
              className="flex-1 bg-green-500 text-white py-3.5 rounded-xl hover:bg-green-600 font-bold text-sm flex items-center justify-center gap-2 transition-all">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.44h-.004c-1.575-.05-3.111-.813-4.438-2.353-1.329-1.538-2.037-3.465-2.04-5.408-.004-3.582 2.917-6.682 6.502-6.682 1.74 0 3.378.678 4.606 1.908 1.228 1.23 1.906 2.868 1.906 4.606 0 3.583-2.918 6.683-6.532 6.683m6.295-13.64c-1.478-1.478-3.43-2.291-5.506-2.291-4.29 0-7.783 3.493-7.783 7.783 0 1.371.357 2.698 1.034 3.87l-1.1 4.02 4.131-1.085c1.14.623 2.422.953 3.735.953 4.29 0 7.783-3.493 7.783-7.783 0-2.076-.813-4.027-2.294-5.487"/>
              </svg>
              {loading ? "Sending..." : "Send via WhatsApp"}
            </button>
          </div>
        </div>
      )}

    </div>
  </div>
)}


      {/* STEP 2 – SLOT SELECTION (unchanged – copy from previous code) */}
      {step === 2 && (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-5 flex items-center">
            <Calendar className="mr-2 w-5 h-5 text-blue-600" />
            Select Appointment Slot
          </h2>

          <div className="flex flex-wrap gap-6 mb-6">
            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <User className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Patient</div>
                <div className="font-medium">{selectedPatient.name}</div>
              </div>
            </div>

            <div className="text-gray-300 hidden sm:block">|</div>

            <div className="flex items-center">
              <div className="bg-blue-100 rounded-lg p-2 mr-3">
                <Users className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <div className="text-sm text-gray-600">Doctor</div>
                <div className="font-medium">Dr. {selectedDoctor.name}</div>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <Loader className="animate-spin w-9 h-9 text-blue-600" />
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2">
                <h3 className="font-medium text-gray-700">
                  Available Slots – {selectedDate}
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4">
                {availableSlots.map((t) => (
                  <div
                    key={t}
                    className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all ${selectedSlot === t
                        ? "bg-blue-50 border-blue-500 border-l-4"
                        : "border-gray-200 hover:bg-gray-50"
                      }`}
                    onClick={() => handleSlotSelect(t)}
                  >
                    <div className="flex items-center">
                      <div className="bg-blue-100 p-2 rounded-full mr-3">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium">{t}</div>
                    </div>
                    {selectedSlot === t && <Check className="w-4 h-4 text-blue-600" />}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 border rounded-lg bg-gray-50">
              <p className="text-gray-500 mb-3">
                No slots available for this doctor on the selected date.
              </p>
              <button
                onClick={() => setStep(1)}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Choose another doctor
              </button>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(1)}
              className="border border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              disabled={!selectedSlot}
              className="bg-blue-600 text-white py-2.5 px-8 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* STEP 3 – CONFIRM (unchanged) */}
      {step === 3 && (
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-5 flex items-center">
            <FileText className="mr-2 w-5 h-5 text-blue-600" />
            Appointment Details
          </h2>

          <div className="bg-gray-50 border rounded-lg p-5 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <div className="text-sm text-gray-500 mb-1">Patient</div>
                <div className="font-medium">{selectedPatient.name}</div>
                <div className="text-sm text-gray-600">
                  {selectedPatient.phone}
                  {selectedPatient.email && ` | ${selectedPatient.email}`}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Doctor</div>
                <div className="font-medium">Dr. {selectedDoctor.name}</div>
                <div className="text-sm text-gray-600">{selectedDoctor.specialization}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Date</div>
                <div className="font-medium">{selectedDate}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1">Time</div>
                <div className="font-medium">{selectedSlot}</div>
              </div>
            </div>
          </div>

          {/* Vitals */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {[
              { label: "SpO2", key: "spo2", placeholder: "e.g. 98%" },
              { label: "BP", key: "bp", placeholder: "e.g. 120/80" },
              { label: "Pulse", key: "pulse", placeholder: "e.g. 72" },
              { label: "Temperature", key: "temp", placeholder: "e.g. 98.6", unit: true },
              { label: "Weight", key: "weight", placeholder: "e.g. 70kg" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {field.label}
                </label>
                {field.unit ? (
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      step="0.1"
                      className="w-full border rounded-md p-2 pr-14 focus:ring-blue-500 focus:border-blue-500"
                      value={vitals.temp}
                      onChange={(e) => setVitals({ ...vitals, temp: e.target.value })}
                      placeholder={field.placeholder}
                    />
                    <select
                      value={vitals.unit}
                      onChange={(e) => setVitals({ ...vitals, unit: e.target.value })}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 border border-gray-300 rounded-md text-sm"
                    >
                      <option value="C">°C</option>
                      <option value="F">°F</option>
                    </select>
                  </div>
                ) : (
                  <input
                    type="text"
                    className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    value={vitals[field.key]}
                    onChange={(e) => setVitals({ ...vitals, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>
            <textarea
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              rows={4}
              className="w-full border rounded-md p-3 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any extra information (optional)"
            />
          </div>

          {bookingError && (
            <div className="mb-4 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded">
              {bookingError}
            </div>
          )}

          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(2)}
              className="border border-gray-300 text-gray-700 py-2.5 px-6 rounded-lg hover:bg-gray-50 transition"
            >
              Back
            </button>
            <button
              onClick={bookAppointment}
              disabled={loading}
              className="bg-blue-600 text-white py-2.5 px-8 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
            >
              {loading ? "Processing…" : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}