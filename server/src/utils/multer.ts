import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Create the uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, '../uploads/profileImages');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'profile-' + uniqueSuffix + ext);
  }
});

// Filter for image types
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const isValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpg, jpeg, png, webp)'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
});

const storageLabReport = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, path.join(__dirname, "../uploads/labReports"));
  },
  filename: function (req: any, file: any, cb: any) {
    const ext = path.extname(file.originalname);
    cb(null, "labreport-" + Date.now() + ext);
  },
});

const fileFilterLabReport = (req: any, file: any, cb: any) => {
  const allowed = ["image/jpeg", "image/png", "application/pdf"];
  if (allowed.includes(file.mimetype)) cb(null, true);
  else cb(new Error("Only images and pdfs allowed"), false);
};

export const uploadLabReport = multer({ storage: storageLabReport, fileFilter: fileFilterLabReport });
