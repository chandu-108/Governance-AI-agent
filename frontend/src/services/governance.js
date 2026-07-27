import api from '../api/axios';

export const governanceService = {
  evaluate: async (payload) => {
    const response = await api.post('/governance/evaluate', payload);
    return response.data;
  }
};
