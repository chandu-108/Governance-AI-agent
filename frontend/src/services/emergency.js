import api from '../api/axios';

export const emergencyService = {
  getStatus: async () => {
    const response = await api.get('/emergency/status');
    return response.data;
  },

  enableGlobal: async (reason) => {
    const response = await api.post('/emergency/global/enable', { reason });
    return response.data;
  },

  disableGlobal: async () => {
    const response = await api.post('/emergency/global/disable');
    return response.data;
  },

  enableAgent: async (agentId, reason) => {
    const response = await api.post(`/emergency/agent/${agentId}/enable`, { reason });
    return response.data;
  },

  disableAgent: async (agentId) => {
    const response = await api.post(`/emergency/agent/${agentId}/disable`);
    return response.data;
  }
};
