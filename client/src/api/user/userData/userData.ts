import userAxiosInstance from "@/axios/userAxiosInstance";
import IUserAddress from "@/entities/user/IUserAddress";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

export const getUserAddresses = async () => {
  try {
    const response = await userAxiosInstance.get("/user/getUserAddresses");
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch addresses.",
      details: error.response?.data || error.message,
    };
  }
};

export const createUserAddress = async (data: IUserAddress) => {
  try {
    const response = await userAxiosInstance.post("/user/createUserAddress", {
      address: data,
    });
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to create address.",
      details: error.response?.data || error.message,
    };
  }
};

export const editUserAddress = async (
  data: Omit<IUserAddress, "_id">,
  addressId: string
) => {
  try {
    const response = await userAxiosInstance.put("/user/editUserAddress", {
      updateData: data,
      addressId,
    });
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to create address.",
      details: error.response?.data || error.message,
    };
  }
};

export const deleteUserAddress = async (addressId: string) => {
  try {
    const response = await userAxiosInstance.delete(
      `/user/deleteUserAddress/${addressId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to delete address.",
      details: error.response?.data || error.message,
    };
  }
};
