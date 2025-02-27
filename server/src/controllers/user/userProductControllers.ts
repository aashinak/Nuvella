import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import getBanners from "../../usecases/user/banner/bannerData";
import getCategories from "../../usecases/user/product/getCategories";
import getProductByCategory from "../../usecases/user/product/getProductByCategory";
import ApiError from "../../utils/apiError";
import searchProductNames from "../../usecases/user/product/searchProductNames";
import getProductById from "../../usecases/user/product/getProductById";
import addToCart from "../../usecases/user/cart/addToCart";
import getAllCartItems from "../../usecases/user/cart/getAllCartItems";
import searchProductsByIds from "../../usecases/user/product/searchProductsByIds";
import initiatePayment from "../../usecases/user/order/initiatePayment";
import createOrderItems from "../../usecases/user/order/createOrderItems";
import createOrder from "../../usecases/user/order/createOrder";
import getCheckoutItemsByIds from "../../usecases/user/product/getCheckoutItemsById";
import getOrdersByUserId from "../../usecases/user/order/getOrdersByUserId";
import clearCart from "../../usecases/user/cart/clearCart";
import removeItemsFromCart from "../../usecases/user/cart/removeItemsFromCart";
import getOrderById from "../../usecases/user/order/getOrderById";
import cancelOrder from "../../usecases/user/order/cancelOrder";
import searchProductsByKeyword from "../../usecases/user/product/searchProductsByKeyword";

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

export const searchProductsByKeyController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let { searchKey, pageIndex } = req.query;

  // Validate query parameters
  if (typeof searchKey !== "string") {
    throw new ApiError(400, "Invalid or missing 'searchKey'");
  }

  const pageIndexNumber = parseInt(pageIndex as string, 10) || 1;

  // Fetch product names
  const productsData = await searchProductsByKeyword(
    searchKey,
    pageIndexNumber
  );

  // Send response
  res.status(200).json({
    message: productsData.message,
    products: productsData.products,
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

export const cancelOrderController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { orderId } = req.params;
  const userId = req.userId;
  const order = await cancelOrder(orderId, userId as string);

  res.status(200).json({
    message: order.message,
    refundId: order.refundId,
    success: true,
  });
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
  const userId = req.userId;

  const orderData = await getOrdersByUserId(userId as string);

  // Send response
  res.status(200).json({
    message: orderData.message,
    orders: orderData.orders,
    success: true,
  });
};

export const getOrderByIdController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;

  const orderData = await getOrderById(req.params.orderId, userId as string);

  // Send response
  res.status(200).json({
    message: orderData.message,
    orders: orderData.order,
    success: true,
  });
};
