export const SERVER_ENDPOINTS = {
  company: {
    joinOrCreateCompany: `company/join-or-create`,
    userCompanies: "company/user-companies",
  },
  user: {
    getMemberships: "user/me/companies",
  },
  board: {
    createBoard: "/board/new-board",
    companyBoard: "/board/company/", // <- companyId
  },
};
