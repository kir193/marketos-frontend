import axios from 'axios';

// Backend API URL - можно вынести в .env
const API_BASE_URL = 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Briefing API
export const briefingApi = {
  // Сохранить блок брифинга
  saveBlock: async (businessId: number, blockNumber: number, data: Record<string, any>) => {
    const response = await api.post(`/briefing/${businessId}/block`, {
      blockNumber,
      data,
    });
    return response.data;
  },

  // Получить весь брифинг
  getBriefing: async (businessId: number) => {
    const response = await api.get(`/briefing/${businessId}`);
    return response.data;
  },

  // Получить прогресс
  getProgress: async (businessId: number) => {
    const response = await api.get(`/briefing/${businessId}/progress`);
    return response.data;
  },

  // Загрузить голосовой ввод
  uploadVoice: async (businessId: number, blockNumber: number, fileUrl: string) => {
    const response = await api.post('/briefing/voice-upload', {
      businessId,
      blockNumber,
      fileUrl,
    });
    return response.data;
  },
};

// Business API
export const businessApi = {
  // Получить список бизнесов
  getAll: async () => {
    // TODO: Реализовать эндпоинт на бэке
    return [];
  },

  // Создать новый бизнес
  create: async (data: { name: string; industry?: string; website?: string }) => {
    // TODO: Реализовать эндпоинт на бэке
    return { id: 1, ...data };
  },
};
