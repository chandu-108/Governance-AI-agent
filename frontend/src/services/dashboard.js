import api from '../api/axios';

export const dashboardService = {
  getSummary: async () => {
    const response = await api.get('/dashboard/summary');
    return response.data;
  },
  getAuditStats: async () => {
    const response = await api.get('/dashboard/audit');
    return response.data;
  },
  getAgentStats: async () => {
    const response = await api.get('/dashboard/agents');
    return response.data;
  },
  getBudgetStats: async () => {
    const response = await api.get('/dashboard/budgets');
    return response.data;
  }
};
