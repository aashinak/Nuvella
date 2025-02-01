import { NextFunction, Request, Response } from "express";
import getRecentlyAddedProducts from "../../usecases/user/statisticData/getRecentProducts";
import topSellingProducts from "../../usecases/user/statisticData/getTopSellingProducts";

export const getRecentProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const response = await getRecentlyAddedProducts();
  res.status(200).json({
    message: response.message,
    products: response.products,
    success: true,
  });
};

export const topSellingProductsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const response = await topSellingProducts();
  res.status(200).json({
    message: response.message,
    products: response.products,
    success: true,
  });
};
