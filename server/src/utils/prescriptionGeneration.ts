import { IPrescription } from "../models/prescription.model";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import os from "os";

import { sendEmailWithPDFAttachment } from "./emailService";

/**
 * Sends a prescription as a PDF attachment via email.
 */
export async function sendPrescriptionPDF(
  to: string,
  prescription: IPrescription
): Promise<void> {
  const pdfFilePath = await generatePrescriptionPDF(prescription);
  await sendEmailWithPDFAttachment(to, prescription, pdfFilePath);

  // Clean up temporary file
  try {
    fs.unlinkSync(pdfFilePath);
  } catch (error) {
    console.error("Error deleting temporary PDF file:", error);
  }
}

/**
 * Generates a styled PDF from a prescription object matching the provided image.
 */
async function generatePrescriptionPDF(
  prescription: IPrescription
): Promise<string> {
  const tempFilePath = path.join(os.tmpdir(), `prescription-${Date.now()}.pdf`);
  const doc = new PDFDocument({
    size: "A4",
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
  });

  const stream = fs.createWriteStream(tempFilePath);
  doc.pipe(stream);

  const colors = {
    teal: "#009688",
    black: "#000000",
    gray: "#666666",
    lightGray: "#CCCCCC",
    white: "#FFFFFF",
  };

  const doctor = (prescription.doctor as any) || {
    name: "MANSOOR ALI.V.P",
    regNo: "35083",
    contact: "9895353078",
    specialization: "General Practitioner",
  };

  const patient = (prescription.patient as any) || {
    name: " ",
    phone: " ",
    age: " ",
    vitals: {
      spo2: " ",
      bp: " ",
      pulse: " ",
      temp: " ",
      weight: " ",
    },
  };
  const vitals = patient?.vitals || {};
  const prescriptionDate = new Date(prescription.createdAt || Date.now());

  // Date and time (12-hour format)
  const formattedDateTime = convertDate(prescriptionDate);

  function convertDate(date: Date) {
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Kolkata",
    });
  }

  let currentY = 30;

  // --- HEADER SECTION ---
  // Teal header background
  doc.rect(0, 0, doc.page.width, 80).fill(colors.teal);

  // Doctor name and credentials
  doc
    .font("Helvetica-Bold")
    .fontSize(18)
    .fillColor(colors.white)
    .text(`Dr.${doctor.name}, MD (PHYSICIAN)`, 0, 15, { align: "center" });

  doc
    .font("Helvetica")
    .fontSize(10)
    .text(
      `General Practitioner | Reg No: 35083 | +91 9895353078`,
      0,
      35,
      { align: "center" }
    );

  doc
    .text("Pathappiriyam | BOOKING NO: +91 8606344694", 0, 50, {
      align: "center",
    });

  currentY = 100;

  // --- PATIENT INFORMATION SECTION ---
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .fillColor(colors.black)
    .text("Patient Information", 30, currentY);

  currentY += 20;

  // Left column
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .text("Name: ", 30, currentY)
    .font("Helvetica")
    .text(patient.name, 70, currentY);

  doc
    .font("Helvetica-Bold")
    .text("Phone: ", 30, currentY + 15)
    .font("Helvetica")
    .text(patient.phone, 70, currentY + 15);

  doc
    .font("Helvetica-Bold")
    .text("Age: ", 30, currentY + 30)
    .font("Helvetica")
    .text(patient.age, 70, currentY + 30);

  // Diagnosis
  doc
    .font("Helvetica-Bold")
    .text("Diagnosis: ", 30, currentY + 45)
    .font("Helvetica")
    .text(prescription.diagnosis || "-", 90, currentY + 45, { width: 230 });

  // Additional Notes (below Diagnosis)
  doc
    .font("Helvetica-Bold")
    .text("Additional Notes: ", 30, currentY + 60)
    .font("Helvetica")
    .text(prescription.notes || "-", 120, currentY + 60, { width: 200 });

  // Date & Time (after Notes)
  doc
    .font("Helvetica-Bold")
    .text("Date & Time: ", 30, currentY + 75)
    .font("Helvetica")
    .text(formattedDateTime, 120, currentY + 75);

  // Right column - Vitals
  const rightColX = 320;
  doc
    .font("Helvetica-Bold")
    .text("SpO2: ", rightColX, currentY)
    .font("Helvetica")
    .text(vitals.spo2 || "", rightColX + 35, currentY);

  doc
    .font("Helvetica-Bold")
    .text("BP: ", rightColX, currentY + 15)
    .font("Helvetica")
    .text(vitals.bp || "", rightColX + 25, currentY + 15);

  doc
    .font("Helvetica-Bold")
    .text("Pulse: ", rightColX, currentY + 30)
    .font("Helvetica")
    .text(vitals.pulse || "", rightColX + 35, currentY + 30);

  doc
    .font("Helvetica-Bold")
    .text("Temp: ", rightColX, currentY + 45)
    .font("Helvetica")
    .text(vitals.temp || "", rightColX + 35, currentY + 45);

  doc
    .font("Helvetica-Bold")
    .text("Weight: ", rightColX, currentY + 60)
    .font("Helvetica")
    .text(vitals.weight || "", rightColX + 40, currentY + 60);

  currentY += 90;

  // --- LAB REPORT SECTION ---
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Lab Report", 30, currentY);

  currentY += 15;

  const labReports = prescription.labReports || [];
  if (labReports.length > 0) {
    labReports.forEach((report: any) => {
      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Report Name: ", 30, currentY)
        .font("Helvetica")
        .text(report.name || " ", 100, currentY, { width: 400 });

      doc
        .font("Helvetica-Bold")
        .text("Value: ", 30, currentY + 12)
        .font("Helvetica")
        .text(report.value || " ", 100, currentY + 12, { width: 400 });

      doc
        .font("Helvetica-Bold")
        .text("Report Date: ", 30, currentY + 24)
        .font("Helvetica")
        .text(convertDate(report.reportDate) || " ", 100, currentY + 24);

      currentY += 45;
    });
  } else {
    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .text("Report Name: ", 30, currentY)
      .font("Helvetica")
      .text(" ", 100, currentY);

    doc
      .font("Helvetica-Bold")
      .text("Value: ", 30, currentY + 12)
      .font("Helvetica")
      .text(" ", 100, currentY + 12);

    doc
      .font("Helvetica-Bold")
      .text("Report Date: ", 30, currentY + 24)
      .font("Helvetica")
      .text(" ", 100, currentY + 24);

    currentY += 45;
  }

  // --- MEDICINES SECTION ---
  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Medicines", 30, currentY);

  currentY += 20;

  // Medicine table header
  const tableStartX = 30;
  const tableWidth = doc.page.width - 60;
  const colWidths = [30, 120, 60, 60, 60, 60, 90]; // Sl, Medicine, Dosage, Type, Frequency, Duration, Instructions

  // Header background
  doc.rect(tableStartX, currentY, tableWidth, 20).fill(colors.lightGray);

  // Header text
  doc
    .font("Helvetica-Bold")
    .fontSize(10)
    .fillColor(colors.black)
    .text("Sl", tableStartX + 5, currentY + 6)
    .text("Medicine", tableStartX + colWidths[0] + 5, currentY + 6)
    .text("Dosage", tableStartX + colWidths[0] + colWidths[1] + 5, currentY + 6)
    .text("Type", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 6)
    .text("Frequency", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 6)
    .text("Duration", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 5, currentY + 6)
    .text("Instructions", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + 5, currentY + 6);

  currentY += 20;

  // Helper function to calculate text height
  function calculateTextHeight(text: string, availableWidth: number, fontSize: number): number {
    const averageCharWidth = fontSize * 0.6; // Approximate character width
    const charactersPerLine = Math.floor(availableWidth / averageCharWidth);
    const estimatedLines = Math.ceil(text.length / charactersPerLine);
    const lineHeight = fontSize * 1.2; // Line height is typically 1.2 times font size
    return Math.max(estimatedLines * lineHeight, fontSize + 5); // Minimum height
  }

  // Medicine rows
  const medicines = prescription.medicines || [];
  if (medicines.length > 0) {
    medicines.forEach((med: any, index: number) => {
      // Calculate dynamic row height based on content
      let rowHeight = 25; // Base height
      
      // Calculate heights for each column with wrapping
      const medicineText = med.medicine?.name || " ";
      const dosageText = med.dosageAmount || "-";
      const typeText = med.medicine?.dosageForm || "-";
      const frequencyText = med.dosage || " ";
      const durationText = med.duration || " ";
      const instructionsText = med.instructions || " ";

      const medicineHeight = calculateTextHeight(medicineText, colWidths[1] - 10, 9);
      const dosageHeight = calculateTextHeight(dosageText, colWidths[2] - 10, 9);
      const typeHeight = calculateTextHeight(typeText, colWidths[3] - 10, 9);
      const frequencyHeight = calculateTextHeight(frequencyText, colWidths[4] - 10, 9);
      const durationHeight = calculateTextHeight(durationText, colWidths[5] - 10, 9);
      const instructionsHeight = calculateTextHeight(instructionsText, colWidths[6] - 10, 9);

      let contentHeight = 0;
      if (med.medicine?.content) {
        const contentText = `Content: ${med.medicine.content}`;
        contentHeight = calculateTextHeight(contentText, colWidths[1] - 10, 8);
        rowHeight += contentHeight + 8; // Add content height plus spacing
      }
      
      if (med.isTapering && med.tapering?.length > 0) {
        rowHeight += 20; // For "Tapering:" header with spacing
        rowHeight += med.tapering.length * 15; // For each tapering schedule
        rowHeight += 5; // Extra buffer
      }

      // Use the maximum height among all columns
      rowHeight = Math.max(
        rowHeight,
        medicineHeight,
        dosageHeight,
        typeHeight,
        frequencyHeight,
        durationHeight,
        instructionsHeight
      );

      // Check if we need a new page
      if (currentY + rowHeight > doc.page.height - 80) {
        doc.addPage();
        currentY = 30;
      }

      // Row background (alternating)
      if (index % 2 === 0) {
        doc.rect(tableStartX, currentY, tableWidth, rowHeight).fill("#FAFAFA");
      }

      // Main row content with wrapping
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(colors.black)
        .text((index + 1).toString(), tableStartX + 5, currentY + 6, { width: colWidths[0] - 10 })
        .text(medicineText, tableStartX + colWidths[0] + 5, currentY + 6, { width: colWidths[1] - 10 })
        .text(dosageText, tableStartX + colWidths[0] + colWidths[1] + 5, currentY + 6, { width: colWidths[2] - 10 })
        .text(typeText, tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 6, { width: colWidths[3] - 10 })
        .text(frequencyText, tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 6, { width: colWidths[4] - 10 })
        .text(durationText, tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 5, currentY + 6, { width: colWidths[5] - 10 })
        .text(instructionsText, tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + 5, currentY + 6, { width: colWidths[6] - 10 });

      let additionalY = currentY + 20; // Start additional content below main row

      // Medicine content (if available)
      if (med.medicine?.content) {
        const contentText = `Content: ${med.medicine.content}`;
        doc
          .font("Helvetica")
          .fontSize(8)
          .fillColor(colors.gray)
          .text(contentText, tableStartX + colWidths[0] + 5, additionalY, { width: colWidths[1] - 10 });
        
        additionalY += contentHeight + 10;
      }

      // Tapering schedule (if available)
      if (med.isTapering && med.tapering?.length > 0) {
        doc
          .font("Helvetica-Bold")
          .fontSize(8)
          .fillColor(colors.black)
          .text(`Tapering: ${med.tapering.length}`, tableStartX + colWidths[0] + 5, additionalY, { width: colWidths[1] - 10 });
        additionalY += 18;

        med.tapering.forEach((taper: any, taperIndex: number) => {
          doc
            .font("Helvetica")
            .fontSize(8)
            .fillColor(colors.gray)
            .text(`${taper.dosage} for ${taper.days}`, tableStartX + colWidths[0] + 15, additionalY, { width: colWidths[1] - 20 });
          additionalY += 15;
        });
      }

      currentY += rowHeight;
    });
  } else {
    const rowHeight = 40;
    
    if (currentY + rowHeight > doc.page.height - 80) {
      doc.addPage();
      currentY = 30;
    }

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(colors.black)
      .text(" ", tableStartX + 5, currentY + 6)
      .text(" ", tableStartX + colWidths[0] + 5, currentY + 6)
      .text(" ", tableStartX + colWidths[0] + colWidths[1] + 5, currentY + 6)
      .text(" ", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + 5, currentY + 6)
      .text(" ", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + 5, currentY + 6)
      .text(" ", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + 5, currentY + 6)
      .text(" ", tableStartX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3] + colWidths[4] + colWidths[5] + 5, currentY + 6);

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(colors.gray)
      .text(" ", tableStartX + colWidths[0] + 5, currentY + 18);

    currentY += rowHeight;
  }

  // Calculate total table height for border
  let totalTableHeight = 20; // Header height
  if (medicines.length > 0) {
    medicines.forEach((med: any) => {
      let rowHeight = 25;
      const medicineText = med.medicine?.name || " ";
      const dosageText = med.dosageAmount || "-";
      const typeText = med.medicine?.dosageForm || "-";
      const frequencyText = med.dosage || " ";
      const durationText = med.duration || " ";
      const instructionsText = med.instructions || " ";

      const medicineHeight = calculateTextHeight(medicineText, colWidths[1] - 10, 9);
      const dosageHeight = calculateTextHeight(dosageText, colWidths[2] - 10, 9);
      const typeHeight = calculateTextHeight(typeText, colWidths[3] - 10, 9);
      const frequencyHeight = calculateTextHeight(frequencyText, colWidths[4] - 10, 9);
      const durationHeight = calculateTextHeight(durationText, colWidths[5] - 10, 9);
      const instructionsHeight = calculateTextHeight(instructionsText, colWidths[6] - 10, 9);

      rowHeight = Math.max(
        rowHeight,
        medicineHeight,
        dosageHeight,
        typeHeight,
        frequencyHeight,
        durationHeight,
        instructionsHeight
      );

      if (med.medicine?.content) {
        const contentText = `Content: ${med.medicine.content}`;
        const contentHeight = calculateTextHeight(contentText, colWidths[1] - 10, 8);
        rowHeight += contentHeight + 8;
      }
      if (med.isTapering && Array.isArray(med.tapering) && med.tapering.length > 0) {
        rowHeight += 20 + med.tapering.length * 15 + 5;
      }
      totalTableHeight += rowHeight;
    });
  } else {
    totalTableHeight += 40;
  }

  // Table border
  doc
    .strokeColor(colors.lightGray)
    .lineWidth(1)
    .rect(tableStartX, currentY - totalTableHeight, tableWidth, totalTableHeight)
    .stroke();

  currentY += 30;

  // --- LAB TESTS ON NEXT VISIT ---
  const labTests = prescription.labTest || [];
  const labTestsHeight = labTests.length > 0 ? 32 + (labTests.length * 15) : 32;
  const footerHeight = 80;

  if (currentY + labTestsHeight + footerHeight > doc.page.height - 30) {
    doc.addPage();
    currentY = 30;
  }

  doc
    .font("Helvetica-Bold")
    .fontSize(12)
    .text("Lab Tests On Next Visit", 30, currentY);

  currentY += 20;

  if (labTests.length > 0) {
    labTests.forEach((test: string) => {
      doc.font("Helvetica").fontSize(10).text(`• ${test}`, 30, currentY, { width: 500 });
      currentY += 15;
    });
  }

  // --- FOOTER WITH SIGNATURE SECTION ---
  const footerY = doc.page.height - 80;
  
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(colors.gray)
    .text("Prescription Generated by Suhaim Software", 30, footerY)
    .text("Visit us: www.clinicppm.site", 30, footerY + 15);

  const signatureX = doc.page.width - 200;
  
  doc
    .font("Helvetica")
    .fontSize(8)
    .fillColor(colors.black)
    .text("Signed by:", signatureX, footerY + 5);

  doc
    .font("Helvetica-Bold")
    .fontSize(8)
    .text("Dr Mansoor Ali V.P", signatureX, footerY + 15);

  doc.end();

  return new Promise((resolve, reject) => {
    stream.on("finish", () => resolve(tempFilePath));
    stream.on("error", reject);
  });
}