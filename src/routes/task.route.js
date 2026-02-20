import express from "express";

import { createTask, viewAllTask, viewTaskById, deleteTaskById, updateTaskById } from "../controllers/task.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/create", protectRoute, createTask)
router.get("/veiwAll", protectRoute, viewAllTask)
router.get("/:id", protectRoute, viewTaskById);
router.delete("/:id", protectRoute, deleteTaskById);
router.patch("/:id", protectRoute, updateTaskById);

export default router;