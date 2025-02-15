import handleAxiosError from "@/api/handleAxiosError";
import axiosAdminInstance from "@/axios/adminAxiosIntance";

// Category Creation
export const createCategory = async (category: {
  name: string;
  categoryImage: File;
}) => {
  try {
    const formData = new FormData();
    formData.append("name", category.name);
    formData.append("categoryImage", category.categoryImage);

    const { data } = await axiosAdminInstance.post(
      "/admin/createCategory",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    return data;
  } catch (error) {
    throw handleAxiosError(error, "Category creation failed");
  }
};

// Get All Categories
export const getAllCategories = async () => {
  try {
    const { data } = await axiosAdminInstance.get("/admin/getAllCategories");
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch categories");
  }
};

// Delete Category
export const deleteCategory = async (categoryId: string) => {
  try {
    const { data } = await axiosAdminInstance.patch("/admin/deleteCategory", {
      categoryId,
    });
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Category deletion failed");
  }
};

// Create Product
export const createProduct = async (formData: FormData) => {
  try {
    const { data } = await axiosAdminInstance.post(
      "/admin/createProduct",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Product creation failed");
  }
};

// Get Products by Category
export const getProductByCategory = async (categoryId: string) => {
  try {
    const { data } = await axiosAdminInstance.get(
      `/admin/getProductsByCategory/${categoryId}`
    );
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Product fetching failed");
  }
};

// Get Product Discounts
export const getProductDiscounts = async () => {
  try {
    const { data } = await axiosAdminInstance.get(`/admin/getProductDiscounts`);
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Discount fetching failed");
  }
};

// Create Discount
export const createDiscount = async (discountData: {
  name: string;
  discount_percentage: number;
}) => {
  try {
    const { data } = await axiosAdminInstance.post(
      `/admin/createDiscount`,
      discountData
    );
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Discount creation failed");
  }
};

// Delete Product
export const deleteProduct = async (productId: string) => {
  try {
    const { data } = await axiosAdminInstance.delete(
      `/admin/deleteProduct/${productId}`
    );
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Product deletion failed");
  }
};

// Get Orders
export const getOrders = async (
  pageIndex = 1,
  filterCondition: "today" | "month" | "year" = "today",
  monthNumber?: number,
  year?: number
) => {
  try {
    const params = {
      pageIndex,
      filterCondition,
      ...(monthNumber && { month: monthNumber }),
      ...(year && { year }),
    };
    const { data } = await axiosAdminInstance.get("/admin/getOrders", {
      params,
    });
    return data;
  } catch (error) {
    throw handleAxiosError(error, "Failed to fetch orders");
  }
};
