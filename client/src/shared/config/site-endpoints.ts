const SITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL!;

export const SITE_ENDPOINTS = {
  dashboards: `${SITE_URL}/dashboard`,
  loginAndReg: `${SITE_URL}/`,

  companyBoards: (companyId: string) =>
    `${SITE_URL}/dashboard/${companyId}/boards`,

  boards: (companyId: string, boardId: string) =>
    `${SITE_URL}/dashboard/${companyId}/boards/${boardId}`,
};
