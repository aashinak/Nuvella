import crypto from "crypto";

// Function to generate a 6-digit OTP
const generateOtp =  (): number => {
    const otp = crypto.randomInt(100000, 999999); // Generate random integer between 100000 and 999999
    return otp;
};

export default generateOtp;