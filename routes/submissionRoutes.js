import express from "express";
import { submitEntry } from "../controllers/submissionController.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/submit", upload.single("file"), submitEntry);

export default router;
