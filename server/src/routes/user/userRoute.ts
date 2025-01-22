import { Router } from "express";
import { createRateLimiter } from "../../middlewares/rateLimiter";
import { userRegistrationValidationRules } from "../../validators/user/userRegistrationValidator";
import asyncHandler from "../../utils/asyncHandler";
import {
  userLoginController,
  userRegisterationVerificationController,
  userRegisterController,
} from "../../controllers/user/userAuthControllers";
import upload from "../../utils/multer";
import { userLoginValidationRules } from "../../validators/user/userLoginValidator";
import { userRegOtpValidationRules } from "../../validators/user/userRegOtpVerification";
import { getBannersController } from "../../controllers/user/userUiContentsControllers";
import {
  addToCartController,
  createOrderController,
  createOrderItemsController,
  getAllCartItemController,
  getCategoriesController,
  getCheckoutItemsByIdsController,
  getProductByCategoryController,
  getProductByIdController,
  getProductNameController,
  initiatePaymentController,
  searchProductsByIdsController,
} from "../../controllers/user/userProductControllers";
import { addToCartValidationRules } from "../../validators/user/addToCartValidator";
import { createUserAddressController, getUserAddressController } from "../../controllers/user/userDataController";

export const router = Router();

router.post(
  "/register",
  createRateLimiter({ max: 6 }),
  upload.single("avatar"),
  userRegistrationValidationRules,
  asyncHandler(userRegisterController)
);

router.post(
  "/userVerification",
  createRateLimiter({ max: 6 }),
  userRegOtpValidationRules,
  asyncHandler(userRegisterationVerificationController)
);

router.post(
  "/login",
  createRateLimiter({ max: 3 }),
  userLoginValidationRules,
  asyncHandler(userLoginController)
);

router.get(
  "/getBanners",
  createRateLimiter({ max: 100 }),
  asyncHandler(getBannersController)
);

router.get(
  "/getCategories",
  createRateLimiter({ max: 100 }),
  asyncHandler(getCategoriesController)
);

router.get(
  "/search/category",
  createRateLimiter({ max: 100 }),
  asyncHandler(getProductByCategoryController)
);

router.get(
  "/search/keyword",
  createRateLimiter({ max: 100 }),
  asyncHandler(getProductNameController)
);

router.get(
  "/getProductById/:productId",
  createRateLimiter({ max: 100 }),
  asyncHandler(getProductByIdController)
);

router.post(
  "/addToCart",
  createRateLimiter({ max: 100 }),
  addToCartValidationRules,
  asyncHandler(addToCartController)
);

router.get(
  "/getAllCartItems/:userId",
  createRateLimiter({ max: 100 }),
  addToCartValidationRules,
  asyncHandler(getAllCartItemController)
);

router.post(
  "/searchProductByIds",
  createRateLimiter({ max: 50 }),
  asyncHandler(searchProductsByIdsController)
);

router.post(
  "/initiatePayment",
  createRateLimiter({ max: 6 }),
  asyncHandler(initiatePaymentController)
);

router.post(
  "/createOrderItems",
  createRateLimiter({ max: 20 }),
  asyncHandler(createOrderItemsController)
);

router.post(
  "/createOrder",
  createRateLimiter({ max: 20 }),
  asyncHandler(createOrderController)
);

router.get(
  "/checkoutItems/:ids",
  createRateLimiter({ max: 50 }),
  asyncHandler(getCheckoutItemsByIdsController)
);

// user data routes
router.get(
  "/getUserAddresses/:userId",
  createRateLimiter({ max: 50 }),
  asyncHandler(getUserAddressController)
);

router.post(
  "/createUserAddress/:userId",
  createRateLimiter({ max: 50 }),
  asyncHandler(createUserAddressController)
);
