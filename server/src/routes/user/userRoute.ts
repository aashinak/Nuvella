import { Router } from "express";
import { createRateLimiter } from "../../middlewares/rateLimiter";
import { userRegistrationValidationRules } from "../../validators/user/userRegistrationValidator";
import asyncHandler from "../../utils/asyncHandler";
import {
  userLoginController,
  userLogoutController,
  userRegisterationVerificationController,
  userRegisterController,
  userTokenRegenController,
} from "../../controllers/user/userAuthControllers";
import upload from "../../utils/multer";
import { userLoginValidationRules } from "../../validators/user/userLoginValidator";
import { userRegOtpValidationRules } from "../../validators/user/userRegOtpVerification";
import { getBannersController } from "../../controllers/user/userUiContentsControllers";
import {
  addToCartController,
  cancelOrderController,
  clearCartItemController,
  createOrderController,
  createOrderItemsController,
  getAllCartItemController,
  getCategoriesController,
  getCheckoutItemsByIdsController,
  getOrderByIdController,
  getOrderItemsByUserIdController,
  getProductByCategoryController,
  getProductByIdController,
  getProductNameController,
  initiatePaymentController,
  removeCartItemController,
  searchProductsByIdsController,
} from "../../controllers/user/userProductControllers";
import { addToCartValidationRules } from "../../validators/user/addToCartValidator";
import {
  createUserAddressController,
  deleteUserAddressController,
  fetchUserDataController,
  getUserAddressController,
  updateUserAddressController,
  updateUserDataController,
} from "../../controllers/user/userDataController";
import { isUserAuthenticated } from "../../middlewares/userAuthMiddleware";
import { getRecentProductsController } from "../../controllers/user/productStatisticController";

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
/////////////////////// cart routes
router.post(
  "/addToCart",
  createRateLimiter({ max: 100 }),
  isUserAuthenticated,
  addToCartValidationRules,
  asyncHandler(addToCartController)
);

router.get(
  "/getAllCartItems/:userId",
  createRateLimiter({ max: 100 }),
  isUserAuthenticated,
  addToCartValidationRules,
  asyncHandler(getAllCartItemController)
);

router.delete(
  "/clearCartItem",
  createRateLimiter({ max: 100 }),
  isUserAuthenticated,
  asyncHandler(clearCartItemController)
);

router.delete(
  "/removeCartItem/:cartId",
  createRateLimiter({ max: 100 }),
  isUserAuthenticated,
  asyncHandler(removeCartItemController)
);

///////////////////////// checkout routes

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
  isUserAuthenticated,
  asyncHandler(createOrderItemsController)
);

router.post(
  "/createOrder",
  createRateLimiter({ max: 20 }),
  isUserAuthenticated,
  asyncHandler(createOrderController)
);

router.put(
  "/cancelOrder/:orderId",
  createRateLimiter({ max: 20 }),
  isUserAuthenticated,
  asyncHandler(cancelOrderController)
);

router.get(
  "/checkoutItems/:ids",
  createRateLimiter({ max: 50 }),
  asyncHandler(getCheckoutItemsByIdsController)
);

/////////////////////////// user data routes

router.get(
  "/getUserAddresses",
  createRateLimiter({ max: 50 }),
  isUserAuthenticated,
  asyncHandler(getUserAddressController)
);

router.post(
  "/createUserAddress",
  createRateLimiter({ max: 50 }),
  isUserAuthenticated,
  asyncHandler(createUserAddressController)
);

router.put(
  "/editUserAddress",
  createRateLimiter({ max: 50 }),
  isUserAuthenticated,
  asyncHandler(updateUserAddressController)
);

router.delete(
  "/deleteUserAddress/:addressId",
  createRateLimiter({ max: 60 }),
  isUserAuthenticated,
  asyncHandler(deleteUserAddressController)
);

router.post(
  "/logout",
  createRateLimiter({ max: 5 }),
  asyncHandler(userLogoutController)
);

router.get(
  "/getUserData",
  createRateLimiter({ max: 100 }),
  isUserAuthenticated,
  asyncHandler(fetchUserDataController)
);

router.post(
  "/updateUserData",
  createRateLimiter({ max: 30 }),
  isUserAuthenticated,
  asyncHandler(updateUserDataController)
);

router.post(
  "/userTokenRegen",
  createRateLimiter({ max: 60 }),
  asyncHandler(userTokenRegenController)
);

///////////////////////////////////////////////

router.get(
  "/getOrders",
  createRateLimiter({ max: 60 }),
  isUserAuthenticated,
  asyncHandler(getOrderItemsByUserIdController)
);

router.get(
  "/getOrder/:orderId",
  createRateLimiter({ max: 60 }),
  isUserAuthenticated,
  asyncHandler(getOrderByIdController)
);

////////////////////product statistic
router.get(
  "/getNewProducts",
  createRateLimiter({ max: 100 }),
  asyncHandler(getRecentProductsController)
);
