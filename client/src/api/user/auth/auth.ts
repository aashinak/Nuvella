import handleAxiosError from "@/api/handleAxiosError";
import userAxiosInstance from "@/axios/userAxiosInstance";
import IUser from "@/entities/user/IUser";

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await userAxiosInstance.post("/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to login.");
  }
};

export const userLogout = async () => {
  try {
    const response = await userAxiosInstance.post("/user/logout");
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to logout.");
  }
};

export const userTokenRegen = async () => {
  try {
    const response = await userAxiosInstance.post("/user/userTokenRegen");
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to regenerate token.");
  }
};

export const loginWithGoogle = async (idToken: string) => {
  try {
    const response = await userAxiosInstance.post("/user/loginWithGoogle", {
      idToken,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to login.");
  }
};

export const userRegisteration = async (data: Omit<IUser, "_id">) => {
  try {
    const response = await userAxiosInstance.post("/user/register", {
      ...data,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to register.");
  }
};

export const userRegisterationOtpVerification = async (
  otp: number,
  userId: string
) => {
  try {
    const response = await userAxiosInstance.post("/user/userVerification", {
      otp,
      userId,
    });
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to verify user.");
  }
};

export const userRegisterationOtpVerificationResend = async (
  userId: string
) => {
  try {
    const response = await userAxiosInstance.post(
      "/user/userVerificationResend",
      { userId }
    );
    return response.data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to process resend request.");
  }
};
