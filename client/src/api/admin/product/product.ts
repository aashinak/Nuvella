import axiosAdminInstance from "@/axios/adminAxiosIntance";
import ICategory from "@/entities/ICategory";
import IProduct from "@/entities/IProduct";
import IProductDiscount from "@/entities/IProductDiscount";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

interface Category {
  _id?: string;
  name?: string;
  categoryImage?: string | File;
}

export const createCategory = async (category: Category) => {
  try {
    const formData = new FormData();
    formData.append("name", category.name as string);
    formData.append("categoryImage", category.categoryImage as File);
    console.log(formData);

    const response = await axiosAdminInstance.post(
      "/admin/createCategory",
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
      message: "Category creation failed",
      details: error.response?.data || error.message,
    };
  }
};

export const getAllCategories = async () => {
  try {
    const response = await axiosAdminInstance.get("/admin/getAllCategories");
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Category creation failed",
      details: error.response?.data || error.message,
    };
  }
};

export const deleteCategory = async (categoryId: string) => {
  try {
    const response = await axiosAdminInstance.patch("/admin/deleteCategory", {
      categoryId,
    });
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Category deletion failed",
      details: error.response?.data || error.message,
    };
  }
};

export const createProduct = async (formData) => {
  try {
    const response = await axiosAdminInstance.post(
      "/admin/createProduct",
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
      message: "Product creation failed",
      details: error.response?.data || error.message,
    };
  }
};

export const getProductByCategory = async (categoryId: string) => {
  try {
    const response = await axiosAdminInstance.get(
      `/admin/getProductsByCategory/${categoryId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Product fetching failed",
      details: error.response?.data || error.message,
    };
  }
};

export const getProductDiscounts = async () => {
  try {
    const response = await axiosAdminInstance.get(`/admin/getProductDiscounts`);
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Discount fetching failed",
      details: error.response?.data || error.message,
    };
  }
};

export const createDiscount = async (
  discountData: Omit<IProductDiscount, "active">
) => {
  try {
    const response = await axiosAdminInstance.post(
      `/admin/createDiscount`,
      discountData
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Discount creation failed",
      details: error.response?.data || error.message,
    };
  }
};
