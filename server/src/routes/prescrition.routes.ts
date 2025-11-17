import { Router } from "express";
import { PrescriptionController } from "../controllers/prescription.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadLabReport } from "../utils/multer";

const router = Router();

router.get("/procedures", asyncHandler(PrescriptionController.getProceduresList));
router.post("/", asyncHandler(PrescriptionController.create));
router.post("/save", asyncHandler(PrescriptionController.savePrescription));
router.post("/:prescriptionId/send-email", asyncHandler(PrescriptionController.sendEmail));
router.get("/", asyncHandler(PrescriptionController.getAll));
router.get("/:id", asyncHandler(PrescriptionController.getById));
router.get("/patient/:patientId", asyncHandler(PrescriptionController.getByPatient));
router.get("/doctor/:doctorId", asyncHandler(PrescriptionController.getByDoctor));
router.put("/:id", asyncHandler(PrescriptionController.update));
router.delete("/:id", asyncHandler(PrescriptionController.delete));

// New route for uploading lab report files
router.post("/upload-lab-report", uploadLabReport.single("reportFile"), asyncHandler(PrescriptionController.uploadLabReport));

export default router;
