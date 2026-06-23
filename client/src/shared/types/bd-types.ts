import { CompanyIcon } from "@/entity/company";

export type User = {
  createdAt: string;
  email: string;
  emailVerified: boolean;
  id: string;
  image: null | string;
  name: string;
  updatedAt: string;
};

export type UserWithMembershipsId = Omit<
  User,
  "createdAt" | "emailVerified" | "updatedAt"
> & {
  isMember: boolean;
  memberships: string[] | [];
};

export type CroppedUser = {
  email: string;
  image: string | undefined;
  name: string;
};

export type Company = {
  id: string;
  name: string;
  logo: CompanyIcon;
  plan: string;
  createdAt: string;
};

export type Board = {
  companyId: string;
  createdAt: Date;
  id: string;
  name: string;
};

export type Task = {
  id: string;
  assigneeId: string;
  boardId: string;

  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  status: "backlog" | "inProgress" | "done";
  dueDate?: string;

  assignee?: {
    id: string;
    image: string | undefined;
    name: string;
  };

  createdAt: Date;
};

export type Membership = {
  companyId: string;
  createdAt: string;
  id: string;
  role: "member" | "admin" | "owner";
  userId: string;
};

export type MembershipWithUser = Membership & { user: CroppedUser };

export type BoardWithTasks = Board & {
  tasks: Task[];
};

export type CursorPaginationResponse<T> = {
  data: T[];
  nextCursor: string | null;
  hasNextPage: boolean;
};
