import { Request, Response } from "express";
import {
  GetUserCompaniesQueryDto,
  SearchUsersQueryDto,
  UpdateUsersQueryDto,
} from "../validate/user.validation.js";
import { userService } from "../services/index.js";

type SearchUsersRequest = Request<{}, {}, {}, SearchUsersQueryDto>;
type UpdateUsersRequest = Request<{}, {}, UpdateUsersQueryDto, {}>;

const userCompanies = async (req: Request, res: Response) => {
  const query = req.query as unknown as GetUserCompaniesQueryDto;

  const companies = await userService.userCompanies({
    userId: req.user.id,
    limit: query.limit,
  });
  return res.status(200).json(companies);
};

const searchUsers = async (req: SearchUsersRequest, res: Response) => {
  const users = await userService.searchUsers({
    userId: req.user.id,
    ...req.query,
  });

  return res.status(200).json(
    users.map((u) => ({
      ...u,
      isMember: u.memberships.length > 0,
      memberships: u.memberships.map((m) => m.companyId),
    })),
  );
};

const getMe = async (req: Request, res: Response) => {
  const user = await userService.getMe(req.user.id);

  return res.status(200).json(user);
};

const updateMe = async (req: UpdateUsersRequest, res: Response) => {
  const user = await userService.updateMe(req.user.id, req.body);

  return res.status(200).json(user);
};

export { userCompanies, searchUsers, getMe, updateMe };
