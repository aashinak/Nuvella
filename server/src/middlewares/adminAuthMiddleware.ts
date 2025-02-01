import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import ApiError from "../utils/apiError";
import tokenService from "../utils/tokenService";

declare global {
  namespace Express {
    interface Request {
      adminId?: string; // Add custom properties here
    }
  }
}

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Access token is expected in cookies
  const token = req.headers["authorization"]?.split(" ")[1];

  

  try {
    if (!token) {
      logger.info("Authentication failed: No token provided");
      throw new ApiError(401, "Unauthorized: No token provided");
    }
    const decodedToken = await tokenService.verifyAccessToken(token);
    if (decodedToken.role !== "ADMIN") {
      throw new ApiError(401, "Unauthorized access");
    }
    req.adminId = decodedToken.id; // Assign userId

    logger.info(
      `Authentication successful for user: ${JSON.stringify(req.adminId)}`
    );
    next();
  } catch (error) {
    logger.error("Authentication failed: Invalid or expired token", { error });
    res.status(401).json({ message: "Unauthorized: Invalid or expired token" });
  }
};
