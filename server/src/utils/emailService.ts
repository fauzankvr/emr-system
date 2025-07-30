import { Types } from "mongoose";
import nodemailer from "nodemailer";
import { IPrescription } from "../models/prescription.model";

export async function sendEmailWithPDFAttachment(to: string, prescription: IPrescription, pdfFilePath: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const patient = typeof prescription.patient === 'object' ? prescription.patient : { _id: prescription.patient };
  const doctor = typeof prescription.doctor === 'object' ? prescription.doctor : { _id: prescription.doctor };
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const textContent = `Dear Patient,

Here is Prescription file prescribed by Dr MANSOOR ALI.VP

DR MANSOOR ALI.VP has requested to provide feedback and share your clinic visit experience with us. please call 9895353078

Warm regards,
Dr. MANSOOR ALI.VP`;

  const prescriptionId = prescription._id ? 
    prescription._id.toString().slice(-6).toUpperCase() : 
    Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      await transporter.sendMail({
        from: `"CLINIC PPM Health" <${process.env.MAIL_USER}>`,
        to,
        subject: "Your Prescription from CLINIC PPM Health",
        text: textContent,
        attachments: [
          {
            filename: `prescription-${prescriptionId}.pdf`,
            path: pdfFilePath,
            contentType: 'application/pdf'
          }
        ]
      });
    } catch (error) {
      console.log("Error sending email:", error);
    }
}