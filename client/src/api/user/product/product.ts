import userAxiosInstance from "@/axios/userAxiosInstance";
import { IExtendedOrder } from "@/entities/user/IOrder";
import { IMinimalOrderItem } from "@/entities/user/IOrderItem";

// Utility function for logging errors
const logError = (error: any) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Detailed Error:", error);
  } else {
    console.error("An error occurred.");
  }
};

export const getCategories = async () => {
  try {
    const response = await userAxiosInstance.get("/user/getCategories");
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch categories.",
      details: error.response?.data || error.message,
    };
  }
};

export const getProductByCategory = async (
  categoryId: string,
  pageIndex: number = 1
) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/search/category?categoryId=${categoryId}&pageIndex=${pageIndex}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch products.",
      details: error.response?.data || error.message,
    };
  }
};

export const getProductNames = async (
  categoryId: string = "",
  searchKey: string
) => {
  try {
    const url =
      categoryId.length > 0
        ? `/user/search/keyword?categoryId=${categoryId}&searchKey=${searchKey}`
        : `/user/search/keyword?searchKey=${searchKey}`;

    const response = await userAxiosInstance.get(url);
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch product names.",
      details: error.response?.data || error.message,
    };
  }
};

export const getProductById = async (productId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/getProductById/${productId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch product data.",
      details: error.response?.data || error.message,
    };
  }
};

////////////////////// cart routes
export const addToCart = async (
  userId: string,
  productId: string,
  size: string
) => {
  try {
    const response = await userAxiosInstance.post(`/user/addToCart`, {
      productId,
      userId,
      size,
    });
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to add item to cart.",
      details: error.response?.data || error.message,
    };
  }
};

export const getAllCartItems = async (userId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/getAllCartItems/${userId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to fetch cart items.",
      details: error.response?.data || error.message,
    };
  }
};

export const clearCart = async () => {
  try {
    const response = await userAxiosInstance.delete(`/user/clearCartItem`);
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to clear cart items.",
      details: error.response?.data || error.message,
    };
  }
};

export const removeCartItem = async (cartId: string) => {
  try {
    const response = await userAxiosInstance.delete(
      `/user/removeCartItem/${cartId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);
    // Provide a standardized error response
    throw {
      message: "Failed to remove cart item.",
      details: error.response?.data || error.message,
    };
  }
};
//////////////

export const getOrderItemsByIds = async (ids: string[], userId: string) => {
  try {
    const response = await userAxiosInstance.post(`/user/searchProductByIds`, {
      ids,
      userId,
    });
    return response.data;
  } catch (error: any) {
    logError(error);
    throw {
      message: "Failed to fetch products.",
      details: error.response?.data || error.message,
    };
  }
};

export const getCheckoutItemsByIds = async (ids: string[]) => {
  try {
    const encodedIds = encodeURIComponent(ids.join(" "));
    const response = await userAxiosInstance.get(
      `/user/checkoutItems/${encodedIds}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to fetch products.",
      details: error.response?.data || error.message,
    };
  }
};

export const getUserAddresses = async (userId: string) => {
  try {
    const response = await userAxiosInstance.get(`/user/getUserAddresses`);
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to fetch addresses.",
      details: error.response?.data || error.message,
    };
  }
};

// create order

export const createOrderItems = async (orderItems: IMinimalOrderItem[]) => {
  try {
    const response = await userAxiosInstance.post(`/user/createOrderItems`, {
      orderItems,
    });
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to create order items.",
      details: error.response?.data || error.message,
    };
  }
};

export const createOrder = async (orderData: IExtendedOrder) => {
  try {
    const response = await userAxiosInstance.post(`/user/createOrder`, {
      orderData,
    });
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to create order.",
      details: error.response?.data || error.message,
    };
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const response = await userAxiosInstance.put(
      `/user/cancelOrder/${orderId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to cancel order.",
      details: error.response?.data || error.message,
    };
  }
};

export const getOrders = async (userId: string) => {
  try {
    const response = await userAxiosInstance.get(`/user/getOrders`);
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to fetch orders.",
      details: error.response?.data || error.message,
    };
  }
};

export const getOrder = async (orderDocId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/getOrder/${orderDocId}`
    );
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to fetch order.",
      details: error.response?.data || error.message,
    };
  }
};

export const getNewProducts = async () => {
  try {
    const response = await userAxiosInstance.get(`/user/getNewProducts`);
    return response.data;
  } catch (error: any) {
    logError(error);

    throw {
      message: "Failed to fetch products.",
      details: error.response?.data || error.message,
    };
  }
};
