const SITE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL!;

export const SITE_ENDPOINTS = {
  dashboards: `${SITE_URL}/dashboard`,
  loginAndReg: `${SITE_URL}/`,
  account: `${SITE_URL}/account`,

  company: (companyId: string) => `${SITE_URL}/dashboard/${companyId}`,

  companyBoards: (companyId: string) =>
    `${SITE_URL}/dashboard/${companyId}/boards`,

  boards: (companyId: string, boardId: string) =>
    `${SITE_URL}/dashboard/${companyId}/boards/${boardId}`,

  settings: (companyId: string, settingsType: string) =>
    `${SITE_URL}/dashboard/${companyId}/settings/${settingsType}`,
};
