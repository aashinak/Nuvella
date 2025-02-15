import handleAxiosError from "@/api/handleAxiosError";
import axiosAdminInstance from "@/axios/adminAxiosIntance";

interface Banner {
  id?: string;
  heroImage: string | File;
  heroText: string;
  subText1: string;
  subText2: string;
}

export const getUiUpdates = async (): Promise<{ data: Banner[] }> => {
  try {
    const response = await axiosAdminInstance.get("/admin/getUiUpdates");
    return response.data;
  } catch (error) {
    handleAxiosError(error, "UI updates fetch failed.");
    throw error;
  }
};

export const setUiUpdates = async (
  banner: Banner
): Promise<{ data: Banner[] }> => {
  try {
    const formData = new FormData();
    formData.append("heroText", banner.heroText);
    formData.append("subText1", banner.subText1);
    formData.append("subText2", banner.subText2);

    if (banner.heroImage && banner.heroImage instanceof File) {
      formData.append("heroImage", banner.heroImage);
    }

    const response = await axiosAdminInstance.post(
      "/admin/uiUpdate",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    handleAxiosError(error, "UI updates submission failed.");
    throw error;
  }
};

export const uiUpdateDelete = async (
  updateId: string
): Promise<{ message: string; success: boolean }> => {
  try {
    const response = await axiosAdminInstance.patch("/admin/uiUpdateDelete", {
      updateId,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "UI updates delete failed.");
    throw error;
  }
};
