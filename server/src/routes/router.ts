import { Router } from "express";
import { router as userRoute } from "./user/userRoute"; // Import user route
import { router as adminRoute } from "./admin/adminRoute"; // Import admin route

const router = Router();

// Define the base route for user
router.use("/", userRoute);

// Define the base route for admin
router.use("/admin", adminRoute);

router.get("/ping", (req, res) => {
  res.json({ message: "Pong!!" });
});

export default router;
