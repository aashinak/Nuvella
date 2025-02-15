import handleAxiosError from "@/api/handleAxiosError";
import userAxiosInstance from "@/axios/userAxiosInstance";
import IUserAddress from "@/entities/user/IUserAddress";

export const getUserAddresses = async () => {
  try {
    const response = await userAxiosInstance.get("/user/getUserAddresses");
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch addresses.");
  }
};

export const createUserAddress = async (data: IUserAddress) => {
  try {
    const response = await userAxiosInstance.post("/user/createUserAddress", {
      address: data,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to create address.");
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
  } catch (error) {
    handleAxiosError(error, "Failed to edit address.");
  }
};

export const deleteUserAddress = async (addressId: string) => {
  try {
    const response = await userAxiosInstance.delete(
      `/user/deleteUserAddress/${addressId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to delete address.");
  }
};

export const updateUserData = async (formData: FormData) => {
  try {
    const response = await userAxiosInstance.put(
      `/user/updateUserData`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
        },
      }
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to update user data.");
  }
};
