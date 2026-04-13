// API 基础配置
const API_BASE_URL = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || '';

// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  token?: string;
}

// 验证码响应
export interface CaptchaResponse {
  id: string;
  svg: string;
}

// 联系表单请求
export interface ContactFormRequest {
  name: string;
  company?: string;
  phone: string;
  email: string;
  message?: string;
  captchaId: string;
  captchaText: string;
}

// API 客户端类
export class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    // 从 localStorage 加载 token (SSR-safe)
    this.token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
  }

  // 通用请求方法
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // 如果有 token，添加到请求头
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        // 处理 401 未授权错误
        if (response.status === 401) {
          this.clearToken();
          throw new Error('认证失败，请重新登录');
        }
        throw new Error(data.error || '请求失败');
      }

      return data;
    } catch (error) {
      console.error('API 请求错误:', error);
      throw error;
    }
  }

  // 获取验证码
  async getCaptcha(): Promise<CaptchaResponse> {
    const res = await fetch((typeof process !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) || '' + '/api/captcha');
    const data = await res.json();
    return { id: data.captchaId || data.id, svg: data.svg };
  }

  // 提交联系表单
  async submitContactForm(data: ContactFormRequest): Promise<void> {
    await this.request('/api/audit/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // 管理员登录
  async login(username: string, password: string): Promise<string> {
    const response = await this.request<{ token: string }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    if (response.token) {
      this.token = response.token;
      if (typeof window !== 'undefined') localStorage.setItem('authToken', response.token);
    }

    return response.token!;
  }

  // 验证 token
  async verifyToken(): Promise<boolean> {
    try {
      await this.request('/api/admin/verify');
      return true;
    } catch {
      this.clearToken();
      return false;
    }
  }

  // 清除 token
  clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') localStorage.removeItem('authToken');
  }

  // 获取配置
  async getConfig(): Promise<any> {
    const response = await this.request('/api/admin/config');
    return response.data;
  }
}

// 导出单例实例
export const apiClient = new ApiClient();
