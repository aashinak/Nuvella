import { Router } from "express";
import { router as userRoute } from "./user/userRoute"; // Import user route
import { router as adminRoute } from "./admin/adminRoute"; // Import admin route
import hashService from "../utils/hashService";

const router = Router();

// Define the base route for user
router.use("/user", userRoute);

// Define the base route for admin
router.use("/admin", adminRoute);

router.get("/ping", async (req, res) => {
  res.json({ message: "Pong!!!" });
});

export default router;
