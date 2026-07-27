import api from '../api/axios';

export const permissionsService = {
  getAll: async () => {
    const response = await api.get('/permissions/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/permissions/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/permissions/', data);
    return response.data;
  },

  update: async ({ id, data }) => {
    const response = await api.put(`/permissions/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/permissions/${id}`);
    return { success: true };
  },
};
