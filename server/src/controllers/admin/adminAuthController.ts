import { NextFunction, Request, Response } from "express";
import ApiError from "../../utils/apiError";
import isAdminExists from "../../usecases/admin/auth/isAdminExists";
import validationErrorHandler from "../../utils/validationErrorHandler";
import adminLogin from "../../usecases/admin/auth/adminLogin";
import adminOtpVerification from "../../usecases/admin/auth/adminOtpVerification";
import { validationResult } from "express-validator";
import adminRegenTokens from "../../usecases/admin/auth/adminRegenTokens";
import adminLogout from "../../usecases/admin/auth/adminLogout";
import adminCreationRequest from "../../usecases/admin/auth/adminCreationRequest";
import adminCreationRequestVerification from "../../usecases/admin/auth/adminCreationRequestVerification";

export const adminExistsController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { adminId } = req.body;

  const response = await isAdminExists(adminId);
  if (!response) {
    throw new ApiError(400, "Invalid admin info");
  }

  res.status(200).json({ message: "Admin exists", success: true });
};

export const adminLoginController = async (
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
  const response = await adminLogin({ email, password });
  res
    .status(200)
    .json({ message: response.message, admin: response.admin, success: true });
};

export const adminOtpVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }
  const { adminId, otp } = req.body;
  const response = await adminOtpVerification({ adminId, otp });
  res.cookie("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });
  res.status(200).json({
    message: response.message,
    admin: response.sanitizedAdmin,
    accessToken: response.accessToken,
    success: true,
  });
};

export const adminTokensRegenerationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const refreshToken = req.cookies.refreshToken;
  const response = await adminRegenTokens(refreshToken);

  res.cookie("refreshToken", response.refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });

  res.status(200).json({
    message: response.message,
    admin: response.admin,
    accessToken: response.accessToken,
    success: true,
  });
};

export const adminLogoutController = async (
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
  const response = await adminLogout(refreshToken);
  if (!response) throw new ApiError(500, "Logout failed");
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

export const adminCreationRequestController = async (
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
  const { email, name, password } = req.body;
  const response = await adminCreationRequest({
    refreshToken,
    name,
    email,
    password,
  });
  if (!response) throw new ApiError(500, "Admin createion failed");

  res.status(200).json({
    message: response.message,
    createdAdmin: response.createdAdmin,
    success: true,
  });
};

export const adminCreationRequestVerificationController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }

  const { otp1, otp2, newAdminsId } = req.body;
  const adminId = req.adminId as string;

  const response = await adminCreationRequestVerification({
    otp1,
    otp2,
    newAdminsId,
    adminId,
  });
  if (!response) throw new ApiError(500, "Admin creation verification failed");

  res.status(200).json({
    message: response.message,
    success: true,
  });
};
