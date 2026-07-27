import api from '../api/axios';

export const auditService = {
  getAll: async () => {
    const response = await api.get('/audit/');
    return response.data;
  },
  
  filter: async (params) => {
    const response = await api.get('/audit/filter', { params });
    return response.data;
  },
  
  getById: async (id) => {
    const response = await api.get(`/audit/${id}`);
    return response.data;
  }
};
