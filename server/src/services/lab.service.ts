import { ILab, Lab } from "../models/lab.model";
import { ILabReport } from "../models/labReport";
import { IPrescription, Prescription } from "../models/prescription.model";
import { ApiError } from "../utils/ApiError";
import { generateToken } from "../utils/jwt";
import { RefreshTokenService } from "./refreshToken.service";

export class LabService {
  // 🔍 Find lab user by email and password
  static async createLab(data: ILab): Promise<ILab> {
    try {
      const newLab = new Lab(data);
      return await newLab.save();
    } catch (error) {
      throw new ApiError(500, "Failed to create lab");
    }
  }

 static async loginLab(
  email: string,
  password: string
): Promise<{ lab: ILab; accessToken: string; refreshToken: string }> {
  const lab = await Lab.findOne({ email });
  if (!lab) throw new Error("Invalid credentials");

  const isMatch = password === lab.password;
  if (!isMatch) throw new Error("Invalid credentials");

  const tokens = generateToken({ id: lab._id, email: lab.email });

  // Store refresh token in database
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  // Ensure lab._id is a string (fix for type 'unknown')
  const labId = (lab._id as unknown as string).toString();

  await RefreshTokenService.createRefreshToken(labId, tokens.refreshToken, expiresAt);

  return { lab, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
}


  // 📋 Get all lab reports (formatted)
 static async getAllLabs(): Promise<ILabReport[]> {
  try {
    const prescriptions = await Prescription.find({
      labReports: { $exists: true, $not: { $size: 0 } } // only those having lab reports
    })
      .populate("patient")
      .sort({ createdAt: -1 });
    return this.toLabReport(prescriptions);
  } catch (error) {
    throw new ApiError(500, "Failed to fetch labs");
  }
}


  // 🔍 Get a single lab report by ID
  static async getLabById(id: string): Promise<ILabReport | null> {
    try {
      const prescription = await Prescription.findById(id).populate("patient");
      if (!prescription) throw new ApiError(404, "Lab not found");

      const reports = this.toLabReport([prescription]);
      return reports[0];
    } catch (error) {
      throw new ApiError(500, "Failed to fetch lab");
    }
  }

  // 🔄 Update lab report status (inside prescription.labReports)
  static async updateStatus(
  id: string, // labReport _id
  status: string, // new status value
  prescriptionId: string
): Promise<ILabReport | null> {
  try {
    const prescription = await Prescription.findById(prescriptionId).populate("patient");
    if (!prescription?.labReports) throw new ApiError(404, "Prescription not found");

    // Find the report in the array
    const reportIndex = prescription.labReports.findIndex(
      (r: any) => r._id.toString() === id
    );

    if (reportIndex === -1) throw new ApiError(404, "Lab report not found");

    prescription.labReports[reportIndex].status = status;
    const data = await prescription.save();

    const reports = this.toLabReport([data]);
    return reports[0];
  } catch (error) {
    console.error("Error updating lab report status:", error);
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update lab report status");
  }
}



  // 🧾 Update a full lab report (not just status)
  static async updateLab(id: string, data: Partial<ILabReport>): Promise<ILabReport | null> {
    try {
      const prescription = await Prescription.findByIdAndUpdate(id, data, { new: true }).populate("patient");
      if (!prescription) throw new ApiError(404, "Lab not found");

      const reports = this.toLabReport([prescription]);
      return reports[0];
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Failed to update lab");
    }
  }

  // 🗑️ Delete lab report
  static async deleteLab(id: string): Promise<boolean> {
    try {
      const result = await Prescription.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new ApiError(500, "Failed to delete lab");
    }
  }

  // 🔎 Search labs by name
  static async searchLabs(query: string): Promise<ILab[]> {
    try {
      return await Lab.find({
        name: { $regex: query, $options: "i" },
      }).sort({ name: 1 });
    } catch (error) {
      throw new ApiError(500, "Failed to search labs");
    }
  }

  // Helper to convert prescriptions to individual lab reports
// Helper to convert prescriptions to individual lab reports
static toLabReport(prescriptions: IPrescription[]): ILabReport[] {
  const allReports: ILabReport[] = [];

  prescriptions.forEach((prescription) => {
    const patient = prescription.patient as any;

    if (prescription.labReports && prescription.labReports.length > 0) {
      prescription.labReports.forEach((report: any, index: number) => {
        allReports.push({
          patient: {
            name: patient?.name || "",
            email: patient?.email || "",
            phone: patient?.phone || "",
            gender: patient?.gender || "",
            age: patient?.age || "",
            dob: patient?.dob || new Date(),
            createdAt: patient?.createdAt || prescription.createdAt,
            updatedAt: patient?.updatedAt || prescription.updatedAt,
          },

          // 👇 Reference fields
          _id: report?._id ? report._id.toString() : undefined, // lab report _id (if exists)
          prescriptionId: prescription._id, // parent prescription ID
          // reportIndex: index, // index within labReports array

          // 👇 Report fields
          name: report?.name || "",
          values: report?.values || "",
          reportDate: report?.reportDate || prescription.createdAt,
          reportImageUrl: report?.reportImageUrl || "",
          status: report?.status || "Pending",
          createdAt: prescription.createdAt,
          updatedAt: prescription.updatedAt,
        });
      });
    }
  });

  return allReports;
}

// services/lab.service.ts
static async updateReportImage(
  prescriptionId: string,
  labReportId: string,
  reportImageUrl: string,
  reportDate?: string | Date
): Promise<ILabReport | null> {
  try {
    const prescription = await Prescription.findById(prescriptionId).populate("patient");
    if (!prescription?.labReports) throw new ApiError(404, "Prescription not found");

    const reportIdx = prescription.labReports.findIndex(
      (r: any) => r._id.toString() === labReportId
    );
    if (reportIdx === -1) throw new ApiError(404, "Lab report not found");

    // ---- update fields ----
    prescription.labReports[reportIdx].reportImageUrl = reportImageUrl;

    if (reportDate) {
      prescription.labReports[reportIdx].reportDate = new Date(reportDate);
    }

    const saved = await prescription.save();

    // return the **flattened** report (same shape the UI expects)
    const flat = this.toLabReport([saved]);
    return flat.find(r => r._id?.toString() === labReportId) || null;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(500, "Failed to update report image");
  }
}

}
