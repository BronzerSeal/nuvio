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

    getBoardTasks: (boardId: string) => `/board/${boardId}/tasks`,

    getCurrentBoard: (companyId: string, boardId: string) =>
      `/board/${companyId}/boards/${boardId}`,
  },
  task: {
    createTask: "/task/new-task",

    updateTasks: (boardId: string) => `/task/${boardId}`,
  },
};
