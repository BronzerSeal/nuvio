export const SERVER_ENDPOINTS = {
  company: {
    joinOrCreateCompany: `company/join-or-create`,
    userCompanies: "company/user-companies",

    CompanyMemberships: (companyId: string) =>
      `/company/${companyId}/memberships`,

    companyTimeline: (companyId: string) => `/company/${companyId}/timeline`,
  },
  user: {
    getMemberships: "user/me/companies",
    findUsers: "user/",
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
  timeline: {
    TimelineRow: (timelineId: string) => `/timeline/${timelineId}/rows`,

    TimelineTasks: (timelineId: string) => `/timeline/${timelineId}/tasks`,

    createTimelineTask: (timelineId: string, rowId: string) =>
      `/timeline/${timelineId}/rows/${rowId}/tasks`,

    updateTask: (timelineId: string, taskId: string) =>
      `/timeline/${timelineId}/tasks/${taskId}`,
  },
};
