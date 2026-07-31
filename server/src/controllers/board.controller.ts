import { Request, Response } from "express";

import {
  boardTasksDto,
  CreateBoardDto,
  deleteBoardDto,
  getAllBoardsDto,
  getBoardDto,
} from "../validate/board.validation.js";
import { boardService } from "../services/index.js";

type CreateBoardRequest = Request<{}, {}, CreateBoardDto>;

type getAllBoardsRequest = Request<getAllBoardsDto, {}, {}>;

type getBoardRequest = Request<getBoardDto, {}, {}>;

type deleteBoardRequest = Request<deleteBoardDto, {}, {}>;

type boardTasksRequest = Request<boardTasksDto, {}, {}>;

const newBoard = async (req: CreateBoardRequest, res: Response) => {
  const board = await boardService.createBoard({
    userId: req.user.id,
    ...req.body,
  });

  return res.status(201).json(board);
};

const getAllBoards = async (req: getAllBoardsRequest, res: Response) => {
  const boards = await boardService.getAllBoards({
    userId: req.user.id,
    ...req.params,
  });
  return res.status(200).json(boards);
};

const getBoard = async (req: getBoardRequest, res: Response) => {
  const board = await boardService.getBoard({
    userId: req.user.id,
    ...req.params,
  });

  return res.status(200).json(board);
};

const deleteBoard = async (req: deleteBoardRequest, res: Response) => {
  await boardService.deleteBoard({
    userId: req.user.id,
    boardId: req.params.boardId,
  });

  return res.status(200).json({
    message: "Board deleted successfully",
  });
};

const boardTasks = async (req: boardTasksRequest, res: Response) => {
  const tasks = await boardService.boardTasks({
    userId: req.user.id,
    boardId: req.params.boardId,
  });

  return res.status(200).json(tasks);
};

export { newBoard, getAllBoards, getBoard, deleteBoard, boardTasks };
