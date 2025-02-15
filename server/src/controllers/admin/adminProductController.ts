import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import ApiError from "../../utils/apiError";
import createCategory from "../../usecases/admin/productManagement/category/createCategory";
import updateCategory from "../../usecases/admin/productManagement/category/updateCategory";
import viewAllCategory from "../../usecases/admin/productManagement/category/viewAllCategory";
import deleteCategory from "../../usecases/admin/productManagement/category/deleteCategory";
import createProduct from "../../usecases/admin/productManagement/product/createProduct";
import getProductByCategory from "../../usecases/admin/productManagement/category/getProductByCategory";
import viewAllDiscounts from "../../usecases/admin/productManagement/discount/viewAllDiscounts";
import deleteDiscount from "../../usecases/admin/productManagement/discount/deleteDiscount";
import createDiscount from "../../usecases/admin/productManagement/discount/createDiscount";
import deleteProduct from "../../usecases/admin/productManagement/product/deleteProduct";
import getAllOrders from "../../usecases/admin/productManagement/order/getAllOrders";

//-------------------- Category Controllers ---------------------------

export const createCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const categoryImageLocalPath = req.file?.path as string;
  if (!categoryImageLocalPath) {
    throw new ApiError(400, "Category image required");
  }
  const { name } = req.body;
  const adminId = req.adminId as string;
  const response = await createCategory({
    name,
    categoryImageLocalPath,
  });
  if (!response) throw new ApiError(500, "Category creation failed");

  res.status(200).json({
    message: response.message,
    newCategory: response.newCategory,
    success: true,
  });
};

export const updateCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const categoryImageLocalPath = req.file?.path as string;
  const { name, categoryId } = req.body;
  const adminId = req.adminId as string;
  const response = await updateCategory({
    name,
    imageLocalPath: categoryImageLocalPath,
    categoryId,
    adminId,
  });
  if (!response) throw new ApiError(500, "Category updation failed");

  res.status(200).json({
    message: response.message,
    success: true,
  });
};

export const deleteCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }
  const { categoryId } = req.body;

  const response = await deleteCategory(categoryId);
  if (!response) throw new ApiError(500, "Category deletion failed");

  res.status(200).json({
    message: response.message,
    deletedProductCount: response.deletedProductsCount,
    success: true,
  });
};

export const getCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const response = await viewAllCategory();
  if (!response) throw new ApiError(500, "Categories fetch failed");

  res.status(200).json({
    message: response.message,
    success: true,
    data: response.categoryList,
  });
};

//-------------------- Product Controllers ---------------------------

export const createProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  // Check for product image files
  const productImageFiles = req.files as Express.Multer.File[]; // Type assertion
  if (!productImageFiles || productImageFiles.length === 0) {
    throw new ApiError(400, "Product image required");
  }

  // Extract paths from uploaded files
  const images = productImageFiles.map((file) => file.path);

  const data = req.body;
  let parsedSizes;
  if (data.sizes) {
    try {
      parsedSizes = JSON.parse(data.sizes);
    } catch (error) {
      throw new ApiError(400, "Sizes must be a valid JSON array");
    }

    // Validate parsed sizes
    if (!Array.isArray(parsedSizes) || parsedSizes.length === 0) {
      throw new ApiError(
        400,
        "Sizes must be an array with at least one size object"
      );
    }
  }

  const response = await createProduct({ ...data, images, sizes: parsedSizes });
  if (!response) throw new ApiError(500, "Product creation failed");

  res.status(200).json({
    message: response.message,
    newProduct: response.newProduct,
    success: true,
  });
};

export const deleteProductController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { productId } = req.params;
  const response = await deleteProduct(productId);
  if (!response) throw new ApiError(500, "Couldnt delete product");
  res.status(200).json({
    message: response.message,
    success: true,
  });
};

export const getProductByCategoryController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { categoryId } = req.params;
  const response = await getProductByCategory(categoryId);
  if (!response) throw new ApiError(500, "Couldnt fetch products");
  res.status(200).json({
    message: response.message,
    data: response.data,
    success: true,
  });
};

export const getProductsDiscountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const response = await viewAllDiscounts();
  if (!response) throw new ApiError(500, "Couldnt fetch discounts");
  res.status(200).json({
    message: response.message,
    data: response.data,
    success: true,
  });
};

export const deleteProductsDiscountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { discountId } = req.body;

  const response = await deleteDiscount(discountId);
  if (!response) throw new ApiError(500, "Couldnt delete discount");
  res.status(200).json({
    message: response.message,
    success: true,
  });
};

export const createProductsDiscountController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { name, discount_percentage } = req.body;

  const response = await createDiscount({ name, discount_percentage });
  if (!response) throw new ApiError(500, "Couldnt create discount");
  res.status(200).json({
    message: response.message,
    discount: response.discount,
    success: true,
  });
};

export const getAllOrdersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const pageIndex = parseInt(req.query.pageIndex as string) || 1;
  const filterCondition =
    (req.query.filterCondition as "today" | "month" | "year") || "today";

  const monthNumber = req.query.month
    ? parseInt(req.query.month as string)
    : undefined; // Optional
  const year = req.query.year ? parseInt(req.query.year as string) : undefined; // Optional

  const response = await getAllOrders(
    pageIndex,
    filterCondition,
    monthNumber,
    year
  );
  
  if (!response) throw new ApiError(500, "Couldnt fetch orders");
  res.status(200).json({
    message: response.message,
    orders: response.orders,
    success: true,
  });
};
