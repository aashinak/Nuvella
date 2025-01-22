import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import getBanners from "../../usecases/user/banner/bannerData";

export const getBannersController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const response = await getBanners();
  res.status(200).json({
    message: response.message,
    data: response.data,
    success: true,
  });
};
