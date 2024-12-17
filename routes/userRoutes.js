import { Router } from "express";
import { deleteProfile, login, profile, register, updateProfile } from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const userRouter = Router();

userRouter.post("/register", register)
userRouter.post("/login", login)
userRouter.get("/profile", isAuthenticated, profile)
userRouter.delete("/delete", isAuthenticated, deleteProfile)
userRouter.patch("/update", isAuthenticated, updateProfile)

export default userRouter