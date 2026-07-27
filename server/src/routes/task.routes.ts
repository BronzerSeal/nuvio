import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { io } from "../server.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { ForbiddenError } from "../errors/ForbiddenError.js";
import { validate } from "../middleware/validate.middleware.js";
import { taskValidation } from "../validate/index.js";
import { taskController } from "../controllers/index.js";

const router = Router();

// POST /task/new-task
router.post(
  "/new-task",
  authMiddleware,
  validate({
    body: taskValidation.createTaskSchema,
  }),
  taskController.newTask,
);

// PATCH /task/:taskId
router.patch(
  "/:taskId",
  authMiddleware,
  validate({
    params: taskValidation.updateTaskParamsSchema,
    body: taskValidation.updateTaskSchema,
  }),
  taskController.updateTask,
);

export default router;
