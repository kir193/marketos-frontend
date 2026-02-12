import axios from 'axios';

const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface BriefingBlock {
  blockNumber: number;
  data: Record<string, any>;
}

export interface BriefingProgress {
  blockNumber: number;
  blockName: string;
  filledRatio: number;
  blockScore: number;
  missingFields: string[];
  confidence: number;
  completedAt: string;
}

export const briefingApi = {
  // Сохранить блок брифинга
  async saveBlock(businessId: number, blockNumber: number, data: Record<string, any>) {
    const response = await api.post(`/briefing/${businessId}/block`, {
      blockNumber,
      data,
    });
    return response.data;
  },

  // Получить весь брифинг
  async getBriefing(businessId: number): Promise<BriefingBlock[]> {
    const response = await api.get(`/briefing/${businessId}`);
    return response.data;
  },

  // Получить прогресс брифинга
  async getProgress(businessId: number): Promise<BriefingProgress[]> {
    const response = await api.get(`/briefing/${businessId}/progress`);
    return response.data;
  },

  // Загрузить голосовой файл
  async uploadVoice(businessId: number, blockNumber: number, audioFile: File) {
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('businessId', businessId.toString());
    formData.append('blockNumber', blockNumber.toString());

    const response = await api.post('/briefing/voice-upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
