import express from "express";
import { createContact } from "../controller/contact/create.js";
import { getAllContact } from "../controller/contact/getAll.js";
import { getContactById } from "../controller/contact/getById.js";
import { deleteContact } from "../controller/contact/delete.js";

const router = express.Router();

router.post("/contacts", createContact);
router.get("/contacts", getAllContact);
router.get("/contacts/:id", getContactById);
router.delete("/contacts/:id", deleteContact);
export default router;
