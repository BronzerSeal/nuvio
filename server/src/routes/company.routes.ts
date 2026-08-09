import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { companyValidation } from "../validate/index.js";
import { companyController } from "../controllers/index.js";

const router = Router();

// POST /company/join-or-create
router.post(
  "/join-or-create",
  authMiddleware,
  validate({
    body: companyValidation.joinOrCreateSchema,
  }),
  companyController.joinOrCreate,
);

// GET /company/user-companies
router.get("/user-companies", authMiddleware, companyController.userCompanies);

// GET /company/:companyId/memberships
router.get(
  "/:companyId/memberships",
  authMiddleware,
  validate({
    params: companyValidation.getCompanyMembersParamsSchema,
    query: companyValidation.getCompanyMembersQuerySchema,
  }),
  companyController.getCompanyMembers,
);

//POST /company/:companyId/memberships
router.post(
  "/:companyId/memberships",
  authMiddleware,
  validate({
    params: companyValidation.createMembershipParamsSchema,
    body: companyValidation.createMembershipSchema,
  }),
  companyController.createMembership,
);

//DELETE /company/:companyId/memberships
router.delete(
  "/:companyId/memberships",
  authMiddleware,
  validate({
    params: companyValidation.deleteMemberParamsSchema,
    query: companyValidation.deleteMemberQuerySchema,
  }),
  companyController.deleteMember,
);

// GET /company/:companyId/tasks
router.get(
  "/:companyId/tasks",
  authMiddleware,
  validate({
    params: companyValidation.getTasksParamsSchema,
    query: companyValidation.getTasksQuerySchema,
  }),
  companyController.getTasks,
);

// GET /company/:companyId/tasks-count
router.get(
  "/:companyId/tasks-count",
  authMiddleware,
  validate({
    params: companyValidation.getTasksCountParamsSchema,
  }),
  companyController.getTasksCount,
);

//GET /company/:companyId/timeline
router.get(
  "/:companyId/timeline",
  authMiddleware,
  validate({
    params: companyValidation.getTimelineParamsSchema,
  }),
  companyController.getTimeline,
);

//GET /company/:companyId/availability
router.get(
  "/:companyId/availability",
  authMiddleware,
  validate({
    params: companyValidation.getAvailabilityParamsSchema,
  }),
  companyController.getAvailability,
);

export default router;
