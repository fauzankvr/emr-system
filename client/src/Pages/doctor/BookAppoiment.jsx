import React from "react";
import { useState, useEffect } from "react";

import {
  Search,
  Calendar,
  Clock,
  User,
  Users,
  FileText,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader,
} from "lucide-react";
import { axiosInstance } from "../../API/axiosInstance";

// Main component

export default function AppointmentBookingForm() {
  // State management

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

  // const [bookingReason, setBookingReason] = useState("");

  const [showNewPatientForm, setShowNewPatientForm] = useState(false);

  const [bookingSuccess, setBookingSuccess] = useState(false);

  const [bookingError, setBookingError] = useState("");

  // New patient form state

  const [newPatient, setNewPatient] = useState({
    name: "",

    email: "",

    phone: "",

    gender: "male",

    age: "",

    dob: "",

    // address: {
    //   street: "",

    //   city: "",

    //   state: "",

    //   pincode: "",
    // },
  });

  // Add state for vitals
  const [vitals, setVitals] = useState({ spo2: '', bp: '', pulse: '', temp: '', weight: '' });

  // Fetch doctors on component mount

  useEffect(() => {
    fetchDoctors();
  }, []);

  // Search patients

  const searchPatients = async () => {
    if (!searchQuery) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/api/patient/search?q=${searchQuery}`
      );

      setSearchResults(response.data.data);

    } catch (error) {
      console.error("Error searching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors

  const fetchDoctors = async () => {
    setLoading(true);

    try {
      const response = await axiosInstance.get("/api/doctor");
      console.log('docgor',response)

      setDoctors(response.data.data);
    } catch (error) {
      console.error("Error fetching doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available slots

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor) return;

    setLoading(true);

    try {
      const response = await axiosInstance.get(
        `/api/booking/slots?doctorId=${selectedDoctor._id}&date=${selectedDate}`
      );
      setAvailableSlots(response.data.data);
    } catch (error) {
      console.error("Error fetching slots:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle doctor selection

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);

    setSelectedSlot(null);

    // setStep(2);
  };

  // Handle slot selection

  const handleSlotSelect = (slot) => {
    setSelectedSlot(slot);

    setStep(3);
  };

  // Handle patient selection

  const handlePatientSelect = (patient) => {
    setVitals({...patient.vitals});
    setSelectedPatient(patient);
    setShowNewPatientForm(false);
  };

  // Handle new patient form change

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");

      setNewPatient({
        ...newPatient,

        [parent]: {
          ...newPatient[parent],

          [child]: value,
        },
      });
    } else {
      setNewPatient({
        ...newPatient,

        [name]: value,
      });
    }
  };

  // Add new patient

  const addNewPatient = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axiosInstance.post(
        "/api/patient",
        newPatient
      );

      setSelectedPatient(response.data.data);

      setShowNewPatientForm(false);
    } catch (error) {
      console.error("Error adding patient:", error);
    } finally {
      setLoading(false);
    }
  };

  // Book appointment

  const bookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedSlot) {
      setBookingError("Please complete all required fields");
      return;
    }
    setLoading(true);
    try {
      // Update patient vitals before booking
      if (selectedPatient._id) {
        await axiosInstance.patch(`/api/patient/${selectedPatient._id}/vitals`, { vitals });
      }
      // const [slotTime, slotEndTime] = selectedSlot.startTime.split("-");

      const bookingData = {
        patientId: selectedPatient._id,
        doctorId: selectedDoctor._id,
        appointmentDate: selectedDate,
        timeSlot: selectedSlot,
        status: "booked",
        // reason: bookingReason,
        notes: bookingNotes,
      };
      await axiosInstance.post("/api/booking", bookingData);
      setBookingSuccess(true);
      setBookingError("");
    } catch (error) {
      console.error("Error booking appointment:", error);
      setBookingError("Failed to book appointment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Reset form

  const resetForm = () => {
    setStep(1);

    setSelectedPatient(null);

    setSelectedDoctor(null);

    setSelectedSlot(null);

    setBookingNotes("");

    // setBookingReason("");

    setSearchQuery("");

    setSearchResults([]);

    setBookingSuccess(false);

    setBookingError("");

    setShowNewPatientForm(false);
  };
  const [selectedDate, setSelectedDate] = useState("");
  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  // Render booking successful message

  if (bookingSuccess) {
    return (
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <div className="text-center py-8">
          <div className="flex justify-center mb-4">
            <div className="bg-green-100 p-3 rounded-full">
              <Check className="text-green-500 w-12 h-12" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Appointment Booked Successfully
          </h2>

          <p className="text-gray-600 mb-6">
            {selectedPatient.name} has been scheduled with Dr.{" "}
            {selectedDoctor.name} 
          </p>

          <button
            onClick={resetForm}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Book Another Appointment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className=" mx-auto bg-white rounded-lg shadow-lg">
      {/* Header */}

      <div className="bg-blue-600 text-white p-6">
        <h1 className="text-xl font-bold">
           Appointment Booking System
        </h1>

        {/* <p className="text-sm opacity-90">Receptionist Portal</p> */}
      </div>

      {/* Progress Steps */}

      <div className="px-6 pt-6">
        <div className="flex items-center mb-6">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            1
          </div>

          <div
            className={`h-1 flex-1 mx-2 ${
              step >= 2 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>

          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            2
          </div>

          <div
            className={`h-1 flex-1 mx-2 ${
              step >= 3 ? "bg-blue-600" : "bg-gray-200"
            }`}
          ></div>

          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
            }`}
          >
            3
          </div>
        </div>

        <div className="flex justify-between text-sm mb-6 px-1">
          <span
            className={
              step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"
            }
          >
            Patient & Doctor
          </span>

          <span
            className={
              step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"
            }
          >
            Time Slot
          </span>

          <span
            className={
              step >= 3 ? "text-blue-600 font-medium" : "text-gray-500"
            }
          >
            Confirmation
          </span>
        </div>
      </div>

      {/* Step 1: Select Patient and Doctor */}

      {step === 1 && (
        <div className="p-6">
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <User className="mr-2 w-5 h-5" />
              Patient Information
            </h2>

            {!selectedPatient && !showNewPatientForm && (
              <>
                <div className="flex mb-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search patient by name, phone or ID"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full border rounded-md py-2 pl-10 pr-4 focus:ring-blue-500 focus:border-blue-500"
                    />

                    <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
                  </div>

                  <button
                    onClick={searchPatients}
                    className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                  >
                    Search
                  </button>
                </div>

                {loading && (
                  <div className="flex justify-center">
                    <Loader className="animate-spin w-8 h-8 text-blue-600" />
                  </div>
                )}

                {searchResults.length > 0 && (
                  <div className="mb-4 border rounded-md overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2 border-b">
                      <h3 className="font-medium">Search Results</h3>
                    </div>

                    <ul className="divide-y">
                      {searchResults.map((patient) => (
                        <li
                          key={patient._id}
                          className="px-4 py-3 hover:bg-blue-50 cursor-pointer"
                          onClick={() => handlePatientSelect(patient)}
                        >
                          <div className="font-medium">{patient.name}</div>

                          <div className="text-sm text-gray-600">
                            <span>Phone: {patient.phone}</span>

                            {patient.age && (
                              <span className="ml-3">Age: {patient.age}</span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setShowNewPatientForm(true)}
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 flex items-center"
                >
                  <User className="w-4 h-4 mr-1" /> Add New Patient
                </button>
              </>
            )}

            {selectedPatient && (
              <div className="border rounded-md p-4 bg-blue-50 mb-4">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-lg">
                      {selectedPatient.name}
                    </div>

                    <div className="text-sm">
                      <div>Phone: {selectedPatient.phone}</div>

                      {selectedPatient.email && (
                        <div>Email: {selectedPatient.email}</div>
                      )}

                      {selectedPatient.age && (
                        <div>
                          Age: {selectedPatient.age} | Gender:{" "}
                          {selectedPatient.gender}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedPatient(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* New Patient Form */}

            {showNewPatientForm && (
              <div className="border rounded-md p-4 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">New Patient Registration</h3>

                  <button
                    onClick={() => setShowNewPatientForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={newPatient.name}
                      onChange={handleNewPatientChange}
                      required
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number*
                    </label>

                    <input
                      type="tel"
                      name="phone"
                      value={newPatient.phone}
                      onChange={handleNewPatientChange}
                      required
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={newPatient.email}
                      onChange={handleNewPatientChange}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Gender*
                    </label>

                    <select
                      name="gender"
                      value={newPatient.gender}
                      onChange={handleNewPatientChange}
                      required
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="male">Male</option>

                      <option value="female">Female</option>

                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Age*
                    </label>

                    <input
                      type="number"
                      name="age"
                      value={newPatient.age}
                      onChange={handleNewPatientChange}
                      required
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth
                    </label>

                    <input
                      type="date"
                      name="dob"
                      value={newPatient.dob}
                      onChange={handleNewPatientChange}
                      className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Address
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <input
                        type="text"
                        name="address.street"
                        placeholder="Street Address"
                        value={newPatient.address.street}
                        onChange={handleNewPatientChange}
                        className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="address.city"
                        placeholder="City"
                        value={newPatient.address.city}
                        onChange={handleNewPatientChange}
                        className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="address.state"
                        placeholder="State"
                        value={newPatient.address.state}
                        onChange={handleNewPatientChange}
                        className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <input
                        type="text"
                        name="address.pincode"
                        placeholder="Pincode"
                        value={newPatient.address.pincode}
                        onChange={handleNewPatientChange}
                        className="w-full border rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div> */}

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowNewPatientForm(false)}
                    className="mr-2 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={addNewPatient}
                    className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Adding..." : "Add Patient"}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <Users className="mr-2 w-5 h-5" />
              Select Doctor
            </h2>

            {loading && doctors.length === 0 ? (
              <div className="flex justify-center py-4">
                <Loader className="animate-spin w-8 h-8 text-blue-600" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className={`border rounded-md p-4 cursor-pointer transition ${
                      selectedDoctor && selectedDoctor._id === doctor._id
                        ? "border-blue-500 bg-blue-50"
                        : "hover:border-blue-300"
                    }`}
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <div className="font-medium">Dr. {doctor.name}</div>

                    <div className="text-sm text-gray-600">
                      <div>{doctor.specialization}</div>

                      <div>Experience: {doctor.experience} years</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div class="w-full max-w-sm mx-auto pt-5">
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Enter the Slot Date
              </label>
              <input
                type="date"
                placeholder="Select Date"
                onChange={handleDateChange}
                class="w-full px-4 py-2 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
              />
            </div>

            {doctors.length === 0 && !loading && (
              <div className="text-center py-6 text-gray-500">
                No doctors available. Please try again later.
              </div>
            )}
          </div>

          <div className="flex justify-end mt-6">
            <button
              onClick={() => {
                if (selectedPatient && selectedDoctor) {
                  fetchAvailableSlots();
                  setStep(2);
                }
              }}
              disabled={!selectedPatient || !selectedDoctor}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Select Time Slot */}

      {step === 2 && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Calendar className="mr-2 w-5 h-5" />
            Select Appointment Slot
          </h2>

          <div className="mb-4 flex items-center">
            <div className="bg-blue-100 rounded-md p-2 mr-3">
              <User className="w-5 h-5 text-blue-700" />
            </div>

            <div>
              <div className="text-sm text-gray-600">Patient</div>

              <div className="font-medium">{selectedPatient.name}</div>
            </div>

            <div className="mx-6 text-gray-300">|</div>

            <div className="bg-blue-100 rounded-md p-2 mr-3">
              <Users className="w-5 h-5 text-blue-700" />
            </div>

            <div>
              <div className="text-sm text-gray-600">Doctor</div>

              <div className="font-medium">Dr. {selectedDoctor.name}</div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          ) : (
            <>
              {availableSlots.length > 0 ? (
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-gray-50 px-4 py-2">
                    <h3 className="font-medium">Available Appointment Slots</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 p-4">
                    {availableSlots.map((time) => (
                      <div
                        key={time}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition hover:bg-blue-50 ${
                          availableSlots === time
                            ? "bg-blue-50 border-blue-500 border-l-4"
                            : "border-gray-200"
                        }`}
                      >
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-2 rounded-full mr-3">
                            <Clock className="w-4 h-4 text-blue-600" />
                          </div>
                          <div className="text-sm font-medium text-gray-700">
                            {time}
                          </div>
                        </div>
                        <div className="text-blue-600">
                          {availableSlots === time ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <span onClick={() => handleSlotSelect(time)}>
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 border rounded-md bg-gray-50">
                  <p className="text-gray-500">
                    No available slots for this doctor.
                  </p>

                  <button
                    onClick={() => setStep(1)}
                    className="mt-3 text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Select a different doctor
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(1)}
              className="border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50"
            >
              Back
            </button>

            <button
              onClick={() => setStep(3)}
              disabled={!selectedSlot}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}

      {step === 3 && (
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="mr-2 w-5 h-5" />
            Appointment Details
          </h2>

          <div className="bg-gray-50 border rounded-md p-4 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500 mb-1">Patient</div>

                <div className="font-medium">{selectedPatient.name}</div>

                <div className="text-sm text-gray-600">
                  {selectedPatient.phone}

                  {selectedPatient.email && (
                    <span> | {selectedPatient.email}</span>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Doctor</div>

                <div className="font-medium">Dr. {selectedDoctor.name}</div>

                <div className="text-sm text-gray-600">
                  {selectedDoctor.specialization}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">
                  Appointment Date
                </div>

                <div className="font-medium">{selectedDate}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">Time Slot</div>

                <div className="font-medium">
                   {selectedSlot}
                </div>
              </div>
            </div>
          </div>

          {/* Add Vitals Input Fields */}
          <div className="mb-6 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SpO2</label>
              <input type="text" className="w-full border rounded-md p-2" value={vitals.spo2} onChange={e => setVitals({ ...vitals, spo2: e.target.value })} placeholder="e.g. 98%" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">BP</label>
              <input type="text" className="w-full border rounded-md p-2" value={vitals.bp} onChange={e => setVitals({ ...vitals, bp: e.target.value })} placeholder="e.g. 120/80" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pulse</label>
              <input type="text" className="w-full border rounded-md p-2" value={vitals.pulse} onChange={e => setVitals({ ...vitals, pulse: e.target.value })} placeholder="e.g. 72" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
              <input type="text" className="w-full border rounded-md p-2" value={vitals.temp} onChange={e => setVitals({ ...vitals, temp: e.target.value })} placeholder="e.g. 37.5°C" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weight</label>
              <input type="text" className="w-full border rounded-md p-2" value={vitals.weight} onChange={e => setVitals({ ...vitals, weight: e.target.value })} placeholder="e.g. 70kg" />
            </div>
          </div>

          {/* <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit
            </label>

            <textarea
              value={bookingReason}
              onChange={(e) => setBookingReason(e.target.value)}
              className="w-full border rounded-md p-2 h-20 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter reason for appointment"
            ></textarea>
          </div> */}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes
            </label>

            <textarea
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              className="w-full border rounded-md p-2 h-16 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter any additional information"
            ></textarea>
          </div>

          {bookingError && (
            <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700">
              {bookingError}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              onClick={() => setStep(2)}
              className="border border-gray-300 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-50"
            >
              Back
            </button>

            <button
              onClick={bookAppointment}
              disabled={loading}
              className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
