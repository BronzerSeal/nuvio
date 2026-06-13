export type Company = {
  id: string;
  name: string;
  createdAt: string;
};

export type Board = {
  companyId: string;
  createdAt: Date;
  id: string;
  name: string;
};
