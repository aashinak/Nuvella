import handleAxiosError from "@/api/handleAxiosError";
import userAxiosInstance from "@/axios/userAxiosInstance";

export const getBanners = async () => {
  try {
    const response = await userAxiosInstance.get("/user/getBanners");
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch banners.");
  }
};
