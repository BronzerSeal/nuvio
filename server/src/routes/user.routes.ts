import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import prisma from "../lib/prisma.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { validate } from "../middleware/validate.middleware.js";
import { userValidation } from "../validate/index.js";
import { userController } from "../controllers/index.js";

const router = Router();

// GET user/me/companies
router.get(
  "/me/companies",
  authMiddleware,
  validate({
    query: userValidation.getUserCompaniesQuerySchema,
  }),
  userController.userCompanies,
);

//GET user/
router.get(
  "/",
  authMiddleware,
  validate({
    query: userValidation.searchUsersQuerySchema,
  }),
  userController.searchUsers,
);

export default router;
