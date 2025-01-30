import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import getBanners from "../../usecases/user/banner/bannerData";
import getCategories from "../../usecases/user/product/getCategories";
import getProductByCategory from "../../usecases/user/product/getProductByCategory";
import ApiError from "../../utils/apiError";
import searchProductNames from "../../usecases/user/product/searchProductNames";
import getProductById from "../../usecases/user/product/getProductById";
import addToCart from "../../usecases/user/product/addToCart";
import getAllCartItems from "../../usecases/user/product/getAllCartItems";
import searchProductsByIds from "../../usecases/user/product/searchProductsByIds";
import initiatePayment from "../../usecases/user/product/initiatePayment";
import createOrderItems from "../../usecases/user/product/createOrderItems";
import createOrder from "../../usecases/user/product/createOrder";
import getCheckoutItemsByIds from "../../usecases/user/product/getCheckoutItemsById";
import getOrdersByUserId from "../../usecases/user/product/getOrdersByUserId";
import clearCart from "../../usecases/user/product/clearCart";
import removeItemsFromCart from "../../usecases/user/product/removeItemsFromCart";

export const getCategoriesController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const response = await getCategories();
  res.status(200).json({
    message: response.message,
    data: response.data,
    success: true,
  });
};

export const getProductByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { categoryId, pageIndex } = req.query;

  if (typeof categoryId !== "string") {
    throw new ApiError(400, "Invalid or missing categoryId");
  }

  const page = parseInt(pageIndex as string, 10) || 1;

  const response = await getProductByCategory(categoryId, page);
  res.status(200).json({
    message: response.message,
    data: response.data,
    success: true,
  });
};

export const getProductNameController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { categoryId, searchKey } = req.query;

  // Validate query parameters
  if (typeof searchKey !== "string") {
    throw new ApiError(400, "Invalid or missing 'searchKey'");
  }
  if (categoryId && typeof categoryId !== "string") {
    throw new ApiError(400, "Invalid 'categoryName'");
  }

  // Fetch product names
  const productNames = await searchProductNames({
    categoryId,
    searchKey,
  });

  // Send response
  res.status(200).json({
    message: "Product names fetched successfully",
    data: productNames.data,
    success: true,
  });
};

export const getProductByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { productId } = req.params;

  // Fetch product names
  const productData = await getProductById(productId);

  // Send response
  res.status(200).json({
    message: productData.message,
    data: productData.data,
    success: true,
  });
};

export const addToCartController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId, productId, size } = req.body;

  // Fetch product names
  const cartData = await addToCart(userId, productId, size);

  // Send response
  res.status(200).json({
    message: cartData.message,
    data: cartData.cart,
    success: true,
  });
};

export const getAllCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;

  // Fetch product names
  const cartData = await getAllCartItems(userId);

  // Send response
  res.status(200).json({
    message: cartData.message,
    data: cartData.cart,
    success: true,
  });
};

export const clearCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  const response = await clearCart(userId as string);

  // Send response
  res.status(200).json({
    message: response.message,
    success: true,
  });
};

export const removeCartItemController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  const response = await removeItemsFromCart(
    userId as string,
    req.params.cartId
  );

  // Send response
  res.status(200).json({
    message: response.message,
    cart: response.cart,
    success: true,
  });
};

export const searchProductsByIdsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { ids, userId } = req.body;

  const products = await searchProductsByIds(ids, userId);

  // Send response
  res.status(200).json({
    message: products.message,
    data: products.data,
    success: true,
  });
};

export const initiatePaymentController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { amount } = req.body;

  const products = await initiatePayment(amount);

  // Send response
  res.status(200).json({
    message: products.message,
    data: products.data,
    success: true,
  });
};

export const createOrderItemsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { orderItems } = req.body;

  const order = await createOrderItems(orderItems);

  // Send response
  res.status(200).json({
    message: order.message,
    items: order.items,
    totalAmount: order.totalAmount,
    paymentData: order.order,
    success: true,
  });
};

export const createOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { orderData } = req.body;

  const order = await createOrder(orderData);
  if (order.order) {
    res.status(200).json({
      message: order.message,
      order: order.order,
      success: true,
    });
  } else {
    res.status(200).json({
      message: order.message,
      success: true,
    });
  }
};

export const getCheckoutItemsByIdsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const ids = req.params.ids
    .split(" ")
    .map((id) => id.trim())
    .filter((id) => id);

  const products = await getCheckoutItemsByIds(ids);

  // Send response
  res.status(200).json({
    message: products.message,
    data: products.data,
    success: true,
  });
};

export const getOrderItemsByUserIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.params.userId;

  const orderData = await getOrdersByUserId(userId);

  // Send response
  res.status(200).json({
    message: orderData.message,
    orders: orderData.orders,
    success: true,
  });
};
