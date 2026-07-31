import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { timelineValidation } from "../validate/index.js";
import { validate } from "../middleware/validate.middleware.js";
import { timelineController } from "../controllers/index.js";

const router = Router();

//POST /timeline/:timelineId/rows
router.post(
  "/:timelineId/rows",
  authMiddleware,
  validate({
    params: timelineValidation.createTimelineRowParamsSchema,
    body: timelineValidation.createTimelineRowSchema,
  }),
  timelineController.createRow,
);

// DELETE /timeline/:timelineId/rows
router.delete(
  "/:timelineId/rows",
  authMiddleware,
  validate({
    params: timelineValidation.deleteTimelineRowsParamsSchema,
    body: timelineValidation.deleteTimelineRowsSchema,
  }),
  timelineController.deleteRows,
);

// GET /timeline/:timelineId/rows
router.get(
  "/:timelineId/rows",
  authMiddleware,
  validate({
    params: timelineValidation.getTimelineRowsParamsSchema,
  }),
  timelineController.getRows,
);

//TASKS

//POST /timeline/:timelineId/rows/:rowId/tasks
router.post(
  "/:timelineId/rows/:rowId/tasks",
  authMiddleware,
  validate({
    params: timelineValidation.createTimelineTaskParamsSchema,
    body: timelineValidation.createTimelineTaskSchema,
  }),
  timelineController.createTask,
);

//GET /timeline/:timelineId/tasks
router.get(
  "/:timelineId/tasks",
  authMiddleware,
  validate({
    params: timelineValidation.getTimelineTasksParamsSchema,
  }),
  timelineController.getTasks,
);

//PATCH /timeline/:timelineId/tasks/:taskId
router.patch(
  "/:timelineId/tasks/:taskId",
  authMiddleware,
  validate({
    params: timelineValidation.updateTimelineTaskParamsSchema,
    body: timelineValidation.updateTimelineTaskSchema,
  }),
  timelineController.updateTask,
);

//DELETE /timeline/:timelineId/tasks
router.delete(
  "/:timelineId/tasks",
  authMiddleware,
  validate({
    params: timelineValidation.deleteTimelineTasksParamsSchema,
    body: timelineValidation.deleteTimelineTasksSchema,
  }),
  timelineController.deleteTasks,
);

export default router;
