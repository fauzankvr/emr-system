import { DoctorModel, IDoctor } from "../models/doctor.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { generateToken } from "../utils/jwt";

export class DoctorService {
    static async registerDoctor(data: IDoctor): Promise<{ doctor: IDoctor; token: string }> {
        try {
            const existingDoctor = await DoctorModel.findOne({ email: data.email });
            if (existingDoctor) throw new Error("Doctor already exists");

            const hashedPassword = await hashPassword(data.password);
            const doctor = await DoctorModel.create({ ...data, password: hashedPassword });

            const token = generateToken({ id: doctor._id, email: doctor.email });
            return { doctor, token };
        } catch (error: any) {
            console.error(error.message || "Error during doctor registration");
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
    static async loginDoctor(email: string, password: string): Promise<{ doctor: IDoctor; token: string }> {
        const doctor = await DoctorModel.findOne({ email });
        if (!doctor) throw new Error("Invalid credentials");

        const isMatch = password === doctor.password;
        if (!isMatch) throw new Error("Invalid credentials");

        const token = generateToken({ id: doctor._id, email: doctor.email });
        return { token, doctor };
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
}
