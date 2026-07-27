import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { boardValidation } from "../validate/index.js";
import { boardController } from "../controllers/index.js";
import { getBoard } from "../validate/board.validation.js";

const router = Router();

// POST /board/new-board
router.post(
  "/new-board",
  authMiddleware,
  validate({
    body: boardValidation.createBoardSchema,
  }),
  boardController.newBoard,
);

// GET /board/company/:companyId
router.get(
  "/company/:companyId",
  authMiddleware,
  validate({
    params: boardValidation.getAllBoards,
  }),
  boardController.getAllBoards,
);

//GET /board/:companyId/boards/:boardId
router.get(
  "/:companyId/boards/:boardId",
  authMiddleware,
  validate({
    params: getBoard,
  }),
  boardController.getBoard,
);

// DELETE /board/:boardId
router.delete(
  "/:boardId",
  authMiddleware,
  validate({
    params: boardValidation.deleteBoard,
  }),
  boardController.deleteBoard,
);

//GET /board/:boardId/tasks
router.get(
  "/:boardId/tasks",
  authMiddleware,
  validate({
    params: boardValidation.boardTasks,
  }),
  boardController.boardTasks,
);

export default router;
