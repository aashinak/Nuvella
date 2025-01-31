import axiosAdminInstance from "@/axios/adminAxiosIntance";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

// Check if admin exists
export const adminExistsCheck = async (adminId: string) => {
  try {
    const response = await axiosAdminInstance.post("/admin/adminExist", {
      adminId,
    });
    return response.data;
  } catch (error: any) {
    logError(error);

    // Provide a standardized error response
    throw {
      message: "Failed to check if admin exists.",
      details: error.response?.data || error.message,
    };
  }
};

// Admin login
export const adminLogin = async (email: string, password: string) => {
  try {
    const response = await axiosAdminInstance.post("/admin/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    logError(error);

    // Provide a standardized error response
    throw {
      message: "Failed to log in.",
      details: error.response?.data || error.message,
    };
  }
};

// Admin OTP verification
export const adminLoginOtpVerification = async (
  adminId: string,
  otp: string
) => {
  try {
    const response = await axiosAdminInstance.post(
      "/admin/adminOtpVerification",
      {
        adminId,
        otp,
      }
    );
    return response.data;
  } catch (error: any) {
    logError(error);

    // Provide a standardized error response
    throw {
      message: "Failed to verify OTP.",
      details: error.response?.data || error.message,
    };
  }
};

export const adminCreationRequest = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const response = await axiosAdminInstance.post(
      "/admin/adminCreationRequest",
      {
        name,
        email,
        password,
      }
    );
    return response.data;
  } catch (error: any) {
    logError(error);

    // Provide a standardized error response
    throw {
      message: "Admin creation request failed.",
      details: error.response?.data || error.message,
    };
  }
};

export const adminCreationRequestVerification = async (
  otp1: number,
  otp2: number,
  newAdminsId: string
) => {
  try {
    const response = await axiosAdminInstance.post(
      "/admin/adminCreationRequestValidation",
      {
        otp1,
        otp2,
        newAdminsId,
      }
    );
    return response.data;
  } catch (error: any) {
    logError(error);

    // Provide a standardized error response
    throw {
      message: "Admin creation request verification failed.",
      details: error.response?.data || error.message,
    };
  }
};

export const adminLogout = async () => {
  try {
    const response = await axiosAdminInstance.post("/admin/adminLogout");
    return response.data;
  } catch (error: any) {
    logError(error);

    // Provide a standardized error response
    throw {
      message: "Admin logout failed.",
      details: error.response?.data || error.message,
    };
  }
};
