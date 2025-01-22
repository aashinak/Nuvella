import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import getUserAddress from "../../usecases/user/userData/getUserAddress";
import createUserAddress from "../../usecases/user/userData/createUserAddress";

export const getUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  const response = await getUserAddress(userId);
  res.json({ message: response.message, data: response.data });
};

export const createUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { userId } = req.params;
  const { address } = req.body;
  const response = await createUserAddress({ ...address, userId });
  res.json({ message: response.message });
};
