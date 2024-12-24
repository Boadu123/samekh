import { Router } from "express";
import {
  AddContact,
  deleteAllContacts,
  deleteContact,
  getAllContact,
  getOneContact,
} from "../controllers/contactContollers.js";
import { isAuthenticated } from "../middlewares/auth.js";

const contactRouter = Router();

contactRouter.post("/contact", AddContact);
contactRouter.get("/contact", isAuthenticated, getAllContact);
contactRouter.get("/contact/:id", isAuthenticated, getOneContact);
contactRouter.delete("/contact/:id", isAuthenticated, deleteContact);
contactRouter.delete("/contact", isAuthenticated, deleteAllContacts);

export default contactRouter;
