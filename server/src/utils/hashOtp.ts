import bcryptjs from "bcryptjs";

 class OtpAuth {
    async hashOtp(otp: number): Promise<string> {
        const salt = await bcryptjs.genSalt(10);
        return await bcryptjs.hash(String(otp), salt);
    }
    async compareOtp(otp: number, hashedOtp: string): Promise<boolean> {
        return await bcryptjs.compare(String(otp), hashedOtp);
    }
}

export default new OtpAuth()