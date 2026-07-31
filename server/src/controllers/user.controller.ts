import { Request, Response } from "express";
import {
  GetUserCompaniesQueryDto,
  SearchUsersQueryDto,
} from "../validate/user.validation.js";
import { userService } from "../services/index.js";

const userCompanies = async (req: Request, res: Response) => {
  const query = req.query as unknown as GetUserCompaniesQueryDto;

  const companies = await userService.userCompanies({
    userId: req.user.id,
    limit: query.limit,
  });
  return res.status(200).json(companies);
};

type SearchUsersRequest = Request<{}, {}, {}, SearchUsersQueryDto>;

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

export { userCompanies, searchUsers };
