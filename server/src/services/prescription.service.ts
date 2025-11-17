import { IPrescription, Prescription } from "../models/prescription.model"
import { Types } from "mongoose";
import { PatientModel } from "../models/patient.model";
import { prescriptionEmitter } from "../events/event/prescriptionEvents";

interface GetAllOptions {
  page: number;
  limit: number;
  search: string;
  sort: string;
  order: "asc" | "desc";
  startDate?: string;
  endDate?: string;
  isLabTestOnly?: boolean;
}

export class PrescriptionService {
  static async createPrescription(data: Partial<IPrescription>) {
    try {
      if (!data.doctor || !Types.ObjectId.isValid(data.doctor)) {
        throw new Error("Invalid or missing doctor ID.");
      }
      if (!data.patient || !Types.ObjectId.isValid(data.patient)) {
        throw new Error("Invalid or missing patient ID.");
      }

      // if (!Array.isArray(data.medicines) || data.medicines.length === 0) {
      //   throw new Error("At least one medicine is required.");
      // }

      // for (const [index, med] of data.medicines.entries()) {
      //   if (!med.medicine) {
      //     throw new Error(`Invalid medicine ID at index ${index}.`);
      //   }
      // }

      const patient = await PatientModel.findById(data.patient).select("email");
      if (!patient?.email) {
        throw new Error("Patient not found or email not registered.");
      }

      const newPrescription = new Prescription({
        doctor: data.doctor,
        patient: data.patient,
        medicines: data.medicines||[],
        diagnosis: data.diagnosis || "",
        bookingNotes: data.bookingNotes || "",
        notes: data.notes || "",
        labReports: data.labReports || [],
        labTest: data.labTest || "",
        procedures: data.procedures || {},
      });

      await newPrescription.save();

      const populatedPrescription = await Prescription.findById(
        newPrescription._id
      )
        .populate("doctor", "name specialization email phone")
        .populate("patient")
        .populate("medicines.medicine", "name");

      if (!populatedPrescription) {
        throw new Error("Failed to populate prescription details.");
      }
      const some = prescriptionEmitter.emit(
        "prescription:created",
        patient.email,
        populatedPrescription
      );
      return populatedPrescription;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to create prescription: ${error.message}`);
    }
  }       
  
  
 // PrescriptionService.ts
static async getAllPrescriptions(opts: GetAllOptions) {
  const { page, limit, search, sort, order, startDate, endDate ,isLabTestOnly} = opts;

  // Build base match for dates
  const matchStage: any = {};

  // DATE RANGE
  if (startDate || endDate) {
    matchStage.updatedAt = {};
    if (startDate) {
      matchStage.updatedAt.$gte = new Date(startDate as string);
    }
    if (endDate) {
      const end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
      matchStage.updatedAt.$lte = end;
    }
  }

  // USE AGGREGATION FOR EVERYTHING → Search + Sort + Populate + Date
  const pipeline: any[] = [
    { $match: matchStage },
    
    // Join with Patient
    {
      $lookup: {
        from: "patients",
        localField: "patient",
        foreignField: "_id",
        as: "patient",
      },
    },
    { $unwind: { path: "$patient", preserveNullAndEmptyArrays: true } },

    // Join with Doctor (optional)
    {
      $lookup: {
        from: "doctors",
        localField: "doctor",
        foreignField: "_id",
        as: "doctor",
      },
    },
    { $unwind: { path: "$doctor", preserveNullAndEmptyArrays: true } },
  ];

  // SEARCH: Now works because patient is joined!
  if (search) {
    const regex = new RegExp(search.trim(), "i");
    pipeline.push({
      $match: {
        $or: [
          { "patient.name": regex },
          { "patient.email": regex },
          { "patient.phone": regex },
          { "patient.cardId": regex },
        ],
      },
    });
  }
if (isLabTestOnly) {
    pipeline.push({
      $match: {
        $or: [
          // Case 1: old data — array of non-empty strings
          {
            labTest: {
              $elemMatch: {
                $ne: "", // not an empty string
                $not: { $type: "object" } // AND make sure it's not an object
              }
            }
          },
          // Case 2: new data — array of objects with valid name field
          {
            labTest: {
              $elemMatch: {
                name: { $exists: true, $ne: "" }
              }
            }
          }
        ]
      }
    });
  }



  // Add totalAmount for price sorting
  pipeline.push({
    $addFields: {
      totalAmount: {
        $sum: {
          $map: {
            input: "$labTest",
            as: "test",
            in: {
              $convert: {
                input: "$$test.price",
                to: "double",
                onError: 0,
                onNull: 0,
              },
            },
          },
        },
      },
    },
  });

  // Count total before pagination
  const totalResult = await Prescription.aggregate([
    ...pipeline,
    { $count: "total" },
  ]);
  const total = totalResult[0]?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  // SORT: Now supports totalAmount too!
  let sortStage: any = {};
  if (sort === "totalAmount") {
    sortStage.totalAmount = order === "desc" ? -1 : 1;
  } else if (sort === "updatedAt") {
    sortStage.updatedAt = order === "desc" ? -1 : 1;
  } else {
    sortStage[sort as string] = order === "desc" ? -1 : 1;
  }
  pipeline.push({ $sort: sortStage });

  // Pagination
  pipeline.push(
    { $skip: (page - 1) * limit },
    { $limit: limit }
  );

  // Final projection (clean output, _id, etc.)
  pipeline.push({
    $project: {
      "patient.password": 0,
      "doctor.password": 0,
    },
  });

  const docs = await Prescription.aggregate(pipeline);

  return {
    docs,
    total,
    page,
    limit,
    totalPages,
    hasNext,
    hasPrev,
  };
}

  static async getPrescriptionById(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid prescription ID");
    return await Prescription.findById(id).populate(
      "doctor patient"
    );
  }

  static async getPrescriptionsByPatient(patientId: string) {
    if (!Types.ObjectId.isValid(patientId))
      throw new Error("Invalid patient ID");
    return await Prescription.find({ patient: patientId }).populate(
      "doctor patient"
    );
  }

  static async getPrescriptionsByDoctor(doctorId: string) {
    if (!Types.ObjectId.isValid(doctorId)) throw new Error("Invalid doctor ID");
    return await Prescription.find({ doctor: doctorId }).populate(
      "patient"
    );
  }

  static async updatePrescription(id: string, updates: Partial<IPrescription>) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid prescription ID");
    return await Prescription.findByIdAndUpdate(id, updates, { new: true });
  }

  static async deletePrescription(id: string) {
    if (!Types.ObjectId.isValid(id)) throw new Error("Invalid prescription ID");
    return await Prescription.findByIdAndDelete(id);
  }

  // New method to save prescription without sending email
  static async savePrescription(data: Partial<IPrescription>) {
    try {
      if (!data.doctor || !Types.ObjectId.isValid(data.doctor)) {
        throw new Error("Invalid or missing doctor ID.");
      }
      if (!data.patient || !Types.ObjectId.isValid(data.patient)) {
        throw new Error("Invalid or missing patient ID.");
      }
       
      data.labReports?.forEach(report => {
        if (!report.reportDate) {
          report.reportDate = new Date();
        }  
      });
      const newPrescription = new Prescription({
        doctor: data.doctor,
        patient: data.patient,
        medicines: data.medicines || [],
        bookingNotes: data.bookingNotes || "",
        diagnosis: data.diagnosis || "",
        notes: data.notes || "",
        labReports: data.labReports || [],
        labTest: data.labTest || "",
      });

      await newPrescription.save();

      const populatedPrescription = await Prescription.findById(
        newPrescription._id
      )
        .populate("doctor", "name specialization email phone")
        .populate("patient")
        .populate("medicines.medicine", "name");

      if (!populatedPrescription) {
        throw new Error("Failed to populate prescription details.");
      }

      return populatedPrescription;
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to save prescription: ${error.message}`);
    }
  }

  // New method to send prescription email only
  static async sendPrescriptionEmail(prescriptionId: string) {
    try {
      if (!Types.ObjectId.isValid(prescriptionId)) {
        throw new Error("Invalid prescription ID.");
      }

      const prescription = await Prescription.findById(prescriptionId)
        .populate("doctor", "name specialization email phone")
        .populate("patient")
        .populate("medicines.medicine", "name");

      if (!prescription) {
        throw new Error("Prescription not found.");
      }

      const patient = await PatientModel.findById(prescription.patient).select("email");
      if (!patient?.email) {
        throw new Error("Patient not found or email not registered.");
      }
      const result = prescriptionEmitter.emit(
        "prescription:created",
        patient.email,
        prescription
      );

      return { success: true, message: "Email sent successfully", prescription };
    } catch (error: any) {
      console.log(error);
      throw new Error(`Failed to send prescription email: ${error.message}`);
    }
  }
}
