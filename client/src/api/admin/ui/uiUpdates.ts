import axiosAdminInstance from "@/axios/adminAxiosIntance";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

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
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Ui updates fetch failed",
      details: error.response?.data || error.message,
    };
  }
};

// export const setUiUpdates = async (): Promise<{ data: Banner[] }> => {
//   try {
//     const response = await axiosAdminInstance.get("/admin/uiUpdate");
//     return response.data;
//   } catch (error: any) {
//     logError(error);
//     // Provide a standardized error response
//     throw {
//       message: "Ui updates fetch failed",
//       details: error.response?.data || error.message,
//     };
//   }
// };

export const setUiUpdates = async (
  banner: Banner
): Promise<{ data: Banner[] }> => {
  try {
    // Create FormData to send both text and image
    const formData = new FormData();
    formData.append("heroText", banner.heroText);
    formData.append("subText1", banner.subText1);
    formData.append("subText2", banner.subText2);

    // Check if heroImage is a File (image)
    if (banner.heroImage && banner.heroImage instanceof File) {
      formData.append("heroImage", banner.heroImage);
    }

    const response = await axiosAdminInstance.post(
      "/admin/uiUpdate",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data", // Set the content type to multipart/form-data
        },
      }
    );

    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Ui updates submission failed",
      details: error.response?.data || error.message,
    };
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
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Ui updates delete failed",
      details: error.response?.data || error.message,
    };
  }
};
