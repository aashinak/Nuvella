import logError from "@/api/errorLogging";
import handleAxiosError from "@/api/handleAxiosError";
import axiosAdminInstance from "@/axios/adminAxiosIntance";

// Check if admin exists
export const adminExistsCheck = async (adminId: string) => {
  try {
    const { data } = await axiosAdminInstance.post("/admin/adminExist", {
      adminId,
    });
    return data;
  } catch (error) {
    logError(error);
    throw handleAxiosError(error, "Failed to check if admin exists.");
  }
};

// Admin login
export const adminLogin = async (
  email: string,
  password: string,
  adminId: string
) => {
  try {
    const { data } = await axiosAdminInstance.post("/admin/login", {
      email,
      password,
      adminId,
    });
    return data;
  } catch (error) {
    logError(error);
    throw handleAxiosError(error, "Failed to log in.");
  }
};

// Admin OTP verification
export const adminLoginOtpVerification = async (
  adminId: string,
  otp: string
) => {
  try {
    const { data } = await axiosAdminInstance.post(
      "/admin/adminOtpVerification",
      { adminId, otp }
    );
    return data;
  } catch (error) {
    logError(error);
    throw handleAxiosError(error, "Failed to verify OTP.");
  }
};

// Admin creation request
export const adminCreationRequest = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const { data } = await axiosAdminInstance.post(
      "/admin/adminCreationRequest",
      { name, email, password }
    );
    return data;
  } catch (error) {
    logError(error);
    throw handleAxiosError(error, "Admin creation request failed.");
  }
};

// Admin creation request verification
export const adminCreationRequestVerification = async (
  otp1: number,
  otp2: number,
  newAdminsId: string
) => {
  try {
    const { data } = await axiosAdminInstance.post(
      "/admin/adminCreationRequestValidation",
      { otp1, otp2, newAdminsId }
    );
    return data;
  } catch (error) {
    logError(error);
    throw handleAxiosError(
      error,
      "Admin creation request verification failed."
    );
  }
};

// Admin logout
export const adminLogout = async () => {
  try {
    const { data } = await axiosAdminInstance.post("/admin/adminLogout");
    return data;
  } catch (error) {
    logError(error);
    throw handleAxiosError(error, "Admin logout failed.");
  }
};
