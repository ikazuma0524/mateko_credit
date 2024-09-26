import axios from 'axios';

// APIクライアントを作成
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

export interface AdminCheckResponse {
    is_admin: boolean;
  }
  
  export const checkAdminStatus = async (token: string): Promise<AdminCheckResponse> => {
    try {
      const response = await api.get<AdminCheckResponse>('/api/admin/check', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      throw error;
    }
  };
  
// エラーハンドリングとトークンの付与（認証が必要な場合）
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
