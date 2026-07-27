import { Request, Response } from "express";
import { io } from "../server.js";
import {
  CreateTaskDto,
  UpdateTaskDto,
  UpdateTaskParamsDto,
} from "../validate/task.validation.js";
import { taskService } from "../services/task.service.js";

type CreateTaskRequest = Request<{}, {}, CreateTaskDto>;

const newTask = async (req: CreateTaskRequest, res: Response) => {
  const task = await taskService.createTask({
    userId: req.user.id,
    ...req.body,
  });

  io.to(req.body.boardId).emit("board-updated");

  return res.status(201).json(task);
};

type UpdateTaskRequest = Request<UpdateTaskParamsDto, {}, UpdateTaskDto>;

const updateTask = async (req: UpdateTaskRequest, res: Response) => {
  const { taskId } = req.params;

  const updated = await taskService.updateTask({
    userId: req.user.id,
    taskId: taskId,
    ...req.body,
  });

  io.to(req.body.boardId).emit("board-updated");

  return res.status(200).json(updated);
};

export { newTask, updateTask };
