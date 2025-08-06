import { DoctorModel, IDoctor } from "../models/doctor.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";
import { RefreshTokenService } from "./refreshToken.service";

export class DoctorService {
    static async registerDoctor(data: IDoctor): Promise<{ doctor: IDoctor; accessToken: string; refreshToken: string }> {
        try {
            const existingDoctor = await DoctorModel.findOne({ email: data.email });
            if (existingDoctor) throw new Error("Doctor already exists");

            const hashedPassword = await hashPassword(data.password);
            const doctor = await DoctorModel.create({ ...data, password: hashedPassword });

            const tokens = generateToken({ id: doctor._id, email: doctor.email });
            
            // Store refresh token in database
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

            // Ensure doctor._id is a string (fix for type 'unknown')
            const doctorId = (doctor._id as unknown as string).toString();

            await RefreshTokenService.createRefreshToken(doctorId, tokens.refreshToken, expiresAt);

            return { doctor, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
        } catch (error: any) {
            console.error(error?.message || "Error during doctor registration");
            throw new Error(error.message || "Error during doctor registration");
        }
    }
    
    static async getAllDoctors(): Promise<IDoctor[]> {
        try {
          return await DoctorModel.find();
        } catch (error: any) {
          throw new Error(`Error fetching patients: ${error.message}`);
        }
    }
    
    static async getDoctorById(id: string): Promise<IDoctor | null> {
        try {
            return await DoctorModel.findById(id);
        } catch (error: any) {
            throw new Error(`Error fetching doctor by id: ${error.message}`);
        }
    }
    
    static async loginDoctor(email: string, password: string): Promise<{ doctor: IDoctor; accessToken: string; refreshToken: string }> {
        const doctor = await DoctorModel.findOne({ email });
        if (!doctor) throw new Error("Invalid credentials");

        const isMatch = password === doctor.password;
        if (!isMatch) throw new Error("Invalid credentials");

        const tokens = generateToken({ id: doctor._id, email: doctor.email });
        
        // Store refresh token in database
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

        // Ensure doctor._id is a string (fix for type 'unknown')
        const doctorId = (doctor._id as unknown as string).toString();

        await RefreshTokenService.createRefreshToken(doctorId, tokens.refreshToken, expiresAt);

        return { doctor, accessToken: tokens.accessToken, refreshToken: tokens.refreshToken };
    }

    static async updateDoctor(id: string, data: Partial<IDoctor>) {
        if (data.password) {
            data.password = await hashPassword(data.password);
        }
        return DoctorModel.findByIdAndUpdate(id, data, { new: true });
    }

    static async deleteDoctor(id: string) {
        return DoctorModel.findByIdAndDelete(id);
    }

    static async logout(userId: string, refreshToken: string) {
        // Revoke the refresh token
        await RefreshTokenService.revokeRefreshToken(refreshToken);
        return { message: "Logged out successfully" };
    }
}
