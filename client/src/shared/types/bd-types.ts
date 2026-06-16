import { CompanyIcon } from "@/entity/company";

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
