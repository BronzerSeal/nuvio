import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
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

//user settings

// GET user/me
router.get("/me", authMiddleware, userController.getMe);

// PATCH user/me
router.patch(
  "/me",
  authMiddleware,
  validate({
    body: userValidation.updateUsersQuerySchema,
  }),
  userController.updateMe,
);

export default router;
