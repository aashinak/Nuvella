import jwt from "jsonwebtoken";
import logger from "./logger";
import ApiError from "./apiError";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

type roles = "USER" | "ADMIN"

 class tokenService {
    async generateAccessToken(id: string, role: roles = "USER", expiry: string = "15m"): Promise<string> {
        return await jwt.sign({ id, role }, ACCESS_TOKEN_SECRET, {
            expiresIn: expiry,
        });
    }

    async generateRefreshToken(id: string, role: roles = "USER", expiry: string = "7d"): Promise<string> {
        return await jwt.sign({ id, role }, REFRESH_TOKEN_SECRET, {
            expiresIn: expiry,
        });
    }

    async verifyRefreshToken(token: string): Promise<any> {
        try {
            return await jwt.verify(token, REFRESH_TOKEN_SECRET);
        } catch (error: any) {
            logger.warn(
                `Invalid signature or related error ::: ${error.message}`
            );
            throw new ApiError(400, "Invalid token");
        }
    }
}

export default new tokenService()