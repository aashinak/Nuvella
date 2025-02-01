import userAxiosInstance from "@/axios/userAxiosInstance";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

export const getBanners = async () => {
  try {
    const response = await userAxiosInstance.get("/user/getBanners");
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch banners.",
      details: error.response?.data || error.message,
    };
  }
};
