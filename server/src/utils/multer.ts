// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// // Create the uploads directory if it doesn't exist
// const uploadDir = path.join(__dirname, '../uploads/profileImages');
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// // Configure storage
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     const ext = path.extname(file.originalname);
//     cb(null, 'profile-' + uniqueSuffix + ext);
//   }
// });

// // Filter for image types
// const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
//   const allowedTypes = /jpeg|jpg|png|webp/;
//   const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   if (isValid) {
//     cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
//   }
// };

// export const upload = multer({
//   storage,
//   fileFilter,
//   limits: {
//     fileSize: 2 * 1024 * 1024
//   }
// });

// const storageLabReport = multer.diskStorage({
//   destination: function (req: any, file: any, cb: any) {
//     cb(null, path.join(__dirname, "../uploads/labReports"));
//   },
//   filename: function (req: any, file: any, cb: any) {
//     const ext = path.extname(file.originalname);
//     cb(null, "labreport-" + Date.now() + ext);
//   },
// });

// const fileFilterLabReport = (req: any, file: any, cb: any) => {
//   const allowed = ["image/jpeg", "image/png", "application/pdf"];
//   if (allowed.includes(file.mimetype)) cb(null, true);
//   else cb(new Error("Only images and pdfs allowed"), false);
// };

// export const uploadLabReport = multer({ storage: storageLabReport, fileFilter: fileFilterLabReport });
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage for profile images
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'profileImages',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }],
  } as any,
});

// Storage for lab reports
const storageLabReport = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'labReports',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  } as any,
});

// File filters
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
};

const fileFilterLabReport = (req: any, file: any, cb: any) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images and PDFs allowed"), false);
};

// Export multer instances
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export const uploadLabReport = multer({
  storage: storageLabReport,
  fileFilter: fileFilterLabReport,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// NEW: ID-card storage (PNG only)

const storageIdCard = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'idCards',
    allowed_formats: ['png', 'jpg', 'jpeg'],
    transformation: [{ quality: 'auto', fetch_format: 'auto' }],
  } as any,
});

export const uploadIdCard = multer({
  storage: storageIdCard,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
});
