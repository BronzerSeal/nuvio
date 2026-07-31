import { Request, Response } from "express";
import {
  CreateTimelineRowDto,
  CreateTimelineRowParamsDto,
  CreateTimelineTaskDto,
  CreateTimelineTaskParamsDto,
  DeleteTimelineRowsDto,
  DeleteTimelineRowsParamsDto,
  DeleteTimelineTasksDto,
  DeleteTimelineTasksParamsDto,
  GetTimelineRowsParamsDto,
  GetTimelineTasksParamsDto,
  UpdateTimelineTaskDto,
  UpdateTimelineTaskParamsDto,
} from "../validate/timeline.validation.js";
import { io } from "../server.js";
import { timelineService } from "../services/index.js";

type CreateTimelineRowRequest = Request<
  CreateTimelineRowParamsDto,
  {},
  CreateTimelineRowDto
>;

type DeleteRowsRequest = Request<
  DeleteTimelineRowsParamsDto,
  {},
  DeleteTimelineRowsDto
>;

type GetTimelineRowsRequest = Request<GetTimelineRowsParamsDto>;

type CreateTimelineTaskRequest = Request<
  CreateTimelineTaskParamsDto,
  {},
  CreateTimelineTaskDto
>;

type GetTimelineTasksRequest = Request<GetTimelineTasksParamsDto>;

type DeleteTimelineTasksRequest = Request<
  DeleteTimelineTasksParamsDto,
  {},
  DeleteTimelineTasksDto
>;

type UpdateTimelineTaskRequest = Request<
  UpdateTimelineTaskParamsDto,
  {},
  UpdateTimelineTaskDto
>;

const createRow = async (req: CreateTimelineRowRequest, res: Response) => {
  const row = await timelineService.createRow({
    userId: req.user.id,
    timelineId: req.params.timelineId,
    rowName: req.body.rowName,
  });

  io.to(req.params.timelineId).emit("timeline-row-updated");

  return res.status(201).json(row);
};

const deleteRows = async (req: DeleteRowsRequest, res: Response) => {
  const deletedCount = await timelineService.deleteRows({
    userId: req.user.id,
    timelineId: req.params.timelineId,
    rowIds: req.body.rowIds,
  });

  io.to(req.params.timelineId).emit("timeline-row-updated");

  return res.status(200).json({
    deletedCount,
  });
};

const getRows = async (req: GetTimelineRowsRequest, res: Response) => {
  const rows = await timelineService.getRows({
    userId: req.user.id,
    timelineId: req.params.timelineId,
  });

  return res.status(200).json(rows);
};

const createTask = async (req: CreateTimelineTaskRequest, res: Response) => {
  const task = await timelineService.createTask({
    userId: req.user.id,
    timelineId: req.params.timelineId,
    rowId: req.params.rowId,
    ...req.body,
  });

  io.to(req.params.timelineId).emit("timeline-task-updated");

  return res.status(201).json(task);
};

const getTasks = async (req: GetTimelineTasksRequest, res: Response) => {
  const tasks = await timelineService.getTasks({
    userId: req.user.id,
    timelineId: req.params.timelineId,
  });

  return res.status(200).json(tasks);
};

const updateTask = async (req: UpdateTimelineTaskRequest, res: Response) => {
  const task = await timelineService.updateTask({
    userId: req.user.id,
    timelineId: req.params.timelineId,
    taskId: req.params.taskId,
    ...req.body,
  });

  io.to(req.params.timelineId).emit("timeline-task-updated");

  return res.status(200).json(task);
};

const deleteTasks = async (req: DeleteTimelineTasksRequest, res: Response) => {
  const deletedCount = await timelineService.deleteTasks({
    userId: req.user.id,
    timelineId: req.params.timelineId,
    taskIds: req.body.taskIds,
  });

  io.to(req.params.timelineId).emit("timeline-task-updated");

  return res.status(200).json({
    deletedCount,
  });
};

export {
  createRow,
  deleteRows,
  getRows,
  createTask,
  getTasks,
  updateTask,
  deleteTasks,
};
