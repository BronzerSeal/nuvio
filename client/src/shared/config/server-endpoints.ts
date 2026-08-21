export const SERVER_ENDPOINTS = {
  company: {
    joinOrCreateCompany: `company/join-or-create`,
    userCompanies: "company/user-companies",

    CompanyMemberships: (companyId: string) =>
      `/company/${companyId}/memberships`,

    companyTimeline: (companyId: string) => `/company/${companyId}/timeline`,
    companyAvailability: (companyId: string) =>
      `/company/${companyId}/availability`,

    companyTasks: (companyId: string) => `/company/${companyId}/tasks`,
    companyTasksCount: (companyId: string) =>
      `/company/${companyId}/tasks-count`,
  },
  user: {
    getMemberships: "user/me/companies",
    findUsers: "user/",
    findMe: "user/me",
    updateMe: "user/me",
  },
  board: {
    createBoard: "/board/new-board",
    companyBoard: "/board/company/", // <- companyId

    getBoardTasks: (boardId: string) => `/board/${boardId}/tasks`,

    deleteBaord: (boardId: string) => `/board/${boardId}`,

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
  availability: {
    getTimeSpans: (availabilityId: string) =>
      `/availability/${availabilityId}/timeSpans`,
    createTimeSpan: (availabilityId: string) =>
      `/availability/${availabilityId}/timeSpans`,
    updateTimeSpan: (availabilityId: string, timeSpanId: string) =>
      `/availability/${availabilityId}/timeSpans/${timeSpanId}`,
    deleteTimeSpan: (availabilityId: string, timeSpanId: string) =>
      `/availability/${availabilityId}/timeSpans/${timeSpanId}`,
  },
  chat: {
    getChatMembers: (companyId: string) => `/chat/${companyId}`,
    getChatMessages: (companyId: string, senderId: string) =>
      `/chat/${companyId}/${senderId}`,
  },
};
