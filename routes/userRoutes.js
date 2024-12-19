import { Router } from "express";
import { changeEmail, deleteProfile, login, profile, register, updateProfile } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/profile", isAuthenticated, profile)
userRouter.delete("/delete", isAuthenticated, deleteProfile)
userRouter.patch("/update", isAuthenticated, updateProfile)
userRouter.patch("/update/email", isAuthenticated, changeEmail)

export default userRouter