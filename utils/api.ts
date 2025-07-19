import { APP_CONFIG } from '@/constants/app-config';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class APIService {
  private static baseUrl = APP_CONFIG.api.baseUrl;
  private static timeout = APP_CONFIG.api.timeout;

  private static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      console.error('API request failed:', error);
      
      if (error instanceof Error) {
        return { 
          success: false, 
          error: error.message,
          message: 'Request failed. Please try again.'
        };
      }
      
      return { 
        success: false, 
        error: 'Unknown error',
        message: 'An unexpected error occurred.'
      };
    }
  }

  static async get<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  static async post<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async put<T>(endpoint: string, data: any): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  static async delete<T>(endpoint: string): Promise<APIResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // AI Service specific methods
  static async sendMessageToAI(
    serviceId: string,
    message: string,
    context?: any
  ): Promise<APIResponse<{ response: string; usage?: any }>> {
    return this.post(`/ai/${serviceId}/chat`, {
      message,
      context,
    });
  }

  static async getAIServiceStatus(serviceId: string): Promise<APIResponse<{
    isConnected: boolean;
    usage: any;
  }>> {
    return this.get(`/ai/${serviceId}/status`);
  }

  static async connectAIService(
    serviceId: string,
    credentials: any
  ): Promise<APIResponse<{ success: boolean }>> {
    return this.post(`/ai/${serviceId}/connect`, credentials);
  }

  static async disconnectAIService(serviceId: string): Promise<APIResponse<{ success: boolean }>> {
    return this.delete(`/ai/${serviceId}/disconnect`);
  }
}