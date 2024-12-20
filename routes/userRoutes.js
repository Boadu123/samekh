import { Router } from "express";
import {
  changeEmail,
  changePassword,
  deleteProfile,
  generateOTP,
  login,
  profile,
  register,
  resetPassword,
  updateProfile,
  verifyOTP,
} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/profile", isAuthenticated, profile);
userRouter.delete("/delete", isAuthenticated, deleteProfile);
userRouter.patch("/update", isAuthenticated, updateProfile);
userRouter.patch("/update/email", isAuthenticated, changeEmail);
userRouter.patch("/update/password", isAuthenticated, changePassword);
userRouter.post("/generateOTP", generateOTP);
userRouter.post("/verifyOTP", verifyOTP);
userRouter.post("/passwordReset", resetPassword);

export default userRouter;
