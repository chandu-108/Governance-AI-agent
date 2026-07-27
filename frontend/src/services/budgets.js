import api from '../api/axios';

export const budgetsService = {
  getAll: async () => {
    const response = await api.get('/budgets/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/budgets/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/budgets/', data);
    return response.data;
  },

  update: async ({ id, data }) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/budgets/${id}`);
    return { success: true };
  },

  addUsage: async ({ id, amount }) => {
    const response = await api.post(`/budgets/${id}/usage`, { amount });
    return response.data;
  },

  validate: async (id) => {
    const response = await api.post(`/budgets/${id}/validate`);
    return response.data;
  },
};
