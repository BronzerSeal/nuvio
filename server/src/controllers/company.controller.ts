import { Request, Response } from "express";
import {
  CreateMembershipDto,
  CreateMembershipParamsDto,
  DeleteMemberParamsDto,
  DeleteMemberQueryDto,
  GetCompanyMembersParamsDto,
  GetCompanyMembersQueryDto,
  GetTimelineParamsDto,
  JoinOrCreateDto,
} from "../validate/company.validation.js";
import { companyService } from "../services/index.js";

type joinOrCreateRequest = Request<{}, {}, JoinOrCreateDto>;

type GetCompanyMembersRequest = Request<GetCompanyMembersParamsDto>;

const joinOrCreate = async (req: joinOrCreateRequest, res: Response) => {
  const member = await companyService.joinOrCreate({
    userId: req.user.id,
    companyName: req.body.companyName.trim().toLowerCase(),
    description: req.body.description,
    logo: req.body.logo,
  });

  return res.status(200).json(member);
};

const userCompanies = async (req: Request, res: Response) => {
  const companies = await companyService.userCompanies(req.user.id);

  return res.status(200).json(companies);
};

const getCompanyMembers = async (
  req: GetCompanyMembersRequest,
  res: Response,
) => {
  const { limit, cursorId } = req.query as unknown as GetCompanyMembersQueryDto;

  const result = await companyService.getCompanyMembers({
    userId: req.user.id,
    companyId: req.params.companyId,
    limit: limit,
    cursorId: cursorId,
  });

  return res.status(200).json(result);
};

type CreateMembershipRequest = Request<
  CreateMembershipParamsDto,
  {},
  CreateMembershipDto
>;

const createMembership = async (
  req: CreateMembershipRequest,
  res: Response,
) => {
  const member = await companyService.createMembership({
    userId: req.user.id,
    companyId: req.params.companyId,
    ...req.body,
  });

  return res.status(201).json(member);
};

type DeleteMemberRequest = Request<
  DeleteMemberParamsDto,
  {},
  {},
  DeleteMemberQueryDto
>;

const deleteMember = async (req: DeleteMemberRequest, res: Response) => {
  const member = await companyService.deleteMember({
    userId: req.user.id,
    companyId: req.params.companyId,
    memberId: req.query.memberId,
  });

  return res.status(200).json(member);
};

type GetTimelineRequest = Request<GetTimelineParamsDto>;

const getTimeline = async (req: GetTimelineRequest, res: Response) => {
  const timeline = await companyService.getTimeline({
    userId: req.user.id,
    companyId: req.params.companyId,
  });

  return res.status(200).json(timeline);
};

export {
  joinOrCreate,
  userCompanies,
  getCompanyMembers,
  createMembership,
  deleteMember,
  getTimeline,
};
