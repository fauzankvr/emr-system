import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import patientRoutes from './routes/patient.routes';
import doctorRoutes from './routes/doctor.routes';
import bookingRoutes from './routes/booking.routes';
import medicineRoutes from "./routes/medicine.routes";
import prescriptionRoutes from "./routes/prescrition.routes"
import templateRoutes from "./routes/template.routes"
import diagnosisRoutes from "./routes/diagnosis.routes"
import frequencyRoutes from "./routes/frequency.routes"
import instructionRoutes from "./routes/instruction.routes"
import daysRoutes from "./routes/days.routes"
import dosageRoutes from "./routes/dosage.routes"
import refreshTokenRoutes from "./routes/refreshToken.routes"
import labRoutes from "./routes/lab.routes"
dotenv.config();

const app = express();
const allowedOrigins = [
    'http://localhost:5173', 
    'https://emr-system-seven.vercel.app',
    'https://www.clinicppm.site',
    'https://clinicppm.site' 
    // '*'
  ];


  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Allow cookies, authorization headers, etc.
    })
  );



app.use(express.json());

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/health', (_, res) => {
    res.send('API is running');
});

app.get('/', (req, res) => {
    try {
        res.send("server is finiing")
    } catch (error) {
        
    }
})
app.use('/api/doctor', doctorRoutes);
app.use('/api/patient', patientRoutes);
app.use('/api/booking', bookingRoutes);
app.use('/api/medicine', medicineRoutes);
app.use('/api/prescription', prescriptionRoutes);
app.use('/api/template', templateRoutes);
app.use('/api/diagnosis', diagnosisRoutes);
app.use('/api/frequency', frequencyRoutes);
app.use('/api/instruction', instructionRoutes);
app.use('/api/days', daysRoutes);
app.use('/api/dosage', dosageRoutes);
app.use('/api/auth', refreshTokenRoutes);
app.use('/api/lab', labRoutes);

export default app;
