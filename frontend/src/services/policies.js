import api from '../api/axios';

export const policiesService = {
  getAll: async () => {
    const response = await api.get('/policies/');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/policies/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/policies/', data);
    return response.data;
  },

  update: async ({ id, data }) => {
    const response = await api.put(`/policies/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/policies/${id}`);
    return response.data;
  },
};
