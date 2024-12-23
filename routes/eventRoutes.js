import { Router } from "express";
import { AddEvent, deleteEvent, getAllEvents, getOneEvent, updateEvent } from "../controllers/eventControllers.js";
import { isAuthenticated } from "../middlewares/auth.js";
import { remoteUpload } from "../middlewares/uploads.js";

const eventRouter = Router();

eventRouter.post("/event", isAuthenticated, remoteUpload.array("image", 10), AddEvent);
eventRouter.get("/events", isAuthenticated, getAllEvents);
eventRouter.get("/event/:id", isAuthenticated, getOneEvent);
eventRouter.patch("/event/update/:id", isAuthenticated, remoteUpload.array("image", 10), updateEvent);
eventRouter.delete("/event/delete/:id", isAuthenticated, deleteEvent);

export default eventRouter;
