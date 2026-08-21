import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { chatValidation } from "../validate/index.js";
import { chatController } from "../controllers/index.js";

const router = Router();

// GET /chat/:companyId
router.get(
  "/:companyId",
  authMiddleware,
  validate({
    params: chatValidation.getChatMembers,
    query: chatValidation.getChatMembersQuerySchema,
  }),
  chatController.getChatMembers,
);

// GET /chat/:companyId/:senderId
router.get(
  "/:companyId/:senderId",
  authMiddleware,
  validate({
    params: chatValidation.getChatMessages,
    query: chatValidation.getChatMembersQuerySchema,
  }),
  chatController.getChatMessages,
);

// POST /chat/:companyId/:senderId
router.post(
  "/:companyId/:senderId",
  authMiddleware,
  validate({
    params: chatValidation.getChatMessages,
    body: chatValidation.sendChatMessageBody,
  }),
  chatController.sendChatMessage,
);

export default router;
