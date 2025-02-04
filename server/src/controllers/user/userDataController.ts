import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import getUserAddress from "../../usecases/user/userData/getUserAddress";
import createUserAddress from "../../usecases/user/userData/createUserAddress";
import fetchUserData from "../../usecases/user/userData/fetchUserData";
import updateUserData from "../../usecases/user/userData/updateUserData";
import deleteUserAddress from "../../usecases/user/userData/deleteUserAddress";
import updateUserAddress from "../../usecases/user/userData/editUserAddress";

export const getUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  const response = await getUserAddress(userId as string);
  res.json({ message: response.message, data: response.data });
};

export const createUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  const { address } = req.body;
  const response = await createUserAddress({ ...address, userId });
  res.json({ message: response.message, address: response.address });
};

export const updateUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId;
  const { addressId, updateData } = req.body;
  const response = await updateUserAddress(
    updateData,
    userId as string,
    addressId
  );
  res.json({ message: response.message });
};

export const deleteUserAddressController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { addressId } = req.params;
  const userId = req.userId;
  const response = await deleteUserAddress(addressId, userId as string);
  res.json({ message: response.message });
};

export const fetchUserDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId as string;
  const response = await fetchUserData(userId);
  res.json({ message: response.message, user: response.user });
};

export const updateUserDataController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userId = req.userId as string;
  const avatar = req.file?.path as string;
  const { firstname, lastname, phone } = req.body;
  const response = await updateUserData(userId, {
    avatar,
    firstname,
    lastname,
    phone,
  });
  res.json({ message: response.message, user: response.user });
};
