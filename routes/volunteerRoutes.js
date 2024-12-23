import { Router } from "express";
import {
  deleteVolunteer,
  getAllVolunteers,
  getOneVolunteer,
  signUpVolunteer,
} from "../controllers/volunteerControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const volunteerRouter = Router();

volunteerRouter.post("/volunteer", signUpVolunteer);
volunteerRouter.get("/volunteer", isAuthenticated, getAllVolunteers);
volunteerRouter.get("/volunteer/:id", isAuthenticated, getOneVolunteer);
volunteerRouter.delete("/volunteer/:id", isAuthenticated, deleteVolunteer);

export default volunteerRouter;
