import { Request, Response } from "express";
import {
  createTimeSpanBodyDto,
  createTimeSpanParamsDto,
  DeleteTimeSpanParamsDto,
  getTimeSpansDto,
  UpdateTimeSpanBodyDto,
  UpdateTimeSpanParamsDto,
} from "../validate/availability.validation.js";
import { availabilityService } from "../services/index.js";
import { io } from "../server.js";

type GetTimeSpansRequest = Request<getTimeSpansDto, {}, {}>;
type CreateTimeSpanRequest = Request<
  createTimeSpanParamsDto,
  {},
  createTimeSpanBodyDto
>;
type UpdateTimeSpanRequest = Request<
  UpdateTimeSpanParamsDto,
  {},
  UpdateTimeSpanBodyDto
>;

type DeleteTimeSpanRequest = Request<DeleteTimeSpanParamsDto, {}, {}>;

const getTimeSpans = async (req: GetTimeSpansRequest, res: Response) => {
  const timeSpans = await availabilityService.getTimeSpans({
    availabilityId: req.params.availabilityId,
    userId: req.user.id,
  });

  return res.status(200).json(timeSpans);
};

const createTimeSpan = async (req: CreateTimeSpanRequest, res: Response) => {
  const { availabilityId } = req.params;
  const { start_time, end_time, week_day, active } = req.body;

  const { timeSpan, companyId } = await availabilityService.createTimeSpan({
    userId: req.user.id,
    availabilityId,
    start_time,
    end_time,
    week_day,
    active,
  });

  io.to(`schedule:${companyId}`).emit("availability-updated");

  return res.status(201).json(timeSpan);
};

const updateTimeSpan = async (req: UpdateTimeSpanRequest, res: Response) => {
  const { availabilityId, timeSpanId } = req.params;
  const { start_time, end_time, week_day, active } = req.body;

  const { timeSpan, companyId } = await availabilityService.updateTimeSpan({
    userId: req.user.id,
    availabilityId,
    timeSpanId,
    start_time,
    end_time,
    week_day,
    active,
  });

  io.to(`schedule:${companyId}`).emit("availability-updated");

  return res.status(200).json(timeSpan);
};

const deleteTimeSpan = async (req: DeleteTimeSpanRequest, res: Response) => {
  const { availabilityId, timeSpanId } = req.params;

  const { timeSpan, companyId } = await availabilityService.deleteTimeSpan({
    userId: req.user.id,
    availabilityId,
    timeSpanId,
  });

  io.to(`schedule:${companyId}`).emit("availability-updated");

  return res.status(200).json(timeSpan);
};

export { getTimeSpans, createTimeSpan, updateTimeSpan, deleteTimeSpan };
