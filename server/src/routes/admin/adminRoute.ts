import { Router } from "express";
import asyncHandler from "../../utils/asyncHandler";
import {
  adminCreationRequestController,
  adminCreationRequestVerificationController,
  adminExistsController,
  adminLoginController,
  adminLogoutController,
  adminOtpVerificationController,
  adminTokensRegenerationController,
} from "../../controllers/admin/adminAuthController";
import { createRateLimiter } from "../../middlewares/rateLimiter";
import { adminIdValidationRules } from "../../validators/admin/adminCheckValidator";
import { adminLoginValidationRules } from "../../validators/admin/adminLoginValidator";
import { adminOtpVerificationValidationRules } from "../../validators/admin/adminOtpValidator";
import { refreshTokenValidationRules } from "../../validators/admin/adminRefreshTokenValidator";
import { adminCreationRequestValidationRules } from "../../validators/admin/adminCreationRequestValidator";
import { adminCreationRequestValidatorValidationRules } from "../../validators/admin/adminCreationRequestValidationValidator";
import { isAuthenticated } from "../../middlewares/adminAuthMiddleware";
import { uiUpdateValidationRules } from "../../validators/admin/uiUpdateValidationRules";
import upload from "../../utils/multer";
import {
  getUiUpdateController,
  uiUpdateController,
  uiUpdateDeleteController,
} from "../../controllers/admin/adminCommonControllers";
import { uiUpdateDeleteValidationRules } from "../../validators/admin/uiUpdateDeleteValidator";
import { categoryCreationValidationRules } from "../../validators/admin/categoryValidator";
import {
  createCategoryController,
  createProductController,
  deleteCategoryController,
  getCategoryController,
  getProductByCategoryController,
  updateCategoryController,
} from "../../controllers/admin/adminProductController";
import { categoryUpdationValidationRules } from "../../validators/admin/categoryUpdateValidator";
import { categoryDeletionValidationRules } from "../../validators/admin/categoryDeleteValidator";
import { productValidationRules } from "../../validators/admin/productValidator";
import { validateCategoryId } from "../../validators/admin/getProductByCategoryValidator";

export const router = Router();

router.post(
  "/adminExist",
  createRateLimiter({ max: 30 }),
  adminIdValidationRules(),
  asyncHandler(adminExistsController)
);

router.post(
  "/login",
  createRateLimiter({ max: 5 }),
  adminLoginValidationRules(),
  asyncHandler(adminLoginController)
);

router.post(
  "/adminOtpVerification",
  createRateLimiter({ max: 5 }),
  adminOtpVerificationValidationRules(),
  asyncHandler(adminOtpVerificationController)
);

router.post(
  "/adminTokenRegen",
  createRateLimiter({ max: 20 }),
  refreshTokenValidationRules(),
  asyncHandler(adminTokensRegenerationController)
);

router.post(
  "/adminLogout",
  createRateLimiter({ max: 5 }),
  isAuthenticated,
  refreshTokenValidationRules(),
  asyncHandler(adminLogoutController)
);

router.post(
  "/adminCreationRequest",
  createRateLimiter({ max: 3 }),
  isAuthenticated,
  adminCreationRequestValidationRules(),
  asyncHandler(adminCreationRequestController)
);

router.post(
  "/adminCreationRequestValidation",
  isAuthenticated,
  createRateLimiter({ max: 3 }),
  adminCreationRequestValidatorValidationRules(),
  asyncHandler(adminCreationRequestVerificationController)
);

router.post(
  "/uiUpdate",
  isAuthenticated,
  createRateLimiter({ max: 30 }),
  upload.single("heroImage"),
  uiUpdateValidationRules(),
  asyncHandler(uiUpdateController)
);

router.get(
  "/getUiUpdates",
  createRateLimiter({ max: 80 }),
  isAuthenticated,
  asyncHandler(getUiUpdateController)
);

router.patch(
  "/uiUpdateDelete",
  createRateLimiter({ max: 40 }),
  isAuthenticated,
  uiUpdateDeleteValidationRules(),
  asyncHandler(uiUpdateDeleteController)
);

router.post(
  "/createCategory",
  createRateLimiter({ max: 40 }),
  isAuthenticated,
  upload.single("categoryImage"),
  categoryCreationValidationRules(),
  asyncHandler(createCategoryController)
);

router.patch(
  "/updateCategory",
  createRateLimiter({ max: 40 }),
  isAuthenticated,
  upload.single("categoryImage"),
  categoryUpdationValidationRules(),
  asyncHandler(updateCategoryController)
);

router.get(
  "/getAllCategories",
  createRateLimiter({ max: 80 }),
  isAuthenticated,
  asyncHandler(getCategoryController)
);

router.patch(
  "/deleteCategory",
  createRateLimiter({ max: 20 }),
  isAuthenticated,
  categoryDeletionValidationRules(),
  asyncHandler(deleteCategoryController)
);

router.post(
  "/createProduct",
  createRateLimiter({ max: 30 }),
  isAuthenticated,
  upload.array("images"),
  productValidationRules(),
  asyncHandler(createProductController)
);

router.get(
  "/getProductsByCategory/:categoryId",
  createRateLimiter({ max: 80 }),
  isAuthenticated,
  validateCategoryId(),
  asyncHandler(getProductByCategoryController)
);
