import handleAxiosError from "@/api/handleAxiosError";
import userAxiosInstance from "@/axios/userAxiosInstance";
import { IExtendedOrder } from "@/entities/user/IOrder";
import { IMinimalOrderItem } from "@/entities/user/IOrderItem";

export const getCategories = async () => {
  try {
    const response = await userAxiosInstance.get("/user/getCategories");
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch categories.");
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
  } catch (error) {
    handleAxiosError(error, "Failed to fetch products.");
  }
};

export const getProductNames = async (
  searchKey: string,
  categoryId: string = "",
  

) => {
  try {
    const url =
      categoryId.length > 0
        ? `/user/search/keyword?categoryId=${categoryId}&searchKey=${searchKey}`
        : `/user/search/keyword?searchKey=${searchKey}`;

    const response = await userAxiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch product names.");
  }
};

export const searchProductsByKeyword = async (
  searchKey: string,
  pageIndex: number = 1
) => {
  try {
    const url = `/user/search/products/keyword?searchKey=${searchKey}&pageIndex=${pageIndex}`;

    const response = await userAxiosInstance.get(url);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch products.");
  }
};

export const getProductById = async (productId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/getProductById/${productId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch product data.");
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
  } catch (error) {
    handleAxiosError(error, "Failed to add item to cart.");
  }
};

export const getAllCartItems = async (userId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/getAllCartItems/${userId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch cart items.");
  }
};

export const clearCart = async () => {
  try {
    const response = await userAxiosInstance.delete(`/user/clearCartItem`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to clear cart items.");
  }
};

export const removeCartItem = async (cartId: string) => {
  try {
    const response = await userAxiosInstance.delete(
      `/user/removeCartItem/${cartId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to remove cart item.");
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
  } catch (error) {
    handleAxiosError(error, "Failed to fetch products.");
  }
};

export const getCheckoutItemsByIds = async (ids: string[]) => {
  try {
    const encodedIds = encodeURIComponent(ids.join(" "));
    const response = await userAxiosInstance.get(
      `/user/checkoutItems/${encodedIds}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch products.");
  }
};

export const getUserAddresses = async () => {
  try {
    const response = await userAxiosInstance.get(`/user/getUserAddresses`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch addresses.");
  }
};

// create order

export const createOrderItems = async (orderItems: IMinimalOrderItem[]) => {
  try {
    const response = await userAxiosInstance.post(`/user/createOrderItems`, {
      orderItems,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to create order items.");
  }
};

export const createOrder = async (orderData: IExtendedOrder) => {
  try {
    const response = await userAxiosInstance.post(`/user/createOrder`, {
      orderData,
    });
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to create order.");
  }
};

export const cancelOrder = async (orderId: string) => {
  try {
    const response = await userAxiosInstance.put(
      `/user/cancelOrder/${orderId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to cancel order.");
  }
};

export const getOrders = async () => {
  try {
    const response = await userAxiosInstance.get(`/user/getOrders`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch orders.");
  }
};

export const getOrder = async (orderDocId: string) => {
  try {
    const response = await userAxiosInstance.get(
      `/user/getOrder/${orderDocId}`
    );
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch order.");
  }
};

export const getNewProducts = async () => {
  try {
    const response = await userAxiosInstance.get(`/user/getNewProducts`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch products.");
  }
};

export const getTopSellingProducts = async () => {
  try {
    const response = await userAxiosInstance.get(`/user/topSellingProducts`);
    return response.data;
  } catch (error) {
    handleAxiosError(error, "Failed to fetch products.");
  }
};
