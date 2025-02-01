import userAxiosInstance from "@/axios/userAxiosInstance";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

export const userLogin = async (email: string, password: string) => {
  try {
    const response = await userAxiosInstance.post("/user/login", {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to login.",
      details: error.response?.data || error.message,
    };
  }
};

export const userLogout = async () => {
  try {
    const response = await userAxiosInstance.post("/user/logout");
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to logout.",
      details: error.response?.data || error.message,
    };
  }
};

export const userTokenRegen = async () => {
  try {
    const response = await userAxiosInstance.post("/user/userTokenRegen");
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to regenerate token.",
      details: error.response?.data || error.message,
    };
  }
};
