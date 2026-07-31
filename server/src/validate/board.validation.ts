import { z } from "zod";

export const createBoardSchema = z.object({
  name: z.string(),
  companyId: z.string(),
});

export const getAllBoards = z.object({
  companyId: z.string(),
});

export const getBoard = z.object({
  boardId: z.string(),
  companyId: z.string(),
});

export const deleteBoard = z.object({
  boardId: z.string(),
});

export const boardTasks = z.object({
  boardId: z.string(),
});

export type boardTasksDto = z.infer<typeof boardTasks>;
export type CreateBoardDto = z.infer<typeof createBoardSchema>;
export type getAllBoardsDto = z.infer<typeof getAllBoards>;
export type getBoardDto = z.infer<typeof getBoard>;
export type deleteBoardDto = z.infer<typeof deleteBoard>;
