import { Router } from "express";
import { AddContact } from "../controllers/contactContollers.js";

const contactRouter = Router();

contactRouter.post("/contact", AddContact)

export default contactRouter