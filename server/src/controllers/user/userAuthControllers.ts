import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import userRegistration from "../../usecases/user/auth/userRegistration";
import userLogin from "../../usecases/user/auth/userLogin";
import userRegistrationOtpVerification from "../../usecases/user/auth/userRegistrationOtpVerification";
import userLogout from "../../usecases/user/auth/userLogout";
import userTokenRegeneration from "../../usecases/user/auth/userTokenRegeneration";

export const userRegisterController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }
  const userAvatarLocalPath = req.file?.path as string;

  const { username, password, firstname, lastname, email, phone } = req.body;
  const response = await userRegistration({
    username,
    password,
    firstname,
    lastname,
    email,
    phone,
    avatar: userAvatarLocalPath,
  });
  res.status(200).json({
    message: response.message,
    user: response.savedUser,
    success: true,
  });
};

export const userRegisterationVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { otp, userId } = req.body;
  const response = await userRegistrationOtpVerification(+otp, userId);
  res.status(200).json({
    message: response.message,
    success: true,
  });
};

export const userLoginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { email, password } = req.body;
  const response = await userLogin(email, password);
  res.cookie("refreshToken", response.tokens.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  res.status(200).json({
    message: response.message,
    user: response.user,
    accessToken: response.tokens?.accessToken,
    success: true,
  });
};

export const userLogoutController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { refreshToken } = req.cookies;
  const response = await userLogout(refreshToken);

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({
    message: response.message,
    success: true,
  });
};

export const userTokenRegenController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { refreshToken } = req.cookies;
  const response = await userTokenRegeneration(refreshToken);

  res.status(200).json({
    message: response.message,
    user: response.user,
    accessToken: response.accessToken,
    success: true,
  });
};
