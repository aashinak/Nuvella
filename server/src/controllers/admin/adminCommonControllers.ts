import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import validationErrorHandler from "../../utils/validationErrorHandler";
import ApiError from "../../utils/apiError";
import uiUpdate from "../../usecases/admin/uiUpdate/uiUpdate";
import getUiUpdate from "../../usecases/admin/uiUpdate/getUiUpdates";
import deleteUiUpdate from "../../usecases/admin/uiUpdate/deleteUiUpdate";

export const uiUpdateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }
  const heroImageLocalPath = req.file?.path as string;
  if (!heroImageLocalPath) {
    throw new ApiError(400, "Banner image required");
  }
  const { heroText, subText1, subText2 } = req.body;
  const response = await uiUpdate({
    heroImageLocalPath,
    heroText,
    subText1,
    subText2,
  });
  if (!response) throw new ApiError(500, "Ui update failed");

  res.status(200).json({
    message: response.message,
    success: true,
    data: response.uiUpdate,
  });
};

export const getUiUpdateController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const response = await getUiUpdate();
  res
    .status(200)
    .json({ message: response.message, success: true, data: response.data });
};

export const uiUpdateDeleteController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    validationErrorHandler(errors.array());
  }
  const { updateId } = req.body;
  const response = await deleteUiUpdate(updateId);
  res.status(200).json({ message: response.message, success: true });
};
