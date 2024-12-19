import { cookie } from "express-validator";

export const refreshTokenValidationRules = () => {
    return [
        // Validate that refreshToken is present in cookies
        cookie("refreshToken")
            .notEmpty()
            .withMessage("Refresh token is required"),
    ];
};
