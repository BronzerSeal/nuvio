import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { availabilityValidation } from "../validate/index.js";
import { availabilityController } from "../controllers/index.js";

const router = Router();

// GET /availability/:availabilityId/timeSpans
router.get(
  "/:availabilityId/timeSpans",
  authMiddleware,
  validate({
    params: availabilityValidation.getTimeSpansSchema,
  }),
  availabilityController.getTimeSpans,
);

// POST /availability/:availabilityId/timeSpans
router.post(
  "/:availabilityId/timeSpans",
  authMiddleware,
  validate({
    params: availabilityValidation.createTimeSpanParamsSchema,
    body: availabilityValidation.createTimeSpanBodySchema,
  }),
  availabilityController.createTimeSpan,
);

// PATCH /availability/time-spans/:timeSpanId
router.patch(
  "/:availabilityId/timeSpans/:timeSpanId",
  authMiddleware,
  validate({
    params: availabilityValidation.updateTimeSpanParamsSchema,
    body: availabilityValidation.updateTimeSpanBodySchema,
  }),
  availabilityController.updateTimeSpan,
);

// DELETE /availability/:availabilityId/timeSpans/:timeSpanId
router.delete(
  "/:availabilityId/timeSpans/:timeSpanId",
  authMiddleware,
  validate({
    params: availabilityValidation.deleteTimeSpanParamsSchema,
  }),
  availabilityController.deleteTimeSpan,
);

export default router;
