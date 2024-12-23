import { Router } from "express";
import { AddEvent, getAllEvents, getOneEvent } from "../controllers/eventControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/uploads.js";

const eventRouter = Router();

eventRouter.post("/event", isAuthenticated, remoteUpload.array("image", 10), AddEvent);
eventRouter.get("/events", isAuthenticated, getAllEvents);
eventRouter.get("/event/:id", isAuthenticated, getOneEvent);

export default eventRouter;
